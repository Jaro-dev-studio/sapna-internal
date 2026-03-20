import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-2 h-8 w-16" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-10 max-w-sm flex-1" />
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-5 w-full max-w-[200px]" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-10" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
              <Skeleton className="h-8 w-full" />
              <div className="flex justify-end border-t pt-3">
                <Skeleton className="h-8 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
