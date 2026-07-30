export const initialMockServices = [
  {
    id: "svc_1",
    name: "checkout-service",
    status: "active",
    eventCount: 342,
    lastActive: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    apiKeyId: "key_checkout",
    apiKeyValue: "lg_live_chkt_8f92j3n4v...",
    apiKeyLastUsed: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  }
];

export const mockIncident = {
  id: "INC-9942",
  title: "Checkout API Latency Spike",
  service: "checkout-service",
  environment: "production",
  status: "investigating",
  startedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
  severity: "high"
};

export const mockTimelineEvents = [
  {
    id: "evt_1",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    type: "github_pr",
    source: "GitHub",
    title: "Merge PR #412: Update redis cache configuration",
    author: "sarah.dev",
    description: "Modified TTL settings for checkout session cache to optimize memory usage.",
    riskScore: 25,
    isRootCauseCandidate: false,
    color: "blue"
  },
  {
    id: "evt_2",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    type: "k8s_deploy",
    source: "Kubernetes",
    title: "Deployment: checkout-service v1.4.2",
    author: "ci-cd-bot",
    description: "Rolled out new image for checkout-service to production cluster.",
    riskScore: 40,
    isRootCauseCandidate: false,
    color: "purple"
  },
  {
    id: "evt_3",
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    type: "feature_flag",
    source: "LaunchDarkly",
    title: "Flag enabled: new-checkout-flow",
    author: "alex.ops",
    description: "Toggled new-checkout-flow from false to true in production.",
    riskScore: 92,
    isRootCauseCandidate: true,
    color: "amber"
  },
  {
    id: "evt_4",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    type: "alert",
    source: "Datadog",
    title: "High Latency Alert: Checkout API > 2000ms",
    author: "datadog-monitor",
    description: "P99 latency for POST /checkout/process exceeded threshold of 2000ms.",
    riskScore: 100,
    isRootCauseCandidate: false,
    color: "red"
  }
];

export const mockAiDiagnosis = {
  summary: "The latency spike in the checkout service is highly correlated with the 'new-checkout-flow' feature flag being enabled 5 minutes prior to the alert. The recent cache configuration changes and deployment v1.4.2 do not appear to be the primary root cause.",
  rootCauseConfidence: 94,
  correlations: [
    {
      id: "corr_1",
      factor: "Feature Flag Toggle",
      details: "'new-checkout-flow' enabled by alex.ops",
      timeDelta: "-5 mins",
      impact: "Critical",
      relevanceScore: 98
    },
    {
      id: "corr_2",
      factor: "Kubernetes Deployment",
      details: "checkout-service v1.4.2",
      timeDelta: "-15 mins",
      impact: "Low",
      relevanceScore: 12
    }
  ],
  recommendations: [
    {
      id: "rec_1",
      action: "Disable Feature Flag",
      command: "Toggle 'new-checkout-flow' to FALSE in LaunchDarkly production environment",
      estimatedResolutionTime: "< 1 minute",
      type: "mitigation"
    },
    {
      id: "rec_2",
      action: "Review Cache Logic",
      command: "Investigate if the new checkout flow relies heavily on the recently modified redis cache TTLs.",
      estimatedResolutionTime: "1-2 hours",
      type: "investigation"
    }
  ]
};
