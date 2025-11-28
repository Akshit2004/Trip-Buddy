import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;

    if (!projectId || !privateKey || !clientEmail) {
        throw new Error('Missing Firebase Admin credentials. Please check FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_PRIVATE_KEY and FIREBASE_ADMIN_CLIENT_EMAIL in .env.local');
    }

    console.log('Admin env check', {
        projectId: !!projectId,
        privateKey: !!privateKey,
        clientEmail: !!clientEmail,
    });

    // Remove possible wrapping quotes and fix escaped newlines
    const cleanedPrivateKey = privateKey
        .replace(/^"/, '')
        .replace(/"$/, '')
        .replace(/\\n/g, '\n');

    admin.initializeApp({
        credential: admin.credential.cert({
            projectId,
            privateKey: cleanedPrivateKey,
            clientEmail,
        }),
    });
}

const db = admin.firestore();

export { admin, db };
