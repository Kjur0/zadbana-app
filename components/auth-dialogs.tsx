"use client"

import { useRef } from "react"
import { CircleUser } from "lucide-react"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useLogin } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
export default function LoginDialog() {
  const dialogCloseRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()
  const handleLogin = useLogin(dialogCloseRef)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <CircleUser /> Zaloguj
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleLogin} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Zaloguj się</DialogTitle>
            <DialogDescription>Wprowadź dane logowania</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Adres email</FieldLabel>
              <Input id="email" name="email" type="email" required />
            </Field>
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Hasło</FieldLabel>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Zapomniałeś hasła?
                </a>
              </div>
              <Input id="password" type="password" required />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button ref={dialogCloseRef} variant="ghost">
                Anuluj
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                router.push("/register")
                dialogCloseRef.current?.click()
              }}
            >
              Stwórz konto
            </Button>
            <Button type="submit">Zaloguj</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
