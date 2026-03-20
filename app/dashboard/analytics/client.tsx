"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
} from "lucide-react";
import type { AnalyticsSummary } from "@/lib/mock-data/types";

interface AnalyticsClientProps {
  data: AnalyticsSummary;
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

function formatPercentChange(value: number): string {
  const prefix = value >= 0 ? "+" : "";
  return `${prefix}${value.toFixed(1)}%`;
}

function getChangeColor(value: number): string {
  return value >= 0 ? "text-green-600" : "text-red-600";
}

function ChangeIndicator({ value }: { value: number }) {
  const isPositive = value >= 0;
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
  
  return (
    <div className={`flex items-center gap-1 text-sm ${getChangeColor(value)}`}>
      <Icon className="size-4" />
      <span>{formatPercentChange(value)}</span>
    </div>
  );
}

export function AnalyticsClient({ data }: AnalyticsClientProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Performance overview across all your e-commerce sites
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled>
            <Calendar className="mr-2 size-4" />
            Last 30 Days
          </Button>
          <Button variant="outline" disabled>
            <Download className="mr-2 size-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.totalRevenue)}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">vs previous period</p>
              <ChangeIndicator value={data.revenueChange} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.totalOrders)}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">vs previous period</p>
              <ChangeIndicator value={data.ordersChange} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.totalVisitors)}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">vs previous period</p>
              <ChangeIndicator value={data.visitorsChange} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.avgConversionRate.toFixed(2)}%</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">vs previous period</p>
              <ChangeIndicator value={data.conversionChange} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Daily revenue over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[300px] items-end gap-1">
              {data.dailyData.slice(-30).map((day, index) => {
                const maxRevenue = Math.max(...data.dailyData.map(d => d.revenue));
                const height = (day.revenue / maxRevenue) * 100;
                return (
                  <div
                    key={day.date}
                    className="bg-primary/80 hover:bg-primary flex-1 rounded-t transition-colors"
                    style={{ height: `${height}%` }}
                    title={`${day.date}: ${formatCurrency(day.revenue)}`}
                  />
                );
              })}
            </div>
            <div className="mt-4 flex justify-between text-xs text-muted-foreground">
              <span>{data.dailyData[0]?.date}</span>
              <span>{data.dailyData[data.dailyData.length - 1]?.date}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Site Performance</CardTitle>
            <CardDescription>Revenue breakdown by site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.siteBreakdown.map((site, index) => {
                const percentage = (site.revenue / data.totalRevenue) * 100;
                return (
                  <div key={site.siteId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="size-3 rounded-full"
                          style={{
                            backgroundColor: `hsl(${(index * 60) % 360}, 70%, 50%)`,
                          }}
                        />
                        <span className="text-sm font-medium">{site.siteName}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold">{formatCurrency(site.revenue)}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: `hsl(${(index * 60) % 360}, 70%, 50%)`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Site Comparison</CardTitle>
          <CardDescription>Key metrics across all sites for the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Site</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Revenue</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Orders</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Visitors</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Conv. Rate</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">AOV</th>
                </tr>
              </thead>
              <tbody>
                {data.siteBreakdown.map((site) => (
                  <tr key={site.siteId} className="border-b last:border-0">
                    <td className="py-3 text-sm font-medium">{site.siteName}</td>
                    <td className="py-3 text-right text-sm">{formatCurrency(site.revenue)}</td>
                    <td className="py-3 text-right text-sm">{formatNumber(site.orders)}</td>
                    <td className="py-3 text-right text-sm">{formatNumber(site.visitors)}</td>
                    <td className="py-3 text-right text-sm">{site.conversionRate.toFixed(2)}%</td>
                    <td className="py-3 text-right text-sm">
                      {site.orders > 0 ? formatCurrency(site.revenue / site.orders) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-muted/50">
                  <td className="py-3 text-sm font-semibold">Total</td>
                  <td className="py-3 text-right text-sm font-semibold">{formatCurrency(data.totalRevenue)}</td>
                  <td className="py-3 text-right text-sm font-semibold">{formatNumber(data.totalOrders)}</td>
                  <td className="py-3 text-right text-sm font-semibold">{formatNumber(data.totalVisitors)}</td>
                  <td className="py-3 text-right text-sm font-semibold">{data.avgConversionRate.toFixed(2)}%</td>
                  <td className="py-3 text-right text-sm font-semibold">{formatCurrency(data.avgOrderValue)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
