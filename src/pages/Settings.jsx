import React, { useState, useEffect } from 'react';
import { Key, RefreshCw, Shield, Trash2 } from 'lucide-react';
import useOrgStore from '../stores/useOrgStore';
import { LoadingState } from '../components/LoadingState/LoadingState';

const Settings = () => {
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);

    // Use global store
    const { org, isLoading, error, fetchOrg } = useOrgStore();

    useEffect(() => {
        setApiKey(localStorage.getItem('api_key') || '');
        // Fetch org data on mount
        fetchOrg();
    }, [fetchOrg]);

    const handleRotateKey = () => {
        if (confirm('Are you sure? This will invalidate the current key.')) {
            const newKey = `so_live_rotated_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('api_key', newKey);
            setApiKey(newKey);
            alert('New key generated.');
        }
    };

    const handleRevokeKey = () => {
        if (confirm('Are you sure? This will stop all data collection.')) {
            localStorage.removeItem('api_key');
            setApiKey('');
            alert('Key revoked.');
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Organization Settings</h1>
            <p className="text-text-secondary mb-8">Manage your organization and API keys.</p>

            <div className="bg-gradient-card border border-white/10 rounded-xl overflow-hidden mb-8 shadow-lg">
                <div className="p-6 border-b border-white/10 bg-black/20">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        <Shield size={20} className="text-accent" />
                        API Configuration
                    </h2>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Active API Key</label>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 bg-bg-primary border border-border rounded-lg px-4 py-3 font-mono text-sm text-text-secondary">
                                {apiKey ? (showKey ? apiKey : '••••••••••••••••••••••••••••••••') : 'No active key'}
                            </div>
                            <button
                                onClick={() => setShowKey(!showKey)}
                                className="text-sm text-accent hover:text-accent-hover font-medium"
                            >
                                {showKey ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
                        <button
                            onClick={handleRotateKey}
                            className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary hover:bg-bg-primary border border-border rounded-lg text-text-primary text-sm font-medium transition-colors"
                        >
                            <RefreshCw size={16} /> Rotate Key
                        </button>
                        <button
                            onClick={handleRevokeKey}
                            className="flex items-center gap-2 px-4 py-2 bg-status-error/10 hover:bg-status-error/20 border border-status-error/20 rounded-lg text-status-error text-sm font-medium transition-colors"
                        >
                            <Trash2 size={16} /> Revoke Key
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-bg-secondary border border-border rounded-xl p-6 relative overflow-hidden">
                <h3 className="font-semibold text-text-primary mb-4">Organization Details</h3>

                {isLoading && <LoadingState message="Fetching org details..." />}

                {error && <div className="text-status-error">Failed to load organization details.</div>}

                {org && (
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Organization Name</label>
                            <div className="text-text-secondary text-lg font-medium">{org.name}</div>
                        </div>
                        <div>
                            <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Plan</label>
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                                {org.plan.toUpperCase()}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Organization ID</label>
                            <div className="text-text-secondary font-mono text-sm">{org.id}</div>
                        </div>
                        <div>
                            <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Slug</label>
                            <div className="text-text-secondary font-mono text-sm">{org.slug}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
