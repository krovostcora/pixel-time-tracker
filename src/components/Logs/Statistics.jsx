import React, { useState, useEffect, useRef } from 'react';
import { formatTime } from '../../utils/timeUtils';

const Statistics = ({ logs, filterLabel, onRenameLabel, onDeleteAllLogsWithLabel, theme, bg, textColor }) => {
    const [viewMode, setViewMode] = useState('all');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [expandedLabel, setExpandedLabel] = useState(null);
    const [newLabelName, setNewLabelName] = useState('');
    const [isRenaming, setIsRenaming] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setExpandedLabel(null);
                setIsRenaming(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getStatsByLabel = () => {
        let filtered = filterLabel === 'all' ? logs : logs.filter(log => log.labels.includes(filterLabel));

        if (viewMode === 'week') {
            const startOfWeek = new Date(selectedDate);
            const day = startOfWeek.getDay();
            const diff = day === 0 ? -6 : 1 - day;
            startOfWeek.setDate(selectedDate.getDate() + diff);
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            filtered = filtered.filter(log => {
                if (log.sessions) {
                    return log.sessions.some(session => {
                        const sessionDate = new Date(session.date);
                        return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
                    });
                }
                const logDate = log.endTime.toDate();
                return logDate >= startOfWeek && logDate <= endOfWeek;
            });
        } else if (viewMode === 'month') {
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth();

            filtered = filtered.filter(log => {
                if (log.sessions) {
                    return log.sessions.some(session => {
                        const sessionDate = new Date(session.date);
                        return sessionDate.getFullYear() === year && sessionDate.getMonth() === month;
                    });
                }
                const logDate = log.endTime.toDate();
                return logDate.getFullYear() === year && logDate.getMonth() === month;
            });
        }

        const stats = {};

        filtered.forEach(log => {
            log.labels.forEach(label => {
                if (!stats[label]) stats[label] = 0;

                if (viewMode !== 'all' && log.sessions) {
                    log.sessions.forEach(session => {
                        const sessionDate = new Date(session.date);
                        let inRange = false;

                        if (viewMode === 'week') {
                            const startOfWeek = new Date(selectedDate);
                            const day = startOfWeek.getDay();
                            const diff = day === 0 ? -6 : 1 - day;
                            startOfWeek.setDate(selectedDate.getDate() + diff);
                            startOfWeek.setHours(0, 0, 0, 0);
                            const endOfWeek = new Date(startOfWeek);
                            endOfWeek.setDate(startOfWeek.getDate() + 6);
                            inRange = sessionDate >= startOfWeek && sessionDate <= endOfWeek;
                        } else if (viewMode === 'month') {
                            inRange = sessionDate.getFullYear() === selectedDate.getFullYear() &&
                                sessionDate.getMonth() === selectedDate.getMonth();
                        }

                        if (inRange) stats[label] += session.duration;
                    });
                } else {
                    stats[label] += log.totalDuration || log.duration || 0;
                }
            });
        });

        return Object.entries(stats)
            .sort((a, b) => b[1] - a[1])
            .map(([label, duration]) => ({ label, duration }));
    };

    const changeDate = (direction) => {
        const newDate = new Date(selectedDate);
        if (viewMode === 'week') newDate.setDate(selectedDate.getDate() + direction * 7);
        else if (viewMode === 'month') newDate.setMonth(selectedDate.getMonth() + direction);
        setSelectedDate(newDate);
    };

    const getDateRangeText = () => {
        if (viewMode === 'all') return 'ALL TIME';

        if (viewMode === 'week') {
            const startOfWeek = new Date(selectedDate);
            const day = startOfWeek.getDay();
            const diff = day === 0 ? -6 : 1 - day;
            startOfWeek.setDate(selectedDate.getDate() + diff);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            return `${startOfWeek.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })} – ${endOfWeek.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })}`;
        }

        return selectedDate.toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' });
    };

    const handleLabelClick = (label) => {
        if (expandedLabel === label) {
            setExpandedLabel(null);
            setIsRenaming(false);
        } else {
            setExpandedLabel(label);
            setNewLabelName(label);
            setIsRenaming(false);
        }
    };

    const handleRename = async () => {
        if (newLabelName.trim() && newLabelName !== expandedLabel) {
            await onRenameLabel(expandedLabel, newLabelName.trim());
        }
        setExpandedLabel(null);
        setIsRenaming(false);
    };

    const handleDeleteAll = async () => {
        if (window.confirm(`Delete all logs with label: "${expandedLabel}"?`)) {
            await onDeleteAllLogsWithLabel(expandedLabel);
        }
        setExpandedLabel(null);
    };

    const statsList = getStatsByLabel();
    const maxDuration = statsList.length > 0 ? statsList[0].duration : 1;

    return (
        <div ref={containerRef} className={`pixel-border p-4 ${bg.secondary} ${theme.border}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <h2 className={`pixel-text text-xs md:text-base ${theme.light}`}>STATISTICS</h2>
                <div className="flex gap-2 flex-wrap">
                    {['all', 'week', 'month'].map(mode => (
                        <button
                            key={mode}
                            onClick={() => { setViewMode(mode); setSelectedDate(new Date()); setExpandedLabel(null); }}
                            className={`pixel-button px-3 py-1 text-xs tracking-widest transition-all ${
                                viewMode === mode
                                    ? `${theme.selected} text-white`
                                    : `${bg.tertiary} ${textColor} opacity-70 hover:opacity-100`
                            }`}
                        >
                            {mode.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Date navigation */}
            {viewMode !== 'all' && (
                <div className="flex justify-between items-center mb-4 gap-2">
                    <button
                        onClick={() => changeDate(-1)}
                        className={`pixel-button ${theme.button} text-white px-3 py-1 text-xs`}
                    >
                        ←
                    </button>
                    <span className={`pixel-text text-xs ${textColor} text-center flex-1`}>
                        {getDateRangeText()}
                    </span>
                    <button
                        onClick={() => changeDate(1)}
                        className={`pixel-button ${theme.button} text-white px-3 py-1 text-xs`}
                    >
                        →
                    </button>
                </div>
            )}

            {/* Stats list */}
            {statsList.length === 0 ? (
                <div className={`text-center py-6 pixel-text text-xs ${textColor} opacity-50`}>
                    NO DATA
                </div>
            ) : (
                <div className="flex flex-col gap-1">
                    {statsList.map(({ label, duration }) => {
                        const isExpanded = expandedLabel === label;
                        const barWidth = Math.round((duration / maxDuration) * 100);

                        return (
                            <div key={label}>
                                {/* Label row */}
                                <div
                                    onClick={() => viewMode === 'all' && handleLabelClick(label)}
                                    className={`relative flex justify-between items-center p-2 transition-all ${
                                        viewMode === 'all' ? 'cursor-pointer' : ''
                                    } ${isExpanded ? `${theme.selected} bg-opacity-20` : `${bg.tertiary} hover:opacity-90`}`}
                                    style={{ overflow: 'hidden' }}
                                >
                                    {/* Background bar */}
                                    <div
                                        className="absolute left-0 top-0 h-full opacity-10"
                                        style={{
                                            width: `${barWidth}%`,
                                            backgroundColor: 'currentColor',
                                        }}
                                    />
                                    <div className="relative flex items-center gap-2 flex-1 min-w-0">
                                        {viewMode === 'all' && (
                                            <span className={`pixel-text text-xs ${isExpanded ? theme.light : textColor} opacity-50 select-none`}>
                                                {isExpanded ? '▾' : '▸'}
                                            </span>
                                        )}
                                        <span className={`pixel-text text-xs ${isExpanded ? theme.light : textColor} truncate`}>
                                            {label}
                                        </span>
                                    </div>
                                    <span className={`relative pixel-text text-xs ${theme.light} ml-2 shrink-0`}>
                                        {formatTime(duration)}
                                    </span>
                                </div>

                                {/* Expanded actions */}
                                {isExpanded && (
                                    <div className={`${bg.main} px-3 py-2 flex flex-col gap-2`}>
                                        {isRenaming ? (
                                            <div className="flex gap-2 items-center">
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={newLabelName}
                                                    onChange={e => setNewLabelName(e.target.value)}
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter') handleRename();
                                                        if (e.key === 'Escape') { setIsRenaming(false); setNewLabelName(label); }
                                                    }}
                                                    className={`flex-1 ${bg.tertiary} border-2 ${theme.border} px-2 py-1 pixel-text text-xs ${textColor} outline-none`}
                                                />
                                                <button
                                                    onClick={handleRename}
                                                    className="pixel-button bg-green-700 hover:bg-green-600 text-white px-3 py-1 text-xs"
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    onClick={() => { setIsRenaming(false); setNewLabelName(label); }}
                                                    className={`pixel-button ${bg.tertiary} ${textColor} px-2 py-1 text-xs opacity-60 hover:opacity-100`}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2 items-center py-1">
                                                <button
                                                    onClick={() => setIsRenaming(true)}
                                                    className={`pixel-text text-xs ${theme.light} opacity-60 hover:opacity-100 transition-opacity px-1 py-0.5`}
                                                >
                                                    ✎ rename
                                                </button>
                                                <span className={`${textColor} opacity-20 text-xs select-none`}>|</span>
                                                <button
                                                    onClick={handleDeleteAll}
                                                    className="pixel-text text-xs text-red-400 opacity-60 hover:opacity-100 transition-opacity px-1 py-0.5"
                                                >
                                                    ✕ delete all
                                                </button>
                                                <span className={`${textColor} opacity-20 text-xs select-none flex-1`}>|</span>
                                                <button
                                                    onClick={() => { setExpandedLabel(null); setIsRenaming(false); }}
                                                    className={`pixel-text text-xs ${textColor} opacity-30 hover:opacity-70 transition-opacity px-1 py-0.5`}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Statistics;