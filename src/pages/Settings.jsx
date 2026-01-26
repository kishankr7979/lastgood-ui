import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Shield } from "lucide-react";
import useOrgStore from "../stores/useOrgStore";
import { LoadingState } from "../components/LoadingState/LoadingState";
import { getAPIKeyByOrg } from "../service/api-key";
import { useOrganization } from "../hooks/useOrganization";
import CreateAPIKey from "../components/CreateAPIKey/CreateAPIKey";

const Settings = () => {
  const [showKey, setShowKey] = useState(false);

  // Use global store
  const { data: organization, isLoading, error } = useOrganization();

  const { data: apiKeys = [], refetch: fetchApiKeys } = useQuery({
    queryKey: ["apiKeys", organization?.id],
    queryFn: () => getAPIKeyByOrg(organization.id),
    enabled: !!organization?.id,
  });

  console.log(apiKeys);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Organization Settings</h1>
      <p className="text-text-secondary mb-8">
        Manage your organization and API keys.
      </p>

      {apiKeys && apiKeys.key_hash ? (
        <div className="bg-gradient-card border border-white/10 rounded-xl overflow-hidden mb-8 shadow-lg">
          <div className="p-6 border-b border-white/10 bg-black/20">
            <h2 className="font-semibold text-lg flex items-center gap-2">
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
                <div className="flex-1 bg-bg-primary border border-border rounded-lg px-4 py-3 font-mono text-sm text-text-secondary">
                  {showKey
                    ? apiKeys.key_hash
                    : "••••••••••••••••••••••••••••••••"}
                </div>
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="text-sm text-accent hover:text-accent-hover font-medium"
                >
                  {showKey ? "Hide" : "Show"}
                </button>
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
