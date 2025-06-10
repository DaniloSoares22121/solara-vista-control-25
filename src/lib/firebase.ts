
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableNetwork } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCt9p-B3TVgWjt4SNcKGQi_Q1qH9r5lR2Q",
  authDomain: "solar-220.firebaseapp.com",
  projectId: "solar-220",
  storageBucket: "solar-220.firebasestorage.app",
  messagingSenderId: "194945466085",
  appId: "1:194945466085:web:03d11460c2980f36a7de0c"
};

console.log('🔥 [FIREBASE] Inicializando Firebase...');
console.log('⚙️ [FIREBASE] Config:', firebaseConfig);

const app = initializeApp(firebaseConfig);
console.log('✅ [FIREBASE] App inicializado:', app);

export const auth = getAuth(app);
console.log('🔐 [FIREBASE] Auth instance criada:', auth);

export const db = getFirestore(app);
console.log('🗄️ [FIREBASE] Firestore instance criada:', db);

// Verificar se está conectado
enableNetwork(db)
  .then(() => {
    console.log('✅ [FIREBASE] Firestore conectado com sucesso!');
  })
  .catch((error) => {
    console.error('❌ [FIREBASE] Erro ao conectar Firestore:', error);
  });

console.log('✅ [FIREBASE] Firebase totalmente inicializado');

export default app;
