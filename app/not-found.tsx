"use client"

import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertAction,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { AlertCircle, CircleChevronLeft, Home } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()

  return (
    <Alert
      variant="destructive"
      className="absolute! bottom-1/2 left-1/2 h-fit w-fit -translate-1/2"
    >
      <AlertCircle />
      <AlertTitle>404</AlertTitle>
      <AlertDescription>Strona nie została znaleziona.</AlertDescription>
      <AlertAction>
        <ButtonGroup>
          <Button
            onClick={() => {
              router.back()
            }}
            size="icon-sm"
            variant="default"
          >
            <CircleChevronLeft className="size-4" />
          </Button>
          <Button
            onClick={() => {
              router.replace("/")
            }}
            size="icon-sm"
            variant="default"
          >
            <Home className="size-4" />
          </Button>
        </ButtonGroup>
      </AlertAction>
    </Alert>
  )
}
