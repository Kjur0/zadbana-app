"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { db } from "@/lib/firebase"
import { collection, doc, getDoc } from "firebase/firestore"
import { InlineCode, Lead, List } from "@/components/ui/typography"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useEffect, useRef, useState } from "react"
import * as setup from "@/lib/setup"
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const firestoreRulesSetup =
  "rules_version = '2';\n\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /{document=**} {\n      allow read, write, update: if true;\n    }\n  }\n}"
const firestoreRules =
  "rules_version = '2';\n\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /{document=**} {\n      allow read, write, update: if true;\n    }\n  }\n}"

function parseConfig() {
  const unparsed = (
    document.getElementById("firebase-config") as HTMLTextAreaElement
  ).value

  const keyMap: Record<string, string> = {
    apiKey: "NEXT_PUBLIC_FIREBASE_API_KEY",
    authDomain: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    projectId: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    storageBucket: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    appId: "NEXT_PUBLIC_FIREBASE_APP_ID",
    measurementId: "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID",
  }

  try {
    const parsedConfig: Record<string, string> = {}
    const matches = unparsed.matchAll(/(\w+)\s*:\s*"([^"]*)"/g)

    for (const match of matches) {
      parsedConfig[match[1]] = match[2]
    }

    if (
      !parsedConfig.apiKey ||
      !parsedConfig.projectId ||
      !parsedConfig.appId
    ) {
      throw new Error("Invalid Firebase config format")
    }

    const orderedKeys = [
      "apiKey",
      "authDomain",
      "projectId",
      "storageBucket",
      "messagingSenderId",
      "appId",
      "measurementId",
    ]

    const envVars = orderedKeys
      .filter((key) => parsedConfig[key])
      .map((key) => `${keyMap[key]}="${parsedConfig[key]}"`)
      .join("\n")

    // Copy to clipboard
    navigator.clipboard.writeText(envVars).then(() => {
      toast.success("Zmienne środowiskowe skopiowane do schowka!", {
        position: "bottom-center",
      })
    })
  } catch (error) {
    toast.error("Błąd: Nieprawidłowa konfiguracja Firebase", {
      position: "bottom-center",
    })
    console.error(error)
  }
}
export default function Page() {
  const router = useRouter()
  const [setupStep, setSetupStep] = useState<number>(0)
  const resolveStep4Ref = useRef<(() => void) | null>(null)

  useEffect(() => {
    toast.promise(
      () =>
        new Promise<void>((resolve) => {
          resolveStep4Ref.current = resolve
        }),
      {
        loading: "Wdrażanie aplikacji",
        error: "Błąd wdrażania aplikacji",
        success: () => "Wdrożono aplikację",
      }
    )
  }, [])
  useEffect(() => {
    getDoc(doc(collection(db, "config"), "config")).then((doc) => {
      const step = doc.exists() ? doc.data()?.setupStep : 0
      switch (step) {
        case 0:
          setup.step0().then(() => {
            setSetupStep(1)
          })
          break
        case 1:
          router.push("/setup/config")
          break
        case 2:
          router.push("/setup/register")
          break
        case 3:
          resolveStep4Ref.current?.()
          break
      }
      setSetupStep(step)
    })
  })

  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
    return (
      <main>
        <Card className="m-auto w-full max-w-3xl">
          <CardHeader>
            <CardTitle>Brakuje zmiennych środowiskowych</CardTitle>
            <CardDescription>
              Skonfiguruj zmienne środowiskowe dla Firebase, aby strona mogła
              się poprawnie załadować.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="firebase-project">
                <AccordionTrigger>
                  Stwórz projekt i aplikację w Firebase
                </AccordionTrigger>
                <AccordionContent>
                  <List className="mb-0">
                    <li>
                      Zaloguj się w{" "}
                      <Link
                        href="https://console.firebase.google.com"
                        target="_blank"
                      >
                        Firebase
                      </Link>
                    </li>
                    <li>
                      Stwórz nowy projekt ("
                      <InlineCode>Create a new Firebase project</InlineCode>")
                      <br />
                    </li>
                    <li>
                      Stwórz nową aplikację ("
                      <InlineCode>Add app</InlineCode>") i wybierz platformę
                      <InlineCode>Web</InlineCode>
                    </li>
                    <li>
                      Skopiuj konfigurację Firebase ("
                      <InlineCode>
                        SDK setup and configuration
                      </InlineCode>") <br />
                      Opcję <InlineCode>Config</InlineCode> wklej{" "}
                      <Drawer>
                        <DrawerTrigger className="underline">
                          tutaj
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>
                              Konfigurator zmiennych środowiskowych
                            </DrawerTitle>
                            <DrawerDescription>
                              Wklej konfigurację Firebase tutaj:
                            </DrawerDescription>
                          </DrawerHeader>
                          <div className="overflow-hidden p-4">
                            <Textarea
                              id="firebase-config"
                              className="h-64 w-full resize-none"
                            />
                          </div>
                          <DrawerFooter>
                            <Button onClick={parseConfig}>Konfiguruj</Button>
                            <DrawerClose asChild>
                              <Button variant="outline">Zamknij</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                    </li>
                    <li>
                      Skopiuj zmienne środowiskowe i wprowadź je do pliku
                      <InlineCode>.env.local</InlineCode>
                    </li>
                  </List>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="firestore">
                <AccordionTrigger>Skonfiguruj Firestore</AccordionTrigger>
                <AccordionContent>
                  <List>
                    <li>
                      W sekcji <InlineCode>Databases & Storage</InlineCode>
                      <br />
                      Wybierz opcję <InlineCode>Firestore</InlineCode>
                    </li>
                    <li>
                      Stwórz bazę danych ("
                      <InlineCode>Create database</InlineCode>") <br />
                      Ustawienia:
                      <List>
                        <li>
                          <InlineCode>Standard edition</InlineCode>
                        </li>
                        <li>
                          <InlineCode>Database ID: (default)</InlineCode>
                        </li>
                        <li>
                          <InlineCode>Start in production mode</InlineCode>
                        </li>
                        <li>
                          Ustaw zasady dostępu (kliknij, aby kopiować)
                          <Textarea
                            value={firestoreRulesSetup}
                            disabled
                            readOnly
                            className="pointer-events-none resize-none font-mono text-xs"
                            onClick={() => {
                              navigator.clipboard.writeText(firestoreRulesSetup)
                              toast.success(
                                "Zasady Firestore skopiowane do schowka!",
                                {
                                  position: "bottom-center",
                                }
                              )
                            }}
                          />
                        </li>
                      </List>
                    </li>
                  </List>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="auth">
                <AccordionTrigger>
                  Skonfiguruj bazę użytkowników
                </AccordionTrigger>
                <AccordionContent>
                  <List>
                    <li>
                      W sekcji <InlineCode>Security</InlineCode> <br />
                      Wybierz opcję <InlineCode>Authentication</InlineCode>
                    </li>
                    <li>
                      Wybierz <InlineCode>Get started</InlineCode>
                    </li>
                    <li>
                      Wybierz opcję <InlineCode>Email/Password</InlineCode>
                      <br />
                      Następnie uruchom ją ("<InlineCode>Enable</InlineCode>
                      ")
                    </li>
                    <li>
                      W sekcji <InlineCode>Settings</InlineCode>{" "}
                      <InlineCode>Password policy</InlineCode> <br />
                      Zaznacz wszystkie checkboxy
                    </li>
                    <li>
                      W sekcji <InlineCode>Templates</InlineCode>
                      <br />
                      Ustaw <InlineCode>Template language</InlineCode> na{" "}
                      <InlineCode>Polish</InlineCode>
                    </li>
                  </List>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Lead>Firebase skonfigurowane?</Lead>
            <Button
              className="w-full"
              onClick={() => {
                router.refresh()
              }}
            >
              Odśwież
            </Button>
          </CardFooter>
        </Card>
      </main>
    )

  if (setupStep === 3) {
    return (
      <main>
        <Card className="m-auto w-full max-w-3xl">
          <CardHeader>
            <CardTitle>Wdrożono aplikację</CardTitle>
            <CardDescription>
              Teraz pozostało tylko kilka rzeczy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="rules">
                <AccordionTrigger>
                  Skonfiguruj zasady Firestore
                </AccordionTrigger>
                <AccordionContent>
                  <List>
                    <li>
                      Skopiuj poniższe zasady i wklej je do zakładki{" "}
                      <InlineCode>Rules</InlineCode> w Firestore:
                      <Textarea
                        value={firestoreRules}
                        disabled
                        readOnly
                        className="pointer-events-none resize-none font-mono text-xs"
                        onClick={() => {
                          navigator.clipboard.writeText(firestoreRules)
                          toast.success(
                            "Zasady Firestore skopiowane do schowka!",
                            {
                              position: "bottom-center",
                            }
                          )
                        }}
                      />
                    </li>
                  </List>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </main>
    )
  }

  return <main></main>
}
