"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EmailAutomationDetailData } from "@/lib/ecommerce-fetchers";

interface EmailAutomationDetailClientProps {
  automation: EmailAutomationDetailData;
}

export function EmailAutomationDetailClient({ automation }: EmailAutomationDetailClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{automation.name}</h1>
          <p className="text-muted-foreground">{automation.site?.name || "All sites"} - {automation.triggerType}</p>
        </div>
        <Badge variant="outline">{automation.isActive ? "ACTIVE" : "PAUSED"}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><span className="font-medium">Subject:</span> {automation.subjectTemplate}</p>
          <p><span className="font-medium">Body:</span> {automation.bodyTemplate}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent runs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {automation.runs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No runs yet.</p>
          ) : (
            automation.runs.map((run) => (
              <div key={run.id} className="rounded border border-border p-3">
                <p className="text-sm font-medium">{run.recipientEmail}</p>
                <p className="text-xs text-muted-foreground">
                  Status: {run.status} | Created: {new Date(run.createdAt).toLocaleString()}
                </p>
                {run.errorMessage ? (
                  <p className="mt-1 text-xs text-muted-foreground">{run.errorMessage}</p>
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
