type RawServiceAccount = {
  client_email?: string;
  private_key?: string;
};

export function getGoogleServiceAccountFromBase64(): RawServiceAccount {
  const base64 =
    process.env.GOOGLE_SERVICE_ACCOUNT_BASE64 ||
    process.env.GA4_SERVICE_ACCOUNT_BASE64 ||
    process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

  if (!base64) {
    throw new Error(
      'Missing GOOGLE_SERVICE_ACCOUNT_BASE64 (or GA4_SERVICE_ACCOUNT_BASE64). ' +
        'This must be a base64-encoded Google service account JSON with access to the GA4 property.'
    );
  }

  const decoded = Buffer.from(base64, 'base64').toString('utf-8');
  const json = JSON.parse(decoded) as RawServiceAccount;

  if (!json.client_email || !json.private_key) {
    throw new Error('Invalid service account JSON: missing client_email/private_key');
  }

  return json;
}
