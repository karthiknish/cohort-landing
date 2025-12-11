import { initializeApp, getApps, cert, App, ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let app: App;
let db: Firestore;
let adminAuth: Auth;

/**
 * Decode and parse the service account from base64 environment variable
 */
const getServiceAccount = (): ServiceAccount => {
  const base64ServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  
  if (!base64ServiceAccount) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable is not set. ' +
      'Please set it with the base64-encoded Firebase service account JSON.'
    );
  }

  try {
    const decodedJson = Buffer.from(base64ServiceAccount, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(decodedJson) as ServiceAccount;
    
    // Validate required fields
    if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
      throw new Error('Invalid service account: missing required fields (projectId, clientEmail, or privateKey)');
    }
    
    return serviceAccount;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse service account JSON. Ensure it is valid JSON encoded in base64.');
    }
    throw error;
  }
};

const initializeFirebaseAdmin = () => {
  if (getApps().length === 0) {
    const serviceAccount = getServiceAccount();
    app = initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    app = getApps()[0];
  }

  db = getFirestore(app);
  adminAuth = getAuth(app);

  return { app, db, adminAuth };
};

export const getAdminFirestore = (): Firestore => {
  if (!db) {
    initializeFirebaseAdmin();
  }
  return db;
};

export const getAdminAuth = (): Auth => {
  if (!adminAuth) {
    initializeFirebaseAdmin();
  }
  return adminAuth;
};

export { initializeFirebaseAdmin };
