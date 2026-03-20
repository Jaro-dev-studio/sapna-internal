"use client";

import { useState, useTransition } from "react";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { runAISEOAgent } from "@/lib/actions";
import type { SEOAnalysis } from "@/lib/mock-data/types";

interface SEODetailClientProps {
  analysis: SEOAnalysis;
}

export function SEODetailClient({ analysis }: SEODetailClientProps) {
  const [isPending, startTransition] = useTransition();
  const [agentSummary, setAgentSummary] = useState<string | null>(null);
  const [agentError, setAgentError] = useState<string | null>(null);
  const [agentRecommendations, setAgentRecommendations] = useState<
    Array<{
      title: string;
      priority: "high" | "medium" | "low";
      category: "technical" | "content" | "backlinks" | "keywords";
      description: string;
      impact: string;
    }>
  >([]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{analysis.site.name} SEO Detail</h1>
          <p className="text-muted-foreground">{analysis.site.domain}</p>
        </div>
        <Button
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              setAgentError(null);
              const result = await runAISEOAgent(analysis.siteId);
              if (result.error || !result.data) {
                setAgentError(result.error ?? "Failed to run AI SEO agent");
                return;
              }
              setAgentSummary(result.data.summary);
              setAgentRecommendations(result.data.recommendations);
            })
          }
        >
          <Sparkles className="mr-2 size-4" />
          Run AI SEO Agent
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Overall score</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{analysis.overallScore}/100</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Keywords tracked</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{analysis.totalKeywords}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Top 10 keywords</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{analysis.keywordsTop10}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Organic traffic</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{analysis.organicTraffic.toLocaleString()}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Issues</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {analysis.issues.map((issue) => (
            <div key={issue.id} className="rounded border border-border p-3">
              <p className="font-medium">{issue.title}</p>
              <p className="text-sm text-muted-foreground">{issue.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI SEO Agent Output</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {agentError ? <p className="text-sm text-red-600">{agentError}</p> : null}
          {agentSummary ? <p className="text-sm">{agentSummary}</p> : <p className="text-sm text-muted-foreground">Run the AI SEO agent to generate optimization recommendations.</p>}
          {agentRecommendations.map((recommendation) => (
            <div key={recommendation.title} className="rounded border border-border p-3">
              <p className="font-medium">{recommendation.title}</p>
              <p className="text-sm text-muted-foreground">{recommendation.description}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Priority: {recommendation.priority} | Category: {recommendation.category}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
