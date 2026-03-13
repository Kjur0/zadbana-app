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
  FieldSet,
  FieldLabel,
  FieldDescription,
  FieldGroup,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { errorsAdapter } from "@/lib/utils"
import { BadgePlus, BadgeX } from "lucide-react"
import { useRouter } from "next/navigation"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import * as setup from "@/lib/setup"

interface SetupForm {
  schoolName: string
  schoolDomains: Array<string>
}

export default function Page() {
  const router = useRouter()

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
  } = useForm<SetupForm>({
    mode: "onBlur",
    defaultValues: {
      schoolName: "",
      schoolDomains: [""],
    },
    criteriaMode: "all",
  })

  const { fields, append, remove } = useFieldArray({
    name: "schoolDomains",
    control,
  })

  const schoolDomains = watch("schoolDomains")
  const domainsError = !schoolDomains?.some((domain) => domain?.trim())
    ? "Co najmniej jedna domena jest wymagana"
    : null

  const submit = (data: SetupForm) => {
    setup
      .step1({ name: data.schoolName, domains: data.schoolDomains })
      .then(() => {
        router.push("/setup")
      })
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Card className="m-auto w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Brakuje podstawowej konfiguracji</CardTitle>
          <CardDescription>Podaj wymagane dane</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Controller
              control={control}
              name="schoolName"
              rules={{ required: "Nazwa szkoły jest wymagana" }}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="school-name">
                    Podaj nazwę szkoły
                  </FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    id="school-name"
                    aria-invalid={fieldState.invalid}
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={errorsAdapter(fieldState.error?.types)}
                    />
                  )}
                </Field>
              )}
            />
            <Field data-invalid={!!domainsError}>
              <FieldLabel>Podaj domeny email</FieldLabel>
              <FieldDescription>
                Tylko na te domeny będzie można się zarejestrować
              </FieldDescription>
              {domainsError && (
                <FieldError errors={[{ message: domainsError }]} />
              )}
              {fields.map((field, index) => (
                <Controller
                  control={control}
                  key={field.id}
                  name={`schoolDomains.${index}`}
                  render={({ field: input }) => (
                    <InputGroup>
                      <InputGroupInput {...input} type="text" />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          variant="destructive"
                          type="button"
                          onClick={() => remove(index)}
                        >
                          <BadgeX />
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={() => append("")}
              >
                <BadgePlus />
              </Button>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" type="submit">
            Dalej
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
