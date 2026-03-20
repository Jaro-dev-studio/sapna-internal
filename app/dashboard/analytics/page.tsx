import { getAnalyticsDashboardData } from "@/lib/fetchers";
import { AnalyticsClient } from "./client";

export default async function AnalyticsPage() {
  const { data, error } = await getAnalyticsDashboardData(30);

  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{error || "Failed to load analytics"}</p>
      </div>
    );
  }

  return <AnalyticsClient data={data} />;
}
