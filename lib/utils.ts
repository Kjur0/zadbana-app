import { clsx, type ClassValue } from "clsx"
import { FieldError, FieldErrors, MultipleFieldErrors } from "react-hook-form"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function errorsAdapter(
  errors: MultipleFieldErrors | undefined
): Array<{ message?: string } | undefined> {
  if (!errors) return []

  const isString = (v: unknown): v is string =>
    typeof v === "string" && v.length > 0
  const isArray = (v: unknown): v is Array<string> =>
    Array.isArray(v) && v.length > 0

  return Object.values(errors).flatMap((message) => {
    if (isString(message)) return { message }
    if (isArray(message))
      return message.map((submessage: string) => ({ message: submessage }))
    return []
  })
}
