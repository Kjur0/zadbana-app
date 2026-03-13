import { doc, collection, setDoc, updateDoc } from "firebase/firestore"
import { auth, db } from "./firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"

const config = doc(collection(db, "config"), "config")

export async function step0() {
  await setDoc(
    config,
    {
      setupStep: 1,
    },
    {
      merge: true,
    }
  )
}

export async function step1({
  name,
  domains,
}: {
  name: string
  domains: Array<string>
}) {
  await setDoc(
    config,
    { school: { name }, domains, setupStep: 2 },
    { merge: true }
  )
}

export async function step2({
  email,
  password,
}: {
  email: string
  password: string
}) {
  const user = await createUserWithEmailAndPassword(auth, email, password)
  await setDoc(
    config,
    { admins: [user.user.uid], setupStep: 3 },
    { merge: true }
  )
}
