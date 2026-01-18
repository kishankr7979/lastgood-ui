import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export const LoadingState = ({ message = "Retrieving data or doing magic..." }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500">
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full animate-pulse"></div>
                <div className="relative bg-bg-secondary border border-white/10 p-4 rounded-xl shadow-2xl">
                    <Sparkles className="text-accent animate-spin-slow" size={32} />
                </div>
                <div className="absolute -top-1 -right-1">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                    </span>
                </div>
            </div>
            <h3 className="text-xl font-medium text-text-primary mb-2">One moment...</h3>
            <p className="text-text-secondary flex items-center gap-2">
                <Loader2 className="animate-spin" size={14} />
                {message}
            </p>
        </div>
    );
};
