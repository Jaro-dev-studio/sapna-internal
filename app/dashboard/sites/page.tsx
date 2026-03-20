import { getSitesDashboardData } from "@/lib/fetchers";
import { SitesClient } from "./client";

export default async function SitesPage() {
  const { data, error } = await getSitesDashboardData();

  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{error || "Failed to load sites"}</p>
      </div>
    );
  }

  return <SitesClient sites={data.sites} summary={data.summary} />;
}
