import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Activity,
    Plus,
    Copy,
    Check,
    AlertCircle,
    Server,
    Shield,
    Calendar,
    LineChart,
    ArrowRight,
    Loader2,
    RefreshCw,
    X,
    Code,
    Terminal,
    Play,
    Trash2,
    Github
} from 'lucide-react';
import { getServices, createServiceApiKey, sendTestEvent, deleteService, getIntegrationByProvider } from '../service/auth';
import { toast } from '../components/ui/Toast';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useOrganization } from '../hooks/useOrganization';
import { API_BASE_URL } from '../constants';

dayjs.extend(relativeTime);

const Services = () => {
    const queryClient = useQueryClient();
    const { data: org } = useOrganization();
    const [copiedKeyId, setCopiedKeyId] = useState(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [integrationService, setIntegrationService] = useState(null);
    const [sendingTest, setSendingTest] = useState(false);
    const [newService, setNewService] = useState({ name: '', keyName: '' });
    const [generatedKey, setGeneratedKey] = useState(null);
    const [copiedNewKey, setCopiedNewKey] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);

    // Fetch GitHub Integration Status
    const { data: githubIntegration } = useQuery({
        queryKey: ['integration', 'github', org?.id],
        queryFn: () => getIntegrationByProvider('github'),
        enabled: !!org?.id,
        refetchOnWindowFocus: false
    });

    // Fetch Services List
    const { data: services = [], isLoading, refetch, isFetching } = useQuery({
        queryKey: ['services'],
        queryFn: getServices,
        refetchOnWindowFocus: false
    });

    // Create Service Dedicated Key Mutation
    const { mutate: createKey, isPending: creating } = useMutation({
        mutationFn: () => createServiceApiKey(
            newService.keyName || `${newService.name} Dedicated Key`,
            newService.name
        ),
        onSuccess: (data) => {
            setGeneratedKey(data.api_key);
            toast.success('Service API Key generated successfully!');
            queryClient.invalidateQueries(['services']);
        },
        onError: (err) => {
            const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to generate key';
            toast.error(errMsg);
        }
    });

    // Delete Service Mutation
    const { mutate: handleDeleteService, isPending: deletingService } = useMutation({
        mutationFn: (serviceId) => deleteService(serviceId),
        onSuccess: () => {
            toast.success('Service and associated events deleted successfully!');
            queryClient.invalidateQueries(['services']);
            setServiceToDelete(null);
        },
        onError: (err) => {
            const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to delete service';
            toast.error(errMsg);
            setServiceToDelete(null);
        }
    });

    const handleCopy = (text, keyId) => {
        navigator.clipboard.writeText(text);
        setCopiedKeyId(keyId);
        setTimeout(() => setCopiedKeyId(null), 2000);
        toast.success('API Key copied to clipboard!');
    };

    const handleCopyNewKey = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedNewKey(true);
        setTimeout(() => setCopiedNewKey(false), 2000);
        toast.success('Copied dedicated API Key!');
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        if (!newService.name.trim()) {
            toast.error('Service name is required');
            return;
        }
        createKey();
    };

    const handleCloseModal = () => {
        setIsCreateOpen(false);
        setGeneratedKey(null);
        setNewService({ name: '', keyName: '' });
    };

    const handleTestEvent = async () => {
        if (!integrationService) return;
        setSendingTest(true);
        try {
            await sendTestEvent(integrationService.name);
            toast.success('Test event sent successfully!');
            queryClient.invalidateQueries(['services']);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send test event');
        } finally {
            setSendingTest(false);
        }
    };

    // Limits check (assume Free plan has limit of 2)
    const distinctServicesCount = services.filter(s => s.status === 'active').length;
    const isAtLimit = distinctServicesCount >= 2;

    return (
        <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6 text-text-primary">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        <Server className="text-accent" size={24} />
                        Services & Projects
                    </h1>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                        Register your backend servers or microservices to isolate incoming change events with dedicated API keys.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => refetch()}
                        disabled={isLoading || isFetching}
                        className="p-2 border border-white/10 rounded-lg hover:bg-white/5 text-text-secondary transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
                    </button>
                    {githubIntegration?.status === 'active' ? (
                        <button
                            onClick={() => {
                                if (org?.id) {
                                    window.location.href = `${API_BASE_URL}/api/integrations/github-app/install?orgId=${org.id}`;
                                }
                            }}
                            className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-emerald-400 shadow-sm"
                            title="GitHub App is connected. Click to manage or re-authorize repositories."
                        >
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <Github size={14} />
                            <span>GitHub Connected</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                if (org?.id) {
                                    window.location.href = `${API_BASE_URL}/api/integrations/github-app/install?orgId=${org.id}`;
                                }
                            }}
                            className="flex items-center gap-2 bg-[#24292e] hover:bg-[#2f363d] px-4 py-2.5 rounded-lg text-xs font-semibold transition-all text-white shadow-lg border border-white/10"
                        >
                            <Github size={14} />
                            Connect GitHub
                        </button>
                    )}
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="flex items-center gap-2 bg-gradient-accent px-4 py-2.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-all text-black shadow-lg shadow-accent/15"
                    >
                        <Plus size={14} />
                        Connect Service
                    </button>
                </div>
            </div>

            {/* Billing limit notification for Free plan */}
            {isAtLimit && (
                <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl flex items-start gap-3 text-amber-400">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <h4 className="text-xs font-semibold text-white">Project Ingestion Limit Reached (2/2)</h4>
                        <p className="text-[11px] text-text-muted leading-relaxed">
                            You are currently on the Free plan which supports up to 2 distinct active services. Ingesting signals from a third service will be blocked until you upgrade to a paid tier.
                        </p>
                    </div>
                </div>
            )}


            {/* Loading state */}
            {isLoading ? (
                <div className="flex flex-col justify-center items-center py-20 gap-3">
                    <Loader2 className="animate-spin text-accent" size={24} />
                    <span className="text-xs text-text-muted">Loading services list...</span>
                </div>
            ) : services.length === 0 ? (
                <div className="border border-dashed border-white/10 rounded-2xl p-16 text-center space-y-4">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mx-auto text-text-secondary">
                        <Server size={20} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-white">No Connected Services</h3>
                        <p className="text-xs text-text-muted max-w-xs mx-auto leading-relaxed">
                            Connect your first backend service or deployment pipeline to begin ingesting change signals.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-white/5 border border-white/10 hover:border-white/20 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-white/10 transition-all text-white"
                    >
                        Create Dedicated API Key
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service, idx) => {
                        const hasKey = !!service.apiKeyId;
                        return (
                            <div
                                key={idx}
                                className="bg-[#090d16]/30 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all relative group flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    {/* Service Name & Status Badge */}
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                                                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                            </span>
                                            <span className="text-sm font-semibold text-white">{service.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${service.status === 'active'
                                                ? 'border-emerald-500/20 bg-emerald-950/20 text-emerald-400'
                                                : 'border-amber-500/20 bg-amber-950/20 text-amber-400'
                                                }`}>
                                                {service.status === 'active' ? 'Active Ingest' : 'Pending Signal'}
                                            </span>
                                            <button
                                                onClick={() => setServiceToDelete(service)}
                                                className="text-text-muted hover:text-red-400 transition-colors p-1"
                                                title="Delete Service"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-4 my-2">
                                        <div className="space-y-1">
                                            <div className="text-[9px] uppercase tracking-wider text-text-muted font-mono flex items-center gap-1">
                                                <LineChart size={10} />
                                                Ingestion Count
                                            </div>
                                            <div className="text-xs text-white font-semibold">
                                                {service.eventCount} events
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[9px] uppercase tracking-wider text-text-muted font-mono flex items-center gap-1">
                                                <Calendar size={10} />
                                                Last Active
                                            </div>
                                            <div className="text-xs text-white font-semibold">
                                                {service.lastActive
                                                    ? dayjs(service.lastActive).fromNow()
                                                    : 'Never'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* API Key Section */}
                                <div className="mt-4 pt-2">
                                    {hasKey ? (
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-[10px] text-text-muted">
                                                <span className="flex items-center gap-1">
                                                    <Shield size={10} />
                                                    Dedicated API Key:
                                                </span>
                                                <span>
                                                    {service.apiKeyLastUsed
                                                        ? `Last used ${dayjs(service.apiKeyLastUsed).fromNow()}`
                                                        : 'Never used'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs">
                                                <span className="font-mono text-text-secondary select-all">
                                                    {/* Truncated representation of Key */}
                                                    {service.apiKeyValue ? service.apiKeyValue.substring(0, 10) + '••••••••' : '••••••••••••••••'}
                                                </span>
                                                {service.apiKeyValue && (
                                                    <button
                                                        onClick={() => handleCopy(service.apiKeyValue, service.apiKeyId)}
                                                        className="text-text-muted hover:text-white transition-colors"
                                                        title="Copy API Key"
                                                    >
                                                        {copiedKeyId === service.apiKeyId ? (
                                                            <Check size={14} className="text-emerald-400" />
                                                        ) : (
                                                            <Copy size={14} />
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => setIntegrationService(service)}
                                                className="w-full mt-2 flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:border-accent/50 hover:bg-white/10 py-1.5 rounded-lg text-[10px] font-semibold text-text-muted hover:text-white transition-all"
                                            >
                                                <Code size={12} />
                                                Integration Guide
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center border border-dashed border-white/10 rounded-lg p-3">
                                            <span className="text-[10px] text-text-muted">No dedicated credentials yet.</span>
                                            <button
                                                onClick={() => {
                                                    setNewService({ name: service.name, keyName: `${service.name} Dedicated Key` });
                                                    setIsCreateOpen(true);
                                                }}
                                                className="text-[10px] font-semibold text-accent hover:text-white transition-colors"
                                            >
                                                Generate Dedicated Key
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* CREATE / DEDICATED KEY MODAL */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={handleCloseModal}
                    />

                    {/* Modal Body */}
                    <div className="bg-[#0b0f19] border border-white/10 rounded-2xl p-6 w-full max-w-[400px] relative z-10 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                <Shield className="text-accent" size={16} />
                                Connect New Service
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-text-muted hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {generatedKey ? (
                            // STEP 2: Display Generated Key
                            <div className="space-y-4">
                                <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-lg flex items-start gap-2.5 text-[11px] text-amber-400 leading-relaxed">
                                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                                    <span>
                                        This is the <strong>only time</strong> this API key will be displayed. Copy and store it securely now.
                                    </span>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] text-text-muted font-mono uppercase">API KEY</label>
                                    <div className="flex items-center justify-between bg-black/50 border border-white/10 rounded-lg p-3 text-xs">
                                        <span className="font-mono text-white break-all select-all pr-2">
                                            {generatedKey}
                                        </span>
                                        <button
                                            onClick={() => handleCopyNewKey(generatedKey)}
                                            className="text-text-muted hover:text-white shrink-0 transition-colors"
                                            title="Copy API Key"
                                        >
                                            {copiedNewKey ? (
                                                <Check size={16} className="text-emerald-400" />
                                            ) : (
                                                <Copy size={16} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCloseModal}
                                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-lg text-xs font-semibold transition-all mt-4"
                                >
                                    I have saved the API Key
                                </button>
                            </div>
                        ) : (
                            // STEP 1: Capture Service Name
                            <form onSubmit={handleCreateSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] text-text-muted font-mono uppercase">Service (Project) Name</label>
                                    <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-accent/50 transition-all">
                                        <Server size={15} className="text-text-muted shrink-0" />
                                        <input
                                            type="text"
                                            value={newService.name}
                                            onChange={(e) => setNewService(prev => ({
                                                ...prev,
                                                name: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                                            }))}
                                            className="flex-1 bg-transparent outline-none text-xs text-white placeholder-white/20"
                                            placeholder="e.g. backend-api"
                                            required
                                            disabled={creating}
                                        />
                                    </div>
                                    <p className="text-[9px] text-text-muted leading-relaxed">
                                        Alphanumeric lowercase and hyphens only (e.g. `billing-service`).
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] text-text-muted font-mono uppercase">Key Label (Optional)</label>
                                    <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-accent/50 transition-all">
                                        <Shield size={15} className="text-text-muted shrink-0" />
                                        <input
                                            type="text"
                                            value={newService.keyName}
                                            onChange={(e) => setNewService(prev => ({ ...prev, keyName: e.target.value }))}
                                            className="flex-1 bg-transparent outline-none text-xs text-white placeholder-white/20"
                                            placeholder="e.g. Production Key"
                                            disabled={creating}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-accent py-2.5 rounded-lg text-xs font-semibold hover:opacity-95 disabled:opacity-50 transition-all active:scale-[0.985] text-white shadow-lg shadow-accent/10 mt-6"
                                >
                                    {creating ? (
                                        <>
                                            <Loader2 className="animate-spin text-white" size={14} />
                                            Generating Key...
                                        </>
                                    ) : (
                                        <>
                                            Generate Dedicated Key
                                            <ArrowRight size={13} className="ml-0.5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* INTEGRATION GUIDE MODAL */}
            {integrationService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => setIntegrationService(null)}
                    />

                    {/* Modal Body */}
                    <div className="bg-[#0b0f19] border border-white/10 rounded-2xl p-6 w-full max-w-2xl relative z-10 space-y-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                    <Code className="text-accent" size={16} />
                                    Integration Guide: {integrationService.name}
                                </h3>
                                <p className="text-[11px] text-text-muted mt-1">
                                    Push change events to this service using its dedicated API key.
                                </p>
                            </div>
                            <button
                                onClick={() => setIntegrationService(null)}
                                className="text-text-muted hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* cURL Example */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                                    <Terminal size={14} className="text-text-secondary" />
                                    cURL Example
                                </h4>
                                <div className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto relative group">
                                    <pre className="text-[11px] text-emerald-400/90 font-mono leading-relaxed">
                                        {`curl -X POST https://api.lastgood.space/change-events \\
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{
    "occurred_at": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
    "service": "${integrationService.name}",
    "environment": "production",
    "type": "deployment",
    "source": "ci-pipeline",
    "summary": "Deployed version 1.0.42",
    "meta": {
      "commit": "a1b2c3d",
      "author": "jane.doe@example.com"
    }
  }'`}
                                    </pre>
                                </div>
                            </div>

                            {/* GitHub Actions Example */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                                    <Shield size={14} className="text-text-secondary" />
                                    GitHub Actions (Deploy Workflow)
                                </h4>
                                <div className="bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto relative group">
                                    <pre className="text-[11px] text-blue-400/90 font-mono leading-relaxed">
                                        {`name: Notify LastGood

on:
  push:
    branches: [ "main" ]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Send Event to LastGood
        run: |
          curl -X POST https://api.lastgood.space/change-events \\
          -H "Authorization: Bearer \${{ secrets.LASTGOOD_API_KEY }}" \\
          -H "Content-Type: application/json" \\
          -d '{
            "occurred_at": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
            "service": "${integrationService.name}",
            "environment": "production",
            "type": "deployment",
            "source": "github-actions",
            "summary": "Deployment from \${{ github.sha }}",
            "meta": {
              "actor": "\${{ github.actor }}",
              "run_id": "\${{ github.run_id }}"
            }
          }'`}
                                    </pre>
                                </div>
                            </div>

                            {/* Test Sandbox */}
                            <div className="border-t border-white/5 pt-6 space-y-3">
                                <div>
                                    <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                                        <Play size={14} className="text-text-secondary" />
                                        Sandbox Sandbox
                                    </h4>
                                    <p className="text-[11px] text-text-muted mt-1">
                                        Verify your connection by sending a mock deployment event right now. It will appear on your timeline instantly.
                                    </p>
                                </div>
                                <button
                                    onClick={handleTestEvent}
                                    disabled={sendingTest}
                                    className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-accent/50 hover:bg-white/10 px-4 py-2.5 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-50"
                                >
                                    {sendingTest ? (
                                        <Loader2 className="animate-spin text-text-muted" size={14} />
                                    ) : (
                                        <Play size={14} className="text-accent" />
                                    )}
                                    {sendingTest ? 'Sending...' : 'Send Test Event'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {serviceToDelete && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-card border border-white/10 rounded-xl shadow-lg p-8 max-w-md w-full relative">
                        <button
                            onClick={() => !deletingService && setServiceToDelete(null)}
                            className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors disabled:opacity-50"
                            disabled={deletingService}
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-bold mb-3 text-white flex items-center gap-2">
                            <Trash2 size={20} className="text-status-error" />
                            Confirm Deletion
                        </h2>
                        <p className="text-sm text-text-secondary mb-8 leading-relaxed">
                            Are you sure you want to delete the service <strong className="text-white">"{serviceToDelete.name}"</strong> and ALL of its associated events? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setServiceToDelete(null)}
                                disabled={deletingService}
                                className="px-4 py-2 bg-bg-tertiary hover:bg-bg-primary border border-white/10 hover:border-white/20 rounded-lg text-text-primary text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteService(serviceToDelete.service_id)}
                                disabled={deletingService}
                                className="flex items-center justify-center min-w-[100px] gap-2 px-4 py-2 bg-status-error/20 hover:bg-status-error/30 border border-status-error/30 rounded-lg text-status-error text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                {deletingService ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <>
                                        <Trash2 size={16} />
                                        Delete
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Services;
