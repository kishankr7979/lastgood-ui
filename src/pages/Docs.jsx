import React, { useState } from "react";
import GitHubWebhookModal from "../components/GitHubWebhookModal/GitHubWebhookModal";
import { Terminal, Book, ChevronRight } from "lucide-react";

const Docs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <GitHubWebhookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Documentation</h1>
        <p className="text-text-secondary">
          How to integrate LastGood into your workflow.
        </p>
      </div>

      <div className="grid gap-8">
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Book size={20} className="text-accent" />
            Sending Change Events
          </h2>
          <div className="prose prose-invert max-w-none text-text-secondary">
            <p className="mb-4">
              Send a POST request to the <code>/change-events</code> endpoint
              whenever you deploy code, change configuration, or toggle a
              feature flag.
            </p>
          </div>

          <div className="bg-gradient-card border border-white/10 rounded-xl mt-4 overflow-hidden">
            <div className="bg-black/20 px-4 py-2 border-b border-white/10 flex items-center gap-2">
              <Terminal size={14} className="text-text-muted" />
              <span className="text-xs font-mono text-text-muted">
                cURL Example
              </span>
            </div>
            <pre className="p-4 overflow-x-auto text-sm font-mono text-accent/90">
              {`curl -X POST https://api.lastgood.space/v1/change-events \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "summary": "Deployed payment-service v2.1",
    "service": "payments",
    "environment": "production",
    "meta": {
      "author": "jane@example.com",
      "commit": "a1b2c3d"
    }
  }'`}
            </pre>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <div
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-card border border-white/10 rounded-xl p-6 hover:border-accent/50 transition-all duration-300 cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <h3 className="relative z-10 font-semibold text-text-primary mb-2 flex items-center justify-between">
              GitHub Webhook
              <ChevronRight
                size={16}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-accent"
              />
            </h3>
            <p className="relative z-10 text-sm text-text-muted">
              Automatically report deployments from your GitHub Actions
              workflows.
            </p>
          </div>
          <div className="bg-gradient-card border border-white/10 rounded-xl p-6 hover:border-accent/50 transition-all duration-300 cursor-pointer group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <h3 className="relative z-10 font-semibold text-text-primary mb-2 flex items-center justify-between">
              GitLab
              <span className="text-xs font-medium bg-bg-tertiary text-text-muted px-2 py-1 rounded-full">
                Coming Soon
              </span>
            </h3>
            <p className="text-sm text-text-muted">
              Track deployments from your GitLab pipelines.
            </p>
          </div>
          <div className="bg-gradient-card border border-white/10 rounded-xl p-6 hover:border-accent/50 transition-all duration-300 cursor-pointer group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <h3 className="relative z-10 font-semibold text-text-primary mb-2 flex items-center justify-between">
              Kubernetes Operator
              <span className="text-xs font-medium bg-bg-tertiary text-text-muted px-2 py-1 rounded-full">
                Coming Soon
              </span>
            </h3>
            <p className="text-sm text-text-muted">
              Watch for changes in your cluster and report them automatically.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Docs;
