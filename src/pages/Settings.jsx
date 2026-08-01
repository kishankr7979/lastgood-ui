import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Shield, Copy, CheckCircle2 } from "lucide-react";
import useOrgStore from "../stores/useOrgStore";
import { LoadingState } from "../components/LoadingState/LoadingState";
import { getAPIKeyByOrg } from "../service/api-key";
import { useOrganization } from "../hooks/useOrganization";
import CreateAPIKey from "../components/CreateAPIKey/CreateAPIKey";
import { toast } from "../components/ui/Toast";

const Settings = () => {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  // Use global store
  const { data: organization, isLoading, error } = useOrganization();

  const { data: apiKeys = [], refetch: fetchApiKeys } = useQuery({
    queryKey: ["apiKeys", organization?.id],
    queryFn: () => getAPIKeyByOrg(organization.id),
    enabled: !!organization?.id,
  });

  const handleCopy = () => {
    if (!apiKeys?.key_hash) return;
    navigator.clipboard.writeText(apiKeys.key_hash).then(() => {
      setCopied(true);
      toast.success("API key copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="p-8 max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-1 text-white">Project Profile</h1>
      <p className="text-text-secondary text-sm mb-8">
        Manage your organization's details and subscription.
      </p>

      <div className="bg-bg-secondary border border-border rounded-xl p-6 relative overflow-hidden">
        <h3 className="font-semibold text-text-primary mb-4">
          Organization Details
        </h3>

        {isLoading && <LoadingState message="Fetching org details..." />}

        {error && (
          <div className="text-status-error">
            Failed to load organization details.
          </div>
        )}

        {organization && (
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] text-text-muted font-mono uppercase tracking-wider mb-2">
                Organization Name
              </label>
              <div className="text-white text-base font-medium">
                {organization.name}
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-text-muted font-mono uppercase tracking-wider mb-2">
                Subscription Plan
              </label>
              <div className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-white/5 text-white border border-white/10">
                {organization.plan.toUpperCase()}
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-text-muted font-mono uppercase tracking-wider mb-2">
                Organization ID
              </label>
              <div className="text-text-secondary font-mono text-sm select-all">
                {organization.id}
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-text-muted font-mono uppercase tracking-wider mb-2">
                Team Size
              </label>
              <div className="text-text-secondary text-sm">
                1 Member (Owner)
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
