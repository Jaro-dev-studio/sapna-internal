"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Link as LinkIcon,
  FileText,
  Globe,
} from "lucide-react";
import Link from "next/link";
import type { SEOAnalysis } from "@/lib/mock-data/types";

interface SEOClientProps {
  analyses: SEOAnalysis[];
  summary: {
    avgScore: number;
    totalKeywords: number;
    totalKeywordsTop10: number;
    totalOrganicTraffic: number;
    totalBacklinks: number;
    totalCriticalIssues: number;
    sitesAnalyzed: number;
  };
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
}

function getScoreBgColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-500";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Good";
  if (score >= 60) return "Needs Work";
  return "Poor";
}

export function SEOClient({ analyses, summary }: SEOClientProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">SEO</h1>
          <p className="text-muted-foreground">
            Monitor and optimize search engine performance across your sites
          </p>
        </div>
        <Button disabled>
          <Search className="mr-2 size-4" />
          Run Full Analysis
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average SEO Score</CardTitle>
            <Search className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(summary.avgScore)}`}>
              {summary.avgScore}/100
            </div>
            <p className="text-xs text-muted-foreground">
              Across {summary.sitesAnalyzed} sites
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Keywords Tracked</CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(summary.totalKeywords)}</div>
            <p className="text-xs text-muted-foreground">
              {summary.totalKeywordsTop10} in top 10
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organic Traffic</CardTitle>
            <Globe className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(summary.totalOrganicTraffic)}</div>
            <p className="text-xs text-muted-foreground">
              Monthly visits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertTriangle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.totalCriticalIssues > 0 ? "text-red-600" : "text-green-600"}`}>
              {summary.totalCriticalIssues}
            </div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Site SEO Health</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {analyses.map((analysis) => (
            <Card key={analysis.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{analysis.site.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      {analysis.site.domain}
                      <ExternalLink className="size-3" />
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                      {analysis.overallScore}
                    </div>
                    <Badge variant="outline" className={`text-xs ${getScoreColor(analysis.overallScore)}`}>
                      {getScoreLabel(analysis.overallScore)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Technical</div>
                    <div className={`text-sm font-semibold ${getScoreColor(analysis.technicalScore)}`}>
                      {analysis.technicalScore}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">On-Page</div>
                    <div className={`text-sm font-semibold ${getScoreColor(analysis.onPageScore)}`}>
                      {analysis.onPageScore}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Content</div>
                    <div className={`text-sm font-semibold ${getScoreColor(analysis.contentScore)}`}>
                      {analysis.contentScore}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Backlinks</div>
                    <div className={`text-sm font-semibold ${getScoreColor(analysis.backlinksScore)}`}>
                      {analysis.backlinksScore}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Overall Progress</span>
                    <span className="font-medium">{analysis.overallScore}%</span>
                  </div>
                  <Progress value={analysis.overallScore} className="h-2" />
                </div>

                <div className="grid grid-cols-3 gap-4 border-t pt-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Keywords</div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{analysis.keywordsTop10}</span>
                      <span className="text-xs text-muted-foreground">in top 10</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Traffic</div>
                    <div className="font-semibold">{formatNumber(analysis.organicTraffic)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">DA</div>
                    <div className="font-semibold">{analysis.domainAuthority}</div>
                  </div>
                </div>

                {analysis.issues.filter(i => i.severity === "critical").length > 0 && (
                  <div className="bg-red-500/10 text-red-600 flex items-center gap-2 rounded-lg p-2 text-sm">
                    <AlertTriangle className="size-4" />
                    {analysis.issues.filter(i => i.severity === "critical").length} critical issue(s) found
                  </div>
                )}

                <div className="flex items-center justify-between border-t pt-4">
                  <div className="text-xs text-muted-foreground">
                    Last analyzed: {new Date(analysis.analyzedAt).toLocaleDateString()}
                  </div>
                  <Link href={`/dashboard/seo/${analysis.siteId}`}>
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
