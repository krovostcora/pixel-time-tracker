import React, { useState } from 'react';
import Statistics from './Statistics';
import LogEntry from './LogEntry';
import { formatTime } from '../../utils/timeUtils';

const LogsView = ({
                      logs,
                      labels,
                      onDeleteLog,
                      onUpdateLogLabels,
                      onUpdateLogDuration,
                      onRenameLabel,
                      onDeleteAllLogsWithLabel,
                      onUpdateGoals,
                      theme,
                      bg,
                      textColor
                  }) => {
    const [filterLabel, setFilterLabel] = useState('all');
    const [groupBy, setGroupBy] = useState('day');

    const getFilteredLogs = () => {
        if (filterLabel === 'all') return logs;
        return logs.filter(log => log.labels.includes(filterLabel));
    };

    const getGroupedLogs = () => {
        const filtered = getFilteredLogs();
        const grouped = {};

        filtered.forEach(log => {
            // Якщо є сесії, групуємо по датах сесій
            if (log.sessions && log.sessions.length > 0) {
                log.sessions.forEach(session => {
                    const date = new Date(session.date);
                    let key;

                    if (groupBy === 'day') {
                        const year = date.getFullYear();
                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        const day = date.getDate().toString().padStart(2, '0');
                        key = `${year}-${month}-${day}`;
                    } else if (groupBy === 'week') {
                        const weekStart = new Date(date);
                        const dayOfWeek = weekStart.getDay();
                        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                        weekStart.setDate(date.getDate() + diff);
                        weekStart.setHours(0, 0, 0, 0);

                        const year = weekStart.getFullYear();
                        const month = (weekStart.getMonth() + 1).toString().padStart(2, '0');
                        const day = weekStart.getDate().toString().padStart(2, '0');
                        key = `${year}-${month}-${day}`;
                    } else {
                        const year = date.getFullYear();
                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        key = `${year}-${month}`;
                    }

                    if (!grouped[key]) {
                        grouped[key] = [];
                    }

                    const existingLog = grouped[key].find(l => l.id === log.id);
                    if (!existingLog) {
                        grouped[key].push(log);
                    }
                });
            } else {
                const date = log.endTime.toDate();
                let key;

                if (groupBy === 'day') {
                    const year = date.getFullYear();
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const day = date.getDate().toString().padStart(2, '0');
                    key = `${year}-${month}-${day}`;
                } else if (groupBy === 'week') {
                    const weekStart = new Date(date);
                    const dayOfWeek = weekStart.getDay();
                    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                    weekStart.setDate(date.getDate() + diff);
                    weekStart.setHours(0, 0, 0, 0);

                    const year = weekStart.getFullYear();
                    const month = (weekStart.getMonth() + 1).toString().padStart(2, '0');
                    const day = weekStart.getDate().toString().padStart(2, '0');
                    key = `${year}-${month}-${day}`;
                } else {
                    const year = date.getFullYear();
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    key = `${year}-${month}`;
                }

                if (!grouped[key]) {
                    grouped[key] = [];
                }
                grouped[key].push(log);
            }
        });

        const sortedEntries = Object.entries(grouped).sort((a, b) => {
            return b[0].localeCompare(a[0]);
        });

        return Object.fromEntries(sortedEntries);
    };

    const formatGroupTitle = (dateKey) => {
        const [year, month, day] = dateKey.split('-');

        if (groupBy === 'day') {
            const date = new Date(year, month - 1, day);
            return date.toLocaleDateString('en-GB', {
                weekday: 'short',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } else if (groupBy === 'week') {
            const weekStart = new Date(year, month - 1, day);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);

            return `Тиждень: ${weekStart.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short'
            })} - ${weekEnd.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            })}`;
        } else {
            const date = new Date(year, month - 1, 1);
            return date.toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long'
            });
        }
    };

    return (
        <div className="space-y-6">
            <Statistics
                logs={logs}
                filterLabel={filterLabel}
                onRenameLabel={onRenameLabel}
                onDeleteAllLogsWithLabel={onDeleteAllLogsWithLabel}
                onUpdateGoals={onUpdateGoals}
                labels={labels}
                theme={theme}
                bg={bg}
                textColor={textColor}
            />

            <div className={`pixel-border p-4 ${bg.secondary} ${theme.border}`}>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <select
                        value={filterLabel}
                        onChange={(e) => setFilterLabel(e.target.value)}
                        className={`flex-1 ${bg.tertiary} border-2 ${theme.border} px-3 py-2 pixel-text text-xs ${textColor}`}
                    >
                        <option value="all">ALL LABELS</option>
                        {labels.map((label) => (
                            <option key={label.name} value={label.name}>
                                {label.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={groupBy}
                        onChange={(e) => setGroupBy(e.target.value)}
                        className={`${bg.tertiary} border-2 ${theme.border} px-3 py-2 pixel-text text-xs ${textColor} sm:w-auto w-full`}
                    >
                        <option value="day">DAY</option>
                        <option value="week">WEEK</option>
                        <option value="month">MONTH</option>
                    </select>
                </div>

                {Object.keys(getGroupedLogs()).length === 0 ? (
                    <div className={`text-center py-8 pixel-text text-xs ${textColor}`}>
                        NO LOGS YET
                    </div>
                ) : (
                    Object.entries(getGroupedLogs()).map(([dateKey, tasks]) => {
                        const totalDuration = tasks.reduce((sum, task) => {
                            return sum + (task.totalDuration || task.duration || 0);
                        }, 0);
                        return (
                            <div key={dateKey} className="mb-4">
                                <div className={`flex justify-between items-center mb-2 p-2 ${bg.tertiary} pixel-border ${theme.border}`}>
                  <span className={`pixel-text text-xs ${theme.light}`}>
                    {formatGroupTitle(dateKey)}
                  </span>
                                    <span className={`pixel-text text-xs ${theme.light}`}>
                    {formatTime(totalDuration)}
                  </span>
                                </div>
                                {tasks.map((task) => (
                                    <LogEntry
                                        key={task.id}
                                        task={task}
                                        labels={labels}
                                        onDelete={onDeleteLog}
                                        onUpdateLabels={onUpdateLogLabels}
                                        onUpdateDuration={onUpdateLogDuration}
                                        theme={theme}
                                        bg={bg}
                                        textColor={textColor}
                                    />
                                ))}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default LogsView;