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
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2 text-white flex items-center gap-3">
          <div className="p-2.5 bg-accent/10 rounded-lg border border-accent/20">
            <Shield className="text-accent h-6 w-6" />
          </div>
          Organization Settings
        </h1>
        <p className="text-text-muted text-sm leading-relaxed">
          Manage your organization details, API keys, and integration credentials.
        </p>
      </div>

      <div className="space-y-8">
        {/* API Configuration Section */}
        {apiKeys && apiKeys.key_hash ? (
          <div className="surface border border-accent/20 rounded-2xl overflow-hidden shadow-md">
            <div className="p-6 border-b border-white/10 bg-black/40">
              <h2 className="font-semibold text-lg flex items-center gap-2.5 text-white">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                API Configuration
              </h2>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wide">
                  Active API Key
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1 bg-black/60 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-text-secondary overflow-hidden">
                    <div className="truncate">
                      {showKey
                        ? apiKeys.key_hash
                        : "••••••••••••••••••••••••••••••••"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setShowKey(!showKey)}
                      className="px-4 py-2.5 text-xs text-accent hover:text-accent-hover font-semibold border border-accent/20 hover:border-accent/40 rounded-lg transition-all bg-accent/5 hover:bg-accent/10 whitespace-nowrap"
                    >
                      {showKey ? "Hide Key" : "Show Key"}
                    </button>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-4 py-2.5 text-xs text-white hover:text-white font-semibold border border-white/10 hover:border-white/20 rounded-lg transition-all bg-white/5 hover:bg-white/10 whitespace-nowrap"
                      title="Copy API Key"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 size={14} className="text-status-success animate-pulse" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy Key</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-text-muted mt-3">
                  Use this key to authenticate API requests. Keep it secure and never share it publicly.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <CreateAPIKey onKeyCreated={fetchApiKeys} />
        )}

        {/* Organization Details Section */}
        <div className="surface border border-white/10 rounded-2xl overflow-hidden shadow-md">
          <div className="p-6 border-b border-white/10 bg-black/40">
            <h3 className="font-semibold text-lg flex items-center gap-2.5 text-white">
              <div className="w-2 h-2 rounded-full bg-white/40"></div>
              Organization Details
            </h3>
          </div>
          <div className="p-8">
            {isLoading && <LoadingState message="Fetching organization details..." />}

            {error && (
              <div className="bg-status-error/10 border border-status-error/30 text-status-error p-4 rounded-lg text-sm">
                Failed to load organization details.
              </div>
            )}

            {organization && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-text-muted uppercase tracking-wider font-semibold mb-2">
                    Organization Name
                  </label>
                  <div className="text-text-primary text-lg font-medium bg-black/40 rounded-lg px-4 py-3">
                    {organization.name}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-text-muted uppercase tracking-wider font-semibold mb-2">
                    Current Plan
                  </label>
                  <div className="inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-accent/10 text-accent border border-accent/20">
                    {organization.plan.toUpperCase()}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-text-muted uppercase tracking-wider font-semibold mb-2">
                    Organization ID
                  </label>
                  <div className="text-text-secondary font-mono text-sm bg-black/40 rounded-lg px-4 py-3 break-all">
                    {organization.id}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-text-muted uppercase tracking-wider font-semibold mb-2">
                    Organization Slug
                  </label>
                  <div className="text-text-secondary font-mono text-sm bg-black/40 rounded-lg px-4 py-3">
                    {organization.slug}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
