"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Creative } from "@/lib/mock-data/types";

interface CreativeDetailClientProps {
  creative: Creative;
}

export function CreativeDetailClient({ creative }: CreativeDetailClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{creative.name}</h1>
          <p className="text-muted-foreground">{creative.site.name}</p>
        </div>
        <Badge variant="outline">{creative.status}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Type</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">{creative.type}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Impressions</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">{creative.metrics?.impressions ?? 0}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">CTR</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">{(creative.metrics?.ctr ?? 0).toFixed(2)}%</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">CVR</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">{(creative.metrics?.cvr ?? 0).toFixed(2)}%</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Creative copy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><span className="font-medium">Headline:</span> {creative.headline || "-"}</p>
          <p><span className="font-medium">Description:</span> {creative.description || "-"}</p>
          <p><span className="font-medium">CTA:</span> {creative.callToAction || "-"}</p>
        </CardContent>
      </Card>

      {creative.campaign ? (
        <Card>
          <CardHeader>
            <CardTitle>Parent campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href={`/dashboard/ads/campaigns/${creative.campaign.id}`}>
              <Button variant="outline">Open campaign</Button>
            </Link>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
