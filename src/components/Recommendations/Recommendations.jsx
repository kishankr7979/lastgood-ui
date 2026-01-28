import React from 'react';
import { CheckSquare } from 'lucide-react';

export const Recommendations = ({ recommendations }) => {
    if (!recommendations || recommendations.length === 0) return null;

    return (
        <div className="bg-gradient-card border border-white/5 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
            <ul className="space-y-3">
                {recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <CheckSquare className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-text-secondary">{rec}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
