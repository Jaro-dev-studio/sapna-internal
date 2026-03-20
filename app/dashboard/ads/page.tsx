import { getAdsDashboardData } from "@/lib/fetchers";
import { AdsClient } from "./client";

export default async function AdsPage() {
  const { data, error } = await getAdsDashboardData();

  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{error || "Failed to load ads data"}</p>
      </div>
    );
  }

  return <AdsClient campaigns={data.campaigns} creatives={data.creatives} summary={data.summary} />;
}
