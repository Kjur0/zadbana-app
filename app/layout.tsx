"use client"
import { useEffect } from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { useRouter } from "next/navigation"

import { collection, doc, getDoc } from "firebase/firestore"

import "./globals.css"

import { cn } from "@/lib/utils"
import { toast } from "sonner"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { db } from "@/lib/firebase"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()

  useEffect(() => {
    getDoc(doc(collection(db, "config"), "config"))
      .then((doc) => {
        const exists = doc.exists() && doc.data()?.setupStep === 3
        if (!exists) {
          toast.warning("Aplikacja jest w trybie wdrażania", {
            description: "Niektóre funkcje mogą być niedostępne",
            action: {
              label: "Wdróż",
              onClick: () => {
                router.push("/setup")
              },
            },
          })
        }
      })
      .catch(() => {
        toast.warning("Aplikacja jest w trybie wdrażania", {
          description: "Niektóre funkcje mogą być niedostępne",
          action: {
            label: "Wdróż",
            onClick: () => {
              router.push("/setup")
            },
          },
        })
      })
  }, [])

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        fontSans.variable
      )}
    >
      <body>
        <ThemeProvider>
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
