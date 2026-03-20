import { getCampaign, getCreativesForCampaign } from "@/lib/fetchers";
import { CampaignDetailClient } from "./client";

interface CampaignDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  const { id } = await params;
  const [{ data: campaign, error: campaignError }, { data: creatives, error: creativesError }] =
    await Promise.all([getCampaign(id), getCreativesForCampaign(id)]);

  if (!campaign || campaignError) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{campaignError || "Campaign not found"}</p>
      </div>
    );
  }

  return (
    <CampaignDetailClient
      campaign={campaign}
      creatives={creatives ?? []}
      error={creativesError}
    />
  );
}
