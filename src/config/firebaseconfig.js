import { getAuth } from "firebase/auth"
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAAnfU2OlmF-FMf0LM3V0KQZLUQ69avrGw",
  authDomain: "cesupa-finance.firebaseapp.com",
  projectId: "cesupa-finance",
  storageBucket: "cesupa-finance.appspot.com",
  messagingSenderId: "531254272691",
  appId: "1:531254272691:web:af49e730f2e42133da06c6",
  measurementId: "G-CF5N86WV3C",
  databaseURL: "https://cesupa-finance-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const database = getDatabase(app);