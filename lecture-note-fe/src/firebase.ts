import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB_472wi_Sh4x2jbmp217r2OmbltD54gPE",
  authDomain: "storm-39766.firebaseapp.com",
  projectId: "storm-39766",
  storageBucket: "storm-39766.firebasestorage.app",
  messagingSenderId: "76503808065",
  appId: "1:76503808065:web:8ae50a0a8d765f36776ec0",
  measurementId: "G-K7TPBQC9C1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
