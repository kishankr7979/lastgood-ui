import React from 'react';
import { Zap } from 'lucide-react';

/**
 * Maps a confidence value (0–100) to the appropriate Tailwind color palette.
 * Kept as a pure helper for coloring the confidence label.
 */
export function getConfidenceColor(value) {
    if (value >= 80) return { text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' };
    if (value >= 50) return { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
    return { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
}

const STATUS_STYLES = {
    CORRELATED: 'bg-green-500/20 border-green-500/40 text-green-400',
    UNCORRELATED: 'bg-gray-500/20 border-gray-500/40 text-gray-400',
};

/**
 * Correlations panel.
 *
 * Props:
 *   correlations       — array of { description, confidence, riskIncrease } from the API
 *   correlationStatus  — 'CORRELATED' | 'UNCORRELATED' (computed by the backend)
 *   highestConfidence  — number | null (computed by the backend)
 */
export const Correlations = ({ correlations, correlationStatus, highestConfidence }) => {
    const status = correlationStatus ?? (correlations?.length > 0 ? 'CORRELATED' : 'UNCORRELATED');
    const confColor = highestConfidence != null ? getConfidenceColor(highestConfidence) : null;

    return (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
            {/* Confidence label — first child, only when a valid confidence value exists */}
            {highestConfidence != null && (
                <div className={`font-mono text-xs uppercase mb-3 ${confColor.text}`}>
                    CONFIDENCE: {highestConfidence}%
                </div>
            )}

            {/* Header row */}
            <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <h3 className="text-lg font-semibold text-yellow-400">Correlations</h3>
                <span className={`ml-auto text-xs font-semibold uppercase px-2 py-0.5 rounded border ${STATUS_STYLES[status]}`}>
                    {status}
                </span>
            </div>

            {/* Correlation list — only when CORRELATED */}
            {status === 'CORRELATED' && correlations?.length > 0 && (
                <ul className="space-y-1 text-yellow-300/80 text-sm">
                    {correlations.map((corr, i) => (
                        <li key={i}>- {corr.description}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};
