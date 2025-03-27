// Create this new file
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCNX6_6m0eU9yf1v_lOBo-8nWo9yGX_AsM",
  authDomain: "blog-50ad9.firebaseapp.com",
  projectId: "blog-50ad9",
  storageBucket: "blog-50ad9.firebasestorage.app",
  messagingSenderId: "946160300805",
  appId: "1:946160300805:web:db63f6034ea5fc95c7bd6c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };