"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { auth, db } from "@/lib/firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  validatePassword,
} from "firebase/auth"
import Link from "next/link"
import { toast } from "sonner"
import { Controller, MultipleFieldErrors, useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { collection, doc, getDoc } from "firebase/firestore"
import { errorsAdapter } from "@/lib/utils"

interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
}

export default function Page() {
  const {
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    control,
  } = useForm<RegisterForm>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    criteriaMode: "all",
  })

  const router = useRouter()

  const submit = (data: RegisterForm) => {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        toast.success("Konto zostało utworzone")
        router.push("/")
      })
      .catch((error) => {})
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="w-full max-w-lg">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Stwórz konto</CardTitle>
          <CardDescription>
            Wprowadź informacje potrzebne do stworzenia konta. Po utworzeniu
            konta będziesz mógł korzystać z wszystkich funkcji naszej aplikacji.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email jest wymagany",
                validate: {
                  isValidEmail: (email: string) => {
                    const input = document.createElement("input")
                    input.type = "email"
                    input.value = email
                    return input.checkValidity() || "Email jest nieprawidłowy"
                  },
                  isSchoolEmail: async (email: string) => {
                    if (!email.includes("@")) return "Email jest nieprawidłowy"
                    const domains = (
                      await getDoc(doc(collection(db, "config"), "config"))
                    ).data()?.domains as Array<string>
                    const emailDomain = email.split("@")[1]
                    return (
                      domains.includes(emailDomain.toLocaleLowerCase()) ||
                      "Email musi być powiązany z twoją szkołą"
                    )
                  },
                },
              }}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    required
                  />
                  <FieldDescription>
                    Wprowadź adres powiązany z twoją szkołą
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError
                      errors={errorsAdapter(fieldState.error?.types)}
                    />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Hasło jest wymagane",
                validate: {
                  minLength: async (value) => {
                    const status = await validatePassword(auth, value)
                    return (
                      status.meetsMinPasswordLength ||
                      "Hasło musi mieć przynajmniej 8 znaków"
                    )
                  },
                  lowercase: async (value) => {
                    const status = await validatePassword(auth, value)
                    return (
                      status.containsLowercaseLetter ||
                      "Hasło musi zawierać przynajmniej jedną małą literę"
                    )
                  },
                  uppercase: async (value) => {
                    const status = await validatePassword(auth, value)
                    return (
                      status.containsUppercaseLetter ||
                      "Hasło musi zawierać przynajmniej jedną dużą literę"
                    )
                  },
                  number: async (value) => {
                    const status = await validatePassword(auth, value)
                    return (
                      status.containsNumericCharacter ||
                      "Hasło musi zawierać przynajmniej jedną cyfrę"
                    )
                  },
                  special: async (value) => {
                    const status = await validatePassword(auth, value)
                    return (
                      status.containsNonAlphanumericCharacter ||
                      "Hasło musi zawierać przynajmniej jeden znak specjalny"
                    )
                  },
                },
              }}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Hasło</FieldLabel>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    required
                  />
                  <FieldError errors={errorsAdapter(fieldState.error?.types)} />
                </Field>
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: "Powtórz hasło",
                validate: (value) =>
                  value === watch("password") || "Hasła nie są takie same",
              }}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirm-password">
                    Powtórz hasło
                  </FieldLabel>
                  <Input
                    {...field}
                    id="confirm-password"
                    type="password"
                    required
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>Wprowadź hasło drugi raz.</FieldDescription>
                  {fieldState.invalid && (
                    <FieldError
                      errors={errorsAdapter(fieldState.error?.types)}
                    />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <FieldGroup>
            <Field>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Tworzenie konta..." : "Stwórz konto"}
              </Button>
              <FieldDescription className="px-6 text-center">
                Masz już konto? <Link href="/login">Zaloguj się</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </CardFooter>
      </Card>
    </form>
  )
}
