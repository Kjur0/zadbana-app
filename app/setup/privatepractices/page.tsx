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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"
import { toast } from "sonner"
import { useForm, Controller } from "react-hook-form"

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
    control,
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
              <Controller
                name="umowa"
                control={control}
                rules={{ required: "Wybierz opcję" }}
                render={({ field }) => (
                  <RadioGroup value={field.value} onValueChange={field.onChange}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="TAK" id="umowaTak" />
                      <Label htmlFor="umowaTak">TAK</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="NIE" id="umowaNie" />
                      <Label htmlFor="umowaNie">NIE</Label>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.umowa && <FieldError>{errors.umowa.message}</FieldError>}
            </Field>
            <Field>
              <FieldLabel>Profil ucznia</FieldLabel>
              <Controller
                name="profil"
                control={control}
                rules={{ required: "Wybierz profil" }}
                render={({ field }) => (
                  <RadioGroup value={field.value} onValueChange={field.onChange}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Programista" id="programista" />
                      <Label htmlFor="programista">Programista</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Informatyk" id="informatyk" />
                      <Label htmlFor="informatyk">Informatyk</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Mechatronik" id="mechatronik" />
                      <Label htmlFor="mechatronik">Mechatronik</Label>
                    </div>
                  </RadioGroup>
                )}
              />
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
  