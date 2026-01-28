import React from 'react';
import { Zap } from 'lucide-react';

export const Correlations = ({ correlations }) => {
    if (!correlations || correlations.length === 0) return null;

    return (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
            <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                    <h3 className="text-lg font-semibold text-yellow-400">Risk Amplifiers Detected</h3>
                    <ul className="mt-2 space-y-1 text-yellow-300/80">
                        {correlations.map((corr, index) => (
                            <li key={index}>- {corr.description}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
