import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdsLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="size-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-2 h-8 w-24" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <Skeleton className="h-10 w-80" />
        
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-4 p-4">
                <Skeleton className="size-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-4 w-60" />
                </div>
                <div className="flex gap-6">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="space-y-1">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Skeleton className="size-8" />
                  <Skeleton className="size-8" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
