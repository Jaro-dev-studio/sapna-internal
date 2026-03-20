"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Campaign, Creative } from "@/lib/mock-data/types";

interface CampaignDetailClientProps {
  campaign: Campaign;
  creatives: Creative[];
  error: string | null;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export function CampaignDetailClient({ campaign, creatives, error }: CampaignDetailClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{campaign.name}</h1>
          <p className="text-muted-foreground">{campaign.site.name}</p>
        </div>
        <Badge variant="outline">{campaign.status}</Badge>
      </div>

      {error ? (
        <div className="rounded border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Budget</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">{formatCurrency(campaign.budget)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Spent</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">{formatCurrency(campaign.spent)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Platform</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">{campaign.platform}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">ROAS</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">{(campaign.metrics?.roas ?? 0).toFixed(2)}x</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Creatives in this campaign</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {creatives.length === 0 ? (
            <p className="text-sm text-muted-foreground">No creatives linked yet.</p>
          ) : (
            creatives.map((creative) => (
              <div key={creative.id} className="flex items-center justify-between rounded border border-border p-3">
                <div>
                  <p className="font-medium">{creative.name}</p>
                  <p className="text-xs text-muted-foreground">{creative.type}</p>
                </div>
                <Link href={`/dashboard/ads/creatives/${creative.id}`}>
                  <Button variant="outline" size="sm">Open</Button>
                </Link>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
