
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCt9p-B3TVgWjt4SNcKGQi_Q1qH9r5lR2Q",
  authDomain: "solar-220.firebaseapp.com",
  projectId: "solar-220",
  storageBucket: "solar-220.firebasestorage.app",
  messagingSenderId: "194945466085",
  appId: "1:194945466085:web:03d11460c2980f36a7de0c"
};

console.log('🔥 Inicializando Firebase...');
console.log('⚙️ Config:', firebaseConfig);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log('✅ Firebase inicializado');
console.log('🔐 Auth instance:', auth);
console.log('🗄️ Firestore instance:', db);

export default app;
