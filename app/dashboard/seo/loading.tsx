import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SEOLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-2 h-8 w-20" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <Skeleton className="mb-4 h-6 w-32" />
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="space-y-1 text-right">
                    <Skeleton className="ml-auto h-8 w-12" />
                    <Skeleton className="ml-auto h-5 w-16" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="space-y-1 text-center">
                      <Skeleton className="mx-auto h-3 w-12" />
                      <Skeleton className="mx-auto h-4 w-8" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-2 w-full" />
                <div className="grid grid-cols-3 gap-4 border-t pt-4">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j}>
                      <Skeleton className="mb-1 h-3 w-12" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
