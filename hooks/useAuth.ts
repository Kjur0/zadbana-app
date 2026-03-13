import { RefObject, useEffect, useState } from "react"

import { signInWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { toast } from "sonner"

export function useRegister() {}

export function useLogin(dialogCloseRef?: RefObject<HTMLButtonElement | null>) {
  const router = useRouter()

  return (e: React.SubmitEvent) => {
    "use client"
    e.preventDefault()
    const { email, password } = {
      email: (
        document.getElementById("email") as HTMLInputElement
      )?.value.toString(),
      password: (
        document.getElementById("password") as HTMLInputElement
      )?.value.toString(),
    }

    if (email != undefined && password != undefined)
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          if (dialogCloseRef?.current != null) dialogCloseRef.current.click()
          router.push("/")
        })
        .catch((err) => {
          switch (err.message) {
            case "Firebase: Error (auth/invalid-email).":
              toast.error("Nieprawidłowy adres email", {
                description: "Sprawdź format adresu email i spróbuj ponownie",
                position: "top-center",
              })
              return
            case "Firebase: Error (auth/user-not-found).":
              toast.error("Nie znaleziono użytkownika", {
                description:
                  "Nie ma konta z takim adresem email. Sprawdź dane logowania lub stwórz nowe konto",
                position: "top-center",
              })
              return
            case "Firebase: Error (auth/wrong-password).":
              toast.error("Nieprawidłowe hasło", {
                description: "Sprawdź swoje hasło i spróbuj ponownie",
                position: "top-center",
              })
              return
            default:
              toast.error("Nie można się zalogować", {
                description: "Spróbuj ponownie później",
                position: "top-center",
              })
          }
        })
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return unsubscribe
  }, [])

  return { user }
}
