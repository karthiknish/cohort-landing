# Firebase Configuration

## Setup Instructions

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Firestore Database
3. Enable Authentication with Email/Password
4. Copy your web app config values below

## Environment Variables

Copy these to `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# For Firebase Admin SDK (server-side)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=your-service-account-email
FIREBASE_ADMIN_PRIVATE_KEY="your-private-key"
```

## Firestore Collections

### `leads`
- name: string
- email: string
- phone: string
- company: string
- createdAt: timestamp
- status: 'new' | 'contacted' | 'converted'

### Admin User Setup
Create a user in Firebase Auth console for admin access
