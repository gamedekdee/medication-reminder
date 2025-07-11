import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDLpiSGoXWUAahmFgCf-CsV-3_VHKpbRFo",
  authDomain: "medication-reminder-c2d6e.firebaseapp.com",
  projectId: "medication-reminder-c2d6e",
  storageBucket: "medication-reminder-c2d6e.firebasestorage.app",
  messagingSenderId: "308540733116",
  appId: "1:308540733116:web:ae16241a4a1ef7459902b9",
}

// ตรวจสอบไม่ให้ init ซ้ำ
const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
