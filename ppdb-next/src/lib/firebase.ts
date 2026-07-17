import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCzOcqyT0cu53GnbBRcVJBYCPZxyekcYMs",
  authDomain: "dpsi-ppdb.firebaseapp.com",
  projectId: "dpsi-ppdb",
  storageBucket: "dpsi-ppdb.firebasestorage.app",
  messagingSenderId: "916258794352",
  appId: "1:916258794352:web:037c14c1960df849487db5",
  measurementId: "G-Q0FS7Z9P4G"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
