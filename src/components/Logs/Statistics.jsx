import React from 'react';
import { formatTime } from '../../utils/timeUtils';

const Statistics = ({ logs, filterLabel, theme, bg, textColor }) => {
    const getStatsByLabel = () => {
        const filtered = filterLabel === 'all'
            ? logs
            : logs.filter(log => log.labels.includes(filterLabel));

        const stats = {};

        filtered.forEach(log => {
            log.labels.forEach(label => {
                if (!stats[label]) {
                    stats[label] = 0;
                }
                stats[label] += log.duration;
            });
        });

        return Object.entries(stats)
            .sort((a, b) => b[1] - a[1])
            .map(([label, duration]) => ({ label, duration }));
    };

    return (
        <div className={`pixel-border p-4 ${bg.secondary} ${theme.border}`}>
            <h2 className={`pixel-text mb-4 ${theme.light}`}>STATISTICS</h2>
            {getStatsByLabel().map(({ label, duration }) => (
                <div
                    key={label}
                    className={`flex justify-between items-center mb-2 p-2 ${bg.tertiary}`}
                >
                    <span className={`pixel-text text-xs ${textColor}`}>{label}</span>
                    <span className={`pixel-text text-xs ${theme.light}`}>
            {formatTime(duration)}
          </span>
                </div>
            ))}
        </div>
    );
};

export default Statistics;