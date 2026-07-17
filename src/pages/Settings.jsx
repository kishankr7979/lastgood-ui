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
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">Organization Settings</h1>
      <p className="text-text-secondary text-sm mb-8">
        Manage your organization and API keys.
      </p>

      {apiKeys && apiKeys.key_hash ? (
        <div className="bg-gradient-card border border-white/10 rounded-xl overflow-hidden mb-8 shadow-lg hover:border-accent/30 transition-all duration-300">
          <div className="p-6 border-b border-white/10 bg-black/20">
            <h2 className="font-semibold text-xl flex items-center gap-2">
              <Shield size={20} className="text-accent" />
              API Configuration
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">
                Active API Key
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-bg-primary border border-border rounded-lg px-4 py-3 font-mono text-sm text-text-secondary relative group overflow-hidden">
                  <div className="truncate">
                    {showKey
                      ? apiKeys.key_hash
                      : "••••••••••••••••••••••••••••••••"}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="px-3 py-1.5 text-xs text-accent hover:text-accent-hover font-medium border border-accent/20 hover:border-accent/40 rounded-lg transition-colors bg-accent/5 hover:bg-accent/10"
                  >
                    {showKey ? "Hide" : "Show"}
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-primary hover:text-white font-medium border border-white/10 hover:border-white/20 rounded-lg transition-colors bg-white/5 hover:bg-white/10"
                    title="Copy API Key"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 size={14} className="text-status-success" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <CreateAPIKey onKeyCreated={fetchApiKeys} />
      )}

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
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">
                Organization Name
              </label>
              <div className="text-text-secondary text-lg font-medium">
                {organization.name}
              </div>
            </div>
            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">
                Plan
              </label>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                {organization.plan.toUpperCase()}
              </div>
            </div>
            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">
                Organization ID
              </label>
              <div className="text-text-secondary font-mono text-sm">
                {organization.id}
              </div>
            </div>
            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">
                Slug
              </label>
              <div className="text-text-secondary font-mono text-sm">
                {organization.slug}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
