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
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"
import { toast } from "sonner"
import { useForm } from "react-hook-form"

interface EmployerForm {
  imieUcznia: string
  nazwiskoUcznia: string
  klasa: string
  nazwaFirmy: string
  adresFirmy: string
  imieKontaktowe: string
  nazwiskoKontaktowe: string
  telefon: string
  email: string
  umowa: 'TAK' | 'NIE'
  profil: 'Programista' | 'Informatyk' | 'Mechatronik'
}

export default function RegisterEmployerForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmployerForm>({
    mode: "onChange",
    defaultValues: {
      imieUcznia: "",
      nazwiskoUcznia: "",
      klasa: "",
      nazwaFirmy: "",
      adresFirmy: "",
      imieKontaktowe: "",
      nazwiskoKontaktowe: "",
      telefon: "",
      email: "",
      umowa: undefined,
      profil: undefined,
    },
  })

  const onSubmit = async (data: EmployerForm) => {
    try {
      await addDoc(collection(db, "employerForms"), data)
      toast.success("Formularz wysłany pomyślnie!")
    } catch (error) {
      toast.error("Błąd wysyłania formularza")
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="m-auto w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Formularz zgłoszeniowy praktyk prywatnych</CardTitle>
          <CardDescription>
            Wypełnij formularz zgłoszeniowy dla praktyk prywatnych
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="imieUcznia">Imię ucznia</FieldLabel>
              <Input
                {...register("imieUcznia", { required: "Imię ucznia jest wymagane" })}
                id="imieUcznia"
                type="text"
                placeholder="Imię ucznia"
              />
              {errors.imieUcznia && <FieldError>{errors.imieUcznia.message}</FieldError>}
            </Field>
            <Field>
              <FieldLabel htmlFor="nazwiskoUcznia">Nazwisko ucznia</FieldLabel>
              <Input
                {...register("nazwiskoUcznia", { required: "Nazwisko ucznia jest wymagane" })}
                id="nazwiskoUcznia"
                type="text"
                placeholder="Nazwisko ucznia"
              />
              {errors.nazwiskoUcznia && <FieldError>{errors.nazwiskoUcznia.message}</FieldError>}
            </Field>
            <Field>
              <FieldLabel htmlFor="klasa">Klasa</FieldLabel>
              <Input
                {...register("klasa", { required: "Klasa jest wymagana" })}
                id="klasa"
                type="text"
                placeholder="Klasa"
              />
              {errors.klasa && <FieldError>{errors.klasa.message}</FieldError>}
            </Field>
            <Field>
              <FieldLabel htmlFor="nazwaFirmy">Nazwa Firmy</FieldLabel>
              <Input
                {...register("nazwaFirmy", { required: "Nazwa firmy jest wymagana" })}
                id="nazwaFirmy"
                type="text"
                placeholder="Nazwa Firmy"
              />
              {errors.nazwaFirmy && <FieldError>{errors.nazwaFirmy.message}</FieldError>}
            </Field>
            <Field>
              <FieldLabel htmlFor="adresFirmy">Adres firmy</FieldLabel>
              <Input
                {...register("adresFirmy", { required: "Adres firmy jest wymagany" })}
                id="adresFirmy"
                type="text"
                placeholder="Adres firmy"
              />
              {errors.adresFirmy && <FieldError>{errors.adresFirmy.message}</FieldError>}
            </Field>
            <Field>
              <FieldLabel htmlFor="imieKontaktowe">Imię osoby kontaktowej</FieldLabel>
              <Input
                {...register("imieKontaktowe", { required: "Imię kontaktowe jest wymagane" })}
                id="imieKontaktowe"
                type="text"
                placeholder="Imię osoby kontaktowej"
              />
              {errors.imieKontaktowe && <FieldError>{errors.imieKontaktowe.message}</FieldError>}
            </Field>
            <Field>
              <FieldLabel htmlFor="nazwiskoKontaktowe">Nazwisko osoby kontaktowej</FieldLabel>
              <Input
                {...register("nazwiskoKontaktowe", { required: "Nazwisko kontaktowe jest wymagane" })}
                id="nazwiskoKontaktowe"
                type="text"
                placeholder="Nazwisko osoby kontaktowej"
              />
              {errors.nazwiskoKontaktowe && <FieldError>{errors.nazwiskoKontaktowe.message}</FieldError>}
            </Field>
            <Field>
              <FieldLabel htmlFor="telefon">Telefon osoby kontaktowej</FieldLabel>
              <Input
                {...register("telefon", { required: "Telefon jest wymagany" })}
                id="telefon"
                type="tel"
                placeholder="Telefon"
              />
              {errors.telefon && <FieldError>{errors.telefon.message}</FieldError>}
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Adres email do firmy</FieldLabel>
              <Input
                {...register("email", { required: "Email jest wymagany", pattern: { value: /^\S+@\S+$/i, message: "Nieprawidłowy email" } })}
                id="email"
                type="email"
                placeholder="Email"
              />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>
            <Field>
              <FieldLabel>Czy firma wyraża zgodę na podpisanie umowy zgodnie z przedstawionym wzorem</FieldLabel>
              <div>
                <input {...register("umowa", { required: "Wybierz opcję" })} type="radio" value="TAK" id="umowaTak" />
                <label htmlFor="umowaTak">TAK</label>
                <input {...register("umowa", { required: "Wybierz opcję" })} type="radio" value="NIE" id="umowaNie" />
                <label htmlFor="umowaNie">NIE</label>
              </div>
              {errors.umowa && <FieldError>{errors.umowa.message}</FieldError>}
            </Field>
            <Field>
              <FieldLabel>Profil ucznia</FieldLabel>
              <div>
                <input {...register("profil", { required: "Wybierz profil" })} type="radio" value="Programista" id="programista" />
                <label htmlFor="programista">Programista</label>
                <input {...register("profil", { required: "Wybierz profil" })} type="radio" value="Informatyk" id="informatyk" />
                <label htmlFor="informatyk">Informatyk</label>
                <input {...register("profil", { required: "Wybierz profil" })} type="radio" value="Mechatronik" id="mechatronik" />
                <label htmlFor="mechatronik">Mechatronik</label>
              </div>
              {errors.profil && <FieldError>{errors.profil.message}</FieldError>}
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Wysyłanie..." : "Prześlij"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
  