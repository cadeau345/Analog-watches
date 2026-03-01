import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC6Na61pWwy1EthcAM2rDc_WtwaewFGLGQ",
  authDomain: "analog-watches-380b5.firebaseapp.com",
  projectId: "analog-watches-380b5",
  storageBucket: "analog-watches-380b5.firebasestorage.app",
  messagingSenderId: "401445353537",
  appId: "1:401445353537:web:bf4ff092d718093026eec0"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };