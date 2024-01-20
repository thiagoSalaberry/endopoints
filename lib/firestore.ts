import admin from "firebase-admin";

const serviceAccount = JSON.parse(String(process.env.FIRESTORE_CONNECTION));

if(admin.app.length == 0) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const firestore = admin.firestore();

export { firestore };