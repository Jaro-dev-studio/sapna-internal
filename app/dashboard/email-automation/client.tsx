"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { createEmailAutomation, runEmailAutomationNow, toggleEmailAutomationActive } from "@/lib/actions";
import type { EmailAutomationData } from "@/lib/ecommerce-fetchers";
import type { Site } from "@/lib/mock-data/types";

interface EmailAutomationClientProps {
  automations: EmailAutomationData[];
  sites: Site[];
}

export function EmailAutomationClient({ automations, sites }: EmailAutomationClientProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    triggerType: "MANUAL" as
      | "ABANDONED_CART"
      | "POST_PURCHASE"
      | "PRODUCT_BACK_IN_STOCK"
      | "WINBACK"
      | "MANUAL",
    siteId: "none",
    subjectTemplate: "",
    bodyTemplate: "",
  });

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await createEmailAutomation({
        name: form.name,
        triggerType: form.triggerType,
        siteId: form.siteId === "none" ? undefined : form.siteId,
        subjectTemplate: form.subjectTemplate,
        bodyTemplate: form.bodyTemplate,
      });

      if (result.error) {
        setMessage(result.error);
        return;
      }

      setForm({
        name: "",
        triggerType: "MANUAL",
        siteId: "none",
        subjectTemplate: "",
        bodyTemplate: "",
      });
      setMessage("Email automation created.");
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Email Automation</h1>
        <p className="text-muted-foreground">
          Build automated lifecycle emails and trigger them manually when needed.
        </p>
      </div>

      {message ? (
        <div className="rounded border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
          {message}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Create automation</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 md:grid-cols-2" onSubmit={handleCreate}>
            <div className="space-y-1 md:col-span-2">
              <Label>Name</Label>
              <Input
                required
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Trigger</Label>
              <Select
                value={form.triggerType}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    triggerType: value as
                      | "ABANDONED_CART"
                      | "POST_PURCHASE"
                      | "PRODUCT_BACK_IN_STOCK"
                      | "WINBACK"
                      | "MANUAL",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MANUAL">Manual</SelectItem>
                  <SelectItem value="ABANDONED_CART">Abandoned cart</SelectItem>
                  <SelectItem value="POST_PURCHASE">Post purchase</SelectItem>
                  <SelectItem value="PRODUCT_BACK_IN_STOCK">Back in stock</SelectItem>
                  <SelectItem value="WINBACK">Winback</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Site scope</Label>
              <Select
                value={form.siteId}
                onValueChange={(value) => setForm((current) => ({ ...current, siteId: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">All sites</SelectItem>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label>Subject template</Label>
              <Input
                required
                value={form.subjectTemplate}
                onChange={(event) =>
                  setForm((current) => ({ ...current, subjectTemplate: event.target.value }))
                }
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label>Body template</Label>
              <Input
                required
                value={form.bodyTemplate}
                onChange={(event) =>
                  setForm((current) => ({ ...current, bodyTemplate: event.target.value }))
                }
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={isPending}>Create automation</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing automations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {automations.map((automation) => (
            <div key={automation.id} className="rounded border border-border p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{automation.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {automation.site?.name || "All sites"} - {automation.triggerType}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Runs: {automation.runsCount}
                  </p>
                </div>
                <Badge variant="outline">{automation.isActive ? "ACTIVE" : "PAUSED"}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isPending}
                  onClick={() =>
                    startTransition(async () => {
                      const result = await toggleEmailAutomationActive(automation.id);
                      setMessage(result.error ?? "Automation updated.");
                    })
                  }
                >
                  {automation.isActive ? "Pause" : "Activate"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isPending}
                  onClick={() =>
                    startTransition(async () => {
                      const result = await runEmailAutomationNow({
                        automationId: automation.id,
                        recipientEmail: "test@example.com",
                      });
                      setMessage(result.error ?? "Automation run executed for test@example.com.");
                    })
                  }
                >
                  Run test send
                </Button>
                <Link href={`/dashboard/email-automation/${automation.id}`}>
                  <Button size="sm" variant="ghost">Details</Button>
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
