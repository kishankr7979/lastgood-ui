import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Terminal, Github, Webhook, ChevronRight, Copy, CheckCircle2, Blocks, ArrowRight, Eye, EyeOff } from "lucide-react";
import useOrgStore from "../stores/useOrgStore";
import { getAPIKeyByOrg } from "../service/api-key";

const Integrations = () => {
  const { org } = useOrgStore();
  const [copiedStates, setCopiedStates] = useState({});
  const [showSecret, setShowSecret] = useState(false);

  const { data: apiKeys = [] } = useQuery({
    queryKey: ["apiKeys", org?.id],
    queryFn: () => getAPIKeyByOrg(org.id),
    enabled: !!org?.id,
  });

  const apiSecret = apiKeys?.key_hash || "Generate key in Settings";

  const webhookUrl = org?.id
    ? `https://api.lastgood.space/webhooks/github/${org.id}`
    : "Loading organization details...";

  const handleCopy = (id, text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStates((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [id]: false }));
      }, 2000);
    });
  };

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-3 text-white">
          <div className="p-2 bg-accent/10 rounded-xl border border-accent/20 shadow-sm">
            <Blocks className="text-accent h-5 w-5" />
          </div>
          Integrations
        </h1>
        <p className="text-text-muted text-sm max-w-2xl">
          Connect your infrastructure ecosystem to LastGood. We'll automatically ingest, correlate, and analyze changes to help you debug perfectly.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-8">
        {/* Main Content Pane */}
        <div className="space-y-8">

          {/* GitHub Webhooks Integration */}
          <section className="surface border border-accent/20 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
            <div className="px-6 py-4 border-b border-white/5 bg-black/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                  <Github className="text-black h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">GitHub Webhooks</h2>
                  <p className="text-xs text-text-muted">Track deployments, PRs, and config changes automatically.</p>
                </div>
              </div>
              <div className="bg-status-success/10 text-status-success px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-status-success/20">
                Recommended
              </div>
            </div>

            <div className="p-6 bg-black/20 overflow-hidden">
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-white/10 before:via-white/10 before:to-transparent">

                {/* Step 1 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full border-2 border-accent bg-background text-accent font-bold z-10 shadow-[0_0_10px_rgba(45,212,191,0.5)] md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    1
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl bg-black/40 border border-white/10 shadow-lg min-w-0">
                    <h3 className="font-bold text-white mb-2 text-xs uppercase tracking-wide">Configure Webhook</h3>
                    <p className="text-text-muted text-xs mb-3">Go to your GitHub repository <ArrowRight size={10} className="inline mx-1" /> Settings <ArrowRight size={10} className="inline mx-1" /> Webhooks and click "Add webhook". Paste your unique ingestion URL and explicitly set the <strong className="text-white">Content type</strong> to <code className="bg-black/50 px-1 rounded">application/json</code>.</p>

                    <div className="flex items-center justify-between gap-2 bg-black/60 border border-white/5 rounded-md p-1 focus-within:border-accent/50 transition-colors min-w-0">
                      <code className="px-2 text-[10px] sm:text-xs text-accent font-mono truncate min-w-0 flex-1">{webhookUrl}</code>
                      <button
                        onClick={() => handleCopy('github-url', webhookUrl)}
                        className="p-1.5 hover:bg-white/10 rounded transition-colors text-text-muted hover:text-white shrink-0"
                        title="Copy URL"
                      >
                        {copiedStates['github-url'] ? <CheckCircle2 size={16} className="text-status-success" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full border-2 border-white/20 bg-background text-white/50 font-bold z-10 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    2
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl bg-black/40 border border-white/10 shadow-lg min-w-0">
                    <h3 className="font-bold text-white mb-2 text-xs uppercase tracking-wide">Webhook Secret</h3>
                    <p className="text-text-muted text-xs mb-3">We cryptographically verify all payloads coming from GitHub using your API Key to prevent spoofing.</p>
                    <div className="bg-status-warning/10 border border-status-warning/20 rounded-md px-3 py-2 text-xs text-status-warning mb-3">
                      Paste your <strong className="font-bold">LastGood API Key</strong> into GitHub's <strong>"Secret"</strong> field.
                    </div>

                    <div className="flex items-center justify-between gap-2 bg-black/60 border border-white/5 rounded-md p-1 focus-within:border-accent/50 transition-colors min-w-0">
                      <code className="px-2 text-[10px] sm:text-xs text-accent font-mono truncate min-w-0 flex-1">
                        {showSecret ? apiSecret : "••••••••••••••••••••••••••••••••"}
                      </code>
                      <div className="flex items-center shrink-0">
                        <button
                          onClick={() => setShowSecret(!showSecret)}
                          className="p-1.5 hover:bg-white/10 rounded transition-colors text-text-muted hover:text-white"
                          title={showSecret ? "Hide Secret" : "Show Secret"}
                        >
                          {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          onClick={() => handleCopy('github-secret', apiSecret)}
                          className="p-1.5 hover:bg-white/10 rounded transition-colors text-text-muted hover:text-white"
                          title="Copy Secret"
                        >
                          {copiedStates['github-secret'] ? <CheckCircle2 size={16} className="text-status-success" /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full border-2 border-white/20 bg-background text-white/50 font-bold z-10 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    3
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl bg-black/40 border border-white/10 shadow-lg min-w-0">
                    <h3 className="font-bold text-white mb-2 text-xs uppercase tracking-wide">Event Triggers</h3>
                    <p className="text-text-muted text-xs mb-3">Under "Which events would you like to trigger this webhook?", explicitly select "Let me select individual events".</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-white">Pushes</span>
                      <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-white">Workflow runs</span>
                      <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-white">Page builds</span>
                      <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-white">Deployments</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* REST API Integration */}
          <section className="bg-black/30 border border-white/5 rounded-3xl overflow-hidden shadow-xl min-w-0">
            <div className="px-6 py-4 border-b border-white/5 bg-black/40">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Terminal className="text-text-muted h-5 w-5" />
                REST API Integration
              </h2>
            </div>
            <div className="p-6">
              <div className="prose prose-invert max-w-none text-text-secondary text-sm mb-4">
                <p>
                  For custom integrations (e.g. CI/CD pipelines, feature flagging tools), send a POST request to our Changes API.
                </p>
              </div>

              <div className="bg-[#050510] border border-white/10 rounded-xl overflow-hidden">
                <div className="bg-black/40 px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5 mr-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                    </div>
                    <span className="text-xs font-mono text-text-muted">cURL</span>
                  </div>
                  <button
                    onClick={() => handleCopy('curl', `curl -X POST https://api.lastgood.space/v1/change-events \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "summary": "Deployed payment-service v2.1 for testing",
    "service": "payments",
    "environment": "prod",
    "source":"Jenkins",
    "occurred_at":"2026-04-09T10:25:26.374Z",
    "type":"deployment",
    "meta": {
      "author": "jane@example.com",
      "commit": "a1b2c3d"
    }
  }'`)}
                    className="text-text-muted hover:text-white transition-colors"
                  >
                    {copiedStates['curl'] ? <CheckCircle2 size={16} className="text-status-success" /> : <Copy size={16} />}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-xs font-mono text-text-secondary">
                  <code className="text-blue-300">curl</code> -X POST https://api.lastgood.space/v1/change-events \<br />
                  {"  "}-H <span className="text-green-300">"Authorization: Bearer YOUR_API_KEY"</span> \<br />
                  {"  "}-H <span className="text-green-300">"Content-Type: application/json"</span> \<br />
                  {"  "}-d <span className="text-green-300">{`'{
    "summary": "Deployed payment-service v2.1 for testing",
    "service": "payments",
    "environment": "prod",
    "source":"Jenkins",
    "occurred_at":"2026-04-09T10:25:26.374Z",
    "type":"deployment",
    "meta": {
      "author": "jane@example.com",
      "commit": "a1b2c3d"
    }
  }'`}</span>
                </pre>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Panel */}
        <div className="space-y-6">
          <div className="surface border border-white/5 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 uppercase text-xs tracking-wider text-text-muted">Available Add-ons <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">Soon</span></h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-transparent">
                <div className="flex items-center gap-3">
                  <Webhook size={20} className="text-white" />
                  <span className="text-sm font-medium text-white">Datadog</span>
                </div>
                <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">Soon</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 opacity-50 grayscale">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center text-[10px] font-bold text-black border border-white/20">GL</div>
                  <span className="text-sm font-medium text-white">GitLab</span>
                </div>
                <span className="text-xs bg-white/10 text-white/50 px-2 py-1 rounded">Soon</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 opacity-50 grayscale">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center border border-blue-500/20">
                    <Blocks size={12} className="text-blue-500" />
                  </div>
                  <span className="text-sm font-medium text-white">Kubernetes</span>
                </div>
                <span className="text-xs bg-white/10 text-white/50 px-2 py-1 rounded">Soon</span>
              </div>
            </div>
          </div>

          <div className="surface border border-white/5 rounded-2xl p-6 bg-gradient-to-b from-accent/5 to-transparent">
            <h3 className="font-bold text-white mb-2 text-sm">Need Help Setting Up?</h3>
            <p className="text-xs text-text-muted mb-4 leading-relaxed">Reach out to our engineering team for dedicated onboarding support.</p>
            <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors">
              Contact Support
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Integrations;
