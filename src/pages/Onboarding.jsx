import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Terminal, Check } from 'lucide-react';
import axios from 'axios';

const Onboarding = () => {
    const navigate = useNavigate();
    const [orgName, setOrgName] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [step, setStep] = useState(1); // 1: Create Org, 2: Key Display

    const handleCreateOrg = async (e) => {
        e.preventDefault();
        // Mock API generation for MVP
        // In real app: await axios.post('/api/orgs', { name: orgName })
        const mockKey = `so_live_${Math.random().toString(36).substr(2, 9)}_${Math.random().toString(36).substr(2, 9)}`;
        setApiKey(mockKey);
        setStep(2);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(apiKey);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleContinue = () => {
        localStorage.setItem('api_key', apiKey);
        navigate('/rewind');
    };

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-0 -left-20 w-96 h-96 bg-accent/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-md bg-gradient-card border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2 tracking-tight">Welcome to LastGood</h1>
                    <p className="text-text-secondary">Get started by creating your organization.</p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleCreateOrg} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">Organization Name</label>
                            <input
                                type="text"
                                value={orgName}
                                onChange={(e) => setOrgName(e.target.value)}
                                placeholder="Acme Corp"
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-accent hover:opacity-90 text-white font-bold py-3 rounded-lg transition-opacity shadow-lg shadow-accent/20"
                        >
                            Generate API Key
                        </button>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-black/20 border border-white/10 rounded-lg p-4">
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Your API Key</label>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 font-mono text-sm text-accent break-all">{apiKey}</code>
                                <button
                                    onClick={handleCopy}
                                    className="p-2 hover:bg-white/10 rounded-md text-text-secondary hover:text-white transition-colors"
                                    title="Copy to clipboard"
                                >
                                    {isCopied ? <Check size={18} className="text-status-success" /> : <Copy size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="bg-black/30 rounded-lg p-4 font-mono text-xs text-text-secondary overflow-x-auto border border-border">
                            <div className="flex items-center gap-2 text-text-muted mb-2 pb-2 border-b border-white/5">
                                <Terminal size={14} />
                                <span>Example Usage</span>
                            </div>
                            <pre className="whitespace-pre-wrap">
                                {`curl -X POST http://localhost:4000/api/change-events \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{"summary": "Deployed v1.0"}'`}
                            </pre>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleContinue}
                                className="w-full bg-gradient-accent hover:opacity-90 text-white font-bold py-3 rounded-lg transition-opacity shadow-lg shadow-accent/20"
                            >
                                Save & Continue
                            </button>
                            <p className="text-xs text-center text-text-muted">
                                This key will be stored in your browser's local storage.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Onboarding;
