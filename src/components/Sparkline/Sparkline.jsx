import React from 'react';

export const Sparkline = ({ data, width = 100, height = 30, color = '#4A5568' }) => {
    if (!data || data.length < 2) {
        return null;
    }

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min === 0 ? 1 : max - min;

    const points = data
        .map((d, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((d - min) / range) * height;
            return `${x},${y}`;
        })
        .join(' ');

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto mt-2">
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="2"
                points={points}
            />
        </svg>
    );
};
