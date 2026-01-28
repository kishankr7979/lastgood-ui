import React, { useState } from 'react';
import { Rocket, KeyRound, X } from 'lucide-react';
import CreateAPIKey from '../CreateAPIKey/CreateAPIKey';

export const OnboardingModal = ({ onFinished }) => {
    const [isCreatingKey, setIsCreatingKey] = useState(false);

    const handleKeyCreated = () => {
        onFinished();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-gradient-card border border-white/10 rounded-xl shadow-2xl w-full max-w-md m-4 relative">
                {isCreatingKey ? (
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-center mb-2">Create your first API Key</h2>
                        <p className="text-text-secondary text-center mb-6">This key will be used to report events to LastGood.</p>
                        <CreateAPIKey onKeyCreated={handleKeyCreated} />
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <div className="mx-auto bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center border-2 border-accent/20 mb-4">
                            <Rocket size={32} className="text-accent" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Let's Get Your Data Flowing</h2>
                        <p className="text-text-secondary mb-8">LastGood works by analyzing change events from your CI/CD pipelines and infrastructure. To start seeing data, you first need to create a secure API key. This key allows your systems to talk to LastGood.</p>
                        <button 
                            onClick={() => setIsCreatingKey(true)} 
                            className="bg-gradient-accent hover:opacity-90 text-white font-bold px-8 py-3 rounded-lg flex items-center gap-2 transition-opacity w-full justify-center text-lg"
                        >
                            <KeyRound size={18} />
                            Create Secure API Key
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
