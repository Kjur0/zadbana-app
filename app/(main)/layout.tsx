"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import dynamic from "next/dynamic"

import { User } from "firebase/auth"

import { auth, getUserData } from "@/lib/firebase"
import { toast } from "sonner"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import LoginDialog from "@/components/auth-dialogs"
import { Skeleton } from "@/components/ui/skeleton"

import { Home, LogOut } from "lucide-react"
import Link from "next/link"

const ThemeToggle = dynamic(
  () => import("@/components/theme-provider").then((m) => m.ThemeToggle),
  { ssr: false }
)

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()

  const pathname = usePathname()
  const isActive = (href: string) => pathname === href
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(
    () =>
      auth.onAuthStateChanged((user) => {
        setLoading(false)
        if (user) {
          getUserData().then((data) => {
            setUser(user)
            toast.success("Zalogowano pomyślnie", {
              description: `Witaj z powrotem ${user.displayName}!`,
            })
          })
        }
      }),
    []
  )

  const logout = () => {
    auth
      .signOut()
      .then(() => {
        toast.success("Wylogowano pomyślnie", {
          description: "Do zobaczenia!",
        })
        setUser(null)
        router.refresh()
      })
      .catch((err) => {
        toast.error("Nie można się wylogować", {
          description: "Spróbuj ponownie później",
        })
      })
  }

  return (
    <>
      <header className="sticky top-0">
        <div className="flex items-center px-6 py-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                  active={isActive("/")}
                >
                  <Link href="/">
                    <Home /> Zadbana
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                  active={isActive("/")}
                >
                  <Link href="/setup/privatepractices">Form private practices</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/docs">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="ml-auto flex items-center justify-end gap-2">
            <ThemeToggle />
            <Separator orientation="vertical" className="my-auto h-6" />
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">{user.displayName}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} variant="destructive">
                      <LogOut /> Wyloguj
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {loading && <Skeleton className="h-8 w-23" />}
            {!loading && !user && <LoginDialog />}
          </div>
        </div>
      </header>
      <main>{children}</main>
    </>
  )
}
