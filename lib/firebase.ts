import { initializeApp } from "firebase/app";
import { getAuth, User, UserProfile } from "firebase/auth";
import { collection, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export async function getUserData() {
  const user = auth.currentUser

  if (!user) return null;

  const ref = doc(collection(db, "users"), user.uid)
  const data = await getDoc(ref)
  if (data.exists())
    return data.data
  await setDoc(ref, { loggedIn: true }, { merge: true });
  return await getDoc(ref)
}