import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable "${name}" required for Firebase configuration.`);
  }
  return value;
}

const firebaseConfig = {
  apiKey: getEnvVar("FIREBASE_API_KEY"),
  authDomain: getEnvVar("FIREBASE_AUTH_DOMAIN"),
  projectId: getEnvVar("FIREBASE_PROJECT_ID"),
  storageBucket: getEnvVar("FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnvVar("FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnvVar("FIREBASE_APP_ID"),
  measurementId: getEnvVar("FIREBASE_MEASUREMENT_ID"),
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
