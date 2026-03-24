import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { H2 } from "@/components/ui/typography"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { Plus } from "lucide-react"
import { use } from "react"

export default function Page() {
  const profiles = use(getDocs(collection(db, "profiles"))).docs.sort()
  return (
    <main className="m-4">
      <H2 className="mx-50 text-center">Wybierz profil</H2>
      <Tabs>
        <TabsList className="mx-auto">
          {profiles.map((profile) => (
            <TabsTrigger key={profile.id} value={profile.id}>
              {profile.data().name}
            </TabsTrigger>
          ))}
        </TabsList>
        {profiles.map((profile) => (
          <TabsContent key={profile.id} value={profile.id}>
            <ItemGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:place-content-center md:place-items-center lg:grid-cols-4">
              {use(
                getDocs(collection(db, "profiles", profile.id, "employers"))
              ).docs.map((employer) => (
                <Item key={employer.id} variant="outline">
                  <ItemContent>
                    <ItemTitle>{employer.data().name}</ItemTitle>
                    <ItemDescription>{employer.data().address}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon-lg"
                          className="rounded-full"
                        >
                          <Plus />
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>{employer.data().name}</SheetTitle>
                          <div className="flex flex-row flex-wrap gap-2">
                            {employer.data().tags?.map((tag: string) => (
                              <Badge key={tag}>{tag}</Badge>
                            ))}
                          </div>
                          <SheetDescription>
                            {employer.data().description}
                          </SheetDescription>
                        </SheetHeader>
                      </SheetContent>
                    </Sheet>
                  </ItemActions>
                  <ItemFooter className="flex flex-row flex-wrap justify-baseline gap-2">
                    {employer.data().tags?.map((tag: string) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </ItemFooter>
                </Item>
              ))}
            </ItemGroup>
          </TabsContent>
        ))}
      </Tabs>
    </main>
  )
}
