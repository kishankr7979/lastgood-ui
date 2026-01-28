import React from 'react';

export const RiskFactorDetails = ({ factors }) => {
    return (
        <div className="mt-4 pt-4 border-t border-white/10">
            <h4 className="text-sm font-semibold text-text-muted mb-3">Why is this risky?</h4>
            <div className="space-y-3">
                {factors.map((factor, index) => (
                    <div key={index}>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-text-primary">{factor.name}</span>
                            <span className="text-sm font-mono text-text-muted">{factor.score}/100</span>
                        </div>
                        <p className="text-xs text-text-secondary mt-1">{factor.description}</p>
                        {factor.evidence && factor.evidence.length > 0 && (
                            <p className="text-xs text-accent mt-1">Evidence: {factor.evidence.join(', ')}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
