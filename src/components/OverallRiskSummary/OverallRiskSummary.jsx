import React from 'react';

const getRiskStyles = (level) => {
    switch (level) {
        case 'critical':
            return { color: 'text-red-500', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20' };
        case 'high':
            return { color: 'text-orange-500', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/20' };
        case 'medium':
            return { color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/20' };
        case 'low':
            return { color: 'text-green-500', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/20' };
        default:
            return { color: 'text-text-muted', bgColor: 'bg-gray-500/10', borderColor: 'border-gray-500/20' };
    }
};

export const OverallRiskSummary = ({ assessment }) => {
    if (!assessment) return null;

    const { score, level, explanation } = assessment;
    const styles = getRiskStyles(level);

    return (
        <div className={`p-6 rounded-xl border ${styles.borderColor} ${styles.bgColor}`}>
            <div className="text-sm text-text-muted mb-2">Overall Incident Risk</div>
            <div className="flex items-center gap-4">
                <div className={`text-6xl font-bold ${styles.color}`}>{score}</div>
                <div className="flex-1">
                    <div className={`text-xl font-semibold capitalize ${styles.color}`}>{level}</div>
                    <p className="text-sm text-text-secondary mt-1">{explanation}</p>
                </div>
            </div>
        </div>
    );
};
