import React from 'react';
import { Calendar, X } from 'lucide-react';
import dayjs from 'dayjs';

export const DateRangeFilter = ({ fromDate, toDate, onFromDateChange, onToDateChange, onClear }) => {
    const presets = [
        { label: 'Last 24h', value: '24h' },
        { label: 'Last 7d', value: '7d' },
        { label: 'Last 30d', value: '30d' },
    ];

    const handlePreset = (value) => {
        const now = dayjs().utc();
        const from = value === '24h' ? now.subtract(24, 'hours') 
                   : value === '7d' ? now.subtract(7, 'days')
                   : value === '30d' ? now.subtract(30, 'days')
                   : now;
        
        onFromDateChange(from.format('YYYY-MM-DD'));
        onToDateChange(now.format('YYYY-MM-DD'));
    };

    const hasFilter = fromDate || toDate;

    return (
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center flex-wrap">
            <div className="flex items-center gap-2">
                <Calendar size={16} className="text-accent" />
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">Date Range</span>
            </div>

            {/* Preset Buttons */}
            <div className="flex gap-1 flex-wrap">
                {presets.map((preset) => (
                    <button
                        key={preset.value}
                        onClick={() => handlePreset(preset.value)}
                        className="px-2 py-1 text-xs bg-white/5 hover:bg-accent/20 text-text-secondary hover:text-accent border border-white/10 hover:border-accent/30 rounded-md transition-all"
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            {/* Custom Date Inputs */}
            <div className="flex gap-2 flex-wrap items-center">
                <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => onFromDateChange(e.target.value)}
                    className="px-2 py-1 text-xs bg-black/60 border border-white/10 hover:border-accent/50 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all"
                    placeholder="From"
                />
                <span className="text-text-muted">→</span>
                <input
                    type="date"
                    value={toDate}
                    onChange={(e) => onToDateChange(e.target.value)}
                    className="px-2 py-1 text-xs bg-black/60 border border-white/10 hover:border-accent/50 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all"
                    placeholder="To"
                />
            </div>

            {/* Clear Button */}
            {hasFilter && (
                <button
                    onClick={onClear}
                    className="px-2 py-1 text-xs text-text-muted hover:text-white flex items-center gap-1 hover:bg-white/5 rounded-md transition-all"
                >
                    <X size={14} />
                    Clear
                </button>
            )}
        </div>
    );
};
