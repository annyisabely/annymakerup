// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// TODO: SUBSTITUA ESTE OBJETO PELAS SUAS CHAVES DO FIREBASE CONSOLE
// 1. Vá em https://console.firebase.google.com/
// 2. Crie um projeto novo
// 3. Adicione um "Web App" (ícone de </>).
// 4. Copie o objeto firebaseConfig que vai aparecer na tela e cole aqui embaixo:

const firebaseConfig = {
  apiKey: "COLE_AQUI_SUA_API_KEY",
  authDomain: "seu-projeto-firebase.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto-firebase.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456",
  measurementId: "G-XXXXXXXXX"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
// Inicializa o Banco de Dados Firestore
const db = getFirestore(app);

export { db };
