import { ItemGroup } from "@/components/ui/item"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { H2 } from "@/components/ui/typography"

export default function Loading() {
  return (
    <main>
      <main className="m-4">
        <H2 className="mx-50 text-center">Wybierz profil</H2>
        <Tabs defaultValue="loading1">
          <TabsList className="mx-auto">
            <TabsTrigger value="loading1">
              <Skeleton className="w-20" />
            </TabsTrigger>
            <TabsTrigger value="loading2">
              <Skeleton className="w-20" />
            </TabsTrigger>
            <TabsTrigger value="loading3">
              <Skeleton className="w-20" />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="loading1">
            <ItemGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:place-content-center md:place-items-center">
              <Skeleton className="h-40 md:w-60" />
              <Skeleton className="h-40 md:w-60" />
              <Skeleton className="h-40 md:w-60" />
              <Skeleton className="h-40 md:w-60" />
              <Skeleton className="h-40 md:w-60" />
              <Skeleton className="h-40 md:w-60" />
              <Skeleton className="h-40 md:w-60" />
              <Skeleton className="h-40 md:w-60" />
            </ItemGroup>
          </TabsContent>
        </Tabs>
      </main>
    </main>
  )
}
