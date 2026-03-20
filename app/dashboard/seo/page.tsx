import { getSEODashboardData } from "@/lib/fetchers";
import { SEOClient } from "./client";

export default async function SEOPage() {
  const { data, error } = await getSEODashboardData();

  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{error || "Failed to load SEO data"}</p>
      </div>
    );
  }

  return <SEOClient analyses={data.analyses} summary={data.summary} />;
}
