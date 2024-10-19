import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDX4F5EjNL3KAlC-0xjQte5DgUdLVqh0ro",
    authDomain: "annote-test-43e91.firebaseapp.com",
    projectId: "annote-test-43e91",
    storageBucket: "annote-test-43e91.appspot.com",
    messagingSenderId: "529345981223",
    appId: "1:529345981223:web:800d74a683588c983dd702"  
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };