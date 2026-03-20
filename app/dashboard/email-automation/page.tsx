import { getEmailAutomations, getSites } from "@/lib/fetchers";
import { EmailAutomationClient } from "./client";

export default async function EmailAutomationPage() {
  const [{ data: automations, error }, { data: sites, error: sitesError }] = await Promise.all([
    getEmailAutomations(),
    getSites(),
  ]);

  if (!automations || !sites || error || sitesError) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{error || sitesError || "Failed to load email automation"}</p>
      </div>
    );
  }

  return <EmailAutomationClient automations={automations} sites={sites} />;
}
