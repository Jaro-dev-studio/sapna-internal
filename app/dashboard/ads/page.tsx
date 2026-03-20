import { getAdPlatformConnections, getAdsDashboardData, getSites } from "@/lib/fetchers";
import { AdsClient } from "./client";

export default async function AdsPage() {
  const [{ data, error }, { data: sites, error: sitesError }, { data: connections, error: connectionsError }] =
    await Promise.all([getAdsDashboardData(), getSites(), getAdPlatformConnections()]);

  if (error || !data || !sites || sitesError || !connections || connectionsError) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">
          {error || sitesError || connectionsError || "Failed to load ads data"}
        </p>
      </div>
    );
  }

  return (
    <AdsClient
      campaigns={data.campaigns}
      creatives={data.creatives}
      summary={data.summary}
      sites={sites}
      connections={connections}
    />
  );
}
