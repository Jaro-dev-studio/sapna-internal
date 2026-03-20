"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Store,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import type { Site } from "@/lib/mock-data/types";

interface SitesClientProps {
  sites: Site[];
  summary: {
    totalSites: number;
    activeSites: number;
    totalRevenue: number;
    totalOrders: number;
    totalVisitors: number;
    avgConversionRate: number;
  };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function getStatusColor(status: Site["status"]): string {
  switch (status) {
    case "ACTIVE":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "PAUSED":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    case "DISCONNECTED":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function SitesClient({ sites, summary }: SitesClientProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sites</h1>
          <p className="text-muted-foreground">
            Manage and monitor your e-commerce portfolio
          </p>
        </div>
        <Button disabled>
          <Store className="mr-2 size-4" />
          Connect New Site
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (30d)</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Across {summary.activeSites} active sites
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders (30d)</CardTitle>
            <ShoppingCart className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(summary.totalOrders)}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(summary.totalOrders / 30)} orders per day avg
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors (30d)</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(summary.totalVisitors)}</div>
            <p className="text-xs text-muted-foreground">
              Across all sites
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Conversion Rate</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.avgConversionRate.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">
              Portfolio average
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Your Sites</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <Card key={site.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                      <Store className="text-primary size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{site.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-xs">
                        {site.domain}
                        <ExternalLink className="size-3" />
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(site.status)}>
                    {site.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {site.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue (30d)</p>
                    <p className="text-lg font-semibold">{formatCurrency(site.metrics.revenue30d)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Orders (30d)</p>
                    <p className="text-lg font-semibold">{formatNumber(site.metrics.orders30d)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Visitors (30d)</p>
                    <p className="text-lg font-semibold">{formatNumber(site.metrics.visitors30d)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Conv. Rate</p>
                    <p className="text-lg font-semibold">{site.metrics.conversionRate.toFixed(2)}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <div className="text-xs text-muted-foreground">
                    AOV: {formatCurrency(site.metrics.averageOrderValue)}
                  </div>
                  <Link href={`/dashboard/sites/${site.id}`}>
                    <Button variant="ghost" size="sm" className="h-8">
                      View Details
                      <ArrowRight className="ml-1 size-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
