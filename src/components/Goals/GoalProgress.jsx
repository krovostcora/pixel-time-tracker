import React from 'react';
import { formatTime } from '../../utils/timeUtils';

const GoalProgress = ({ label, logs, onDeleteGoal, theme, bg, textColor }) => {
    if (!label.goals) return null;

    const calculateProgress = (goalType) => {
        const goal = label.goals[goalType];
        if (!goal) return null;

        const targetSeconds = goal.hours * 3600;
        let actualSeconds = 0;

        const now = new Date();
        const today = now.toISOString().split('T')[0];

        logs.forEach(log => {
            if (!log.labels.includes(label.name)) return;

            if (goalType === 'total') {
                actualSeconds += log.totalDuration || log.duration || 0;
            } else if (goalType === 'daily') {
                if (log.sessions) {
                    log.sessions.forEach(session => {
                        if (session.date === today) {
                            actualSeconds += session.duration;
                        }
                    });
                } else {
                    const logDate = log.endTime.toDate().toISOString().split('T')[0];
                    if (logDate === today) {
                        actualSeconds += log.duration || 0;
                    }
                }
            } else if (goalType === 'weekly') {
                const startOfWeek = new Date(now);
                const day = startOfWeek.getDay();
                const diff = day === 0 ? -6 : 1 - day;
                startOfWeek.setDate(now.getDate() + diff);
                startOfWeek.setHours(0, 0, 0, 0);

                if (log.sessions) {
                    log.sessions.forEach(session => {
                        const sessionDate = new Date(session.date);
                        if (sessionDate >= startOfWeek) {
                            actualSeconds += session.duration;
                        }
                    });
                } else {
                    const logDate = log.endTime.toDate();
                    if (logDate >= startOfWeek) {
                        actualSeconds += log.duration || 0;
                    }
                }
            } else if (goalType === 'monthly') {
                const year = now.getFullYear();
                const month = now.getMonth();

                if (log.sessions) {
                    log.sessions.forEach(session => {
                        const sessionDate = new Date(session.date);
                        if (sessionDate.getFullYear() === year && sessionDate.getMonth() === month) {
                            actualSeconds += session.duration;
                        }
                    });
                } else {
                    const logDate = log.endTime.toDate();
                    if (logDate.getFullYear() === year && logDate.getMonth() === month) {
                        actualSeconds += log.duration || 0;
                    }
                }
            }
        });

        const percentage = Math.min(Math.round((actualSeconds / targetSeconds) * 100), 100);

        return {
            actual: actualSeconds,
            target: targetSeconds,
            percentage,
            dueDate: goal.dueDate
        };
    };

    const handleDeleteGoal = (goalType) => {
        if (window.confirm(`Delete ${goalType} goal for "${label.name}"?`)) {
            onDeleteGoal(label.name, goalType);
        }
    };

    const activeGoals = ['daily', 'weekly', 'monthly', 'total']
        .map(type => ({ type, ...calculateProgress(type) }))
        .filter(g => g.target);

    if (activeGoals.length === 0) return null;

    return (
        <div className={`pixel-border p-3 ${bg.secondary} ${theme.border}`}>
            <div className={`pixel-text text-xs mb-3 ${theme.light} flex justify-between items-center`}>
                <span>{label.name.toUpperCase()} GOALS</span>
            </div>
            {activeGoals.map(({ type, actual, target, percentage, dueDate }) => (
                <div key={type} className="mb-3">
                    <div className="flex justify-between items-center mb-1">
            <span className={`pixel-text text-xs ${textColor}`}>
              {type.toUpperCase()}
            </span>
                        <div className="flex items-center gap-2">
              <span className={`pixel-text text-xs ${theme.light}`}>
                {formatTime(actual)} / {formatTime(target)}
              </span>
                            {onDeleteGoal && (
                                <button
                                    onClick={() => handleDeleteGoal(type)}
                                    className="text-red-400 hover:text-red-300 pixel-text text-xs opacity-60 hover:opacity-100 transition-opacity"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
                    <div className={`h-2 ${bg.tertiary} relative overflow-hidden`}>
                        <div
                            className={`h-full ${theme.button} transition-all duration-300`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <div className="flex justify-between items-center mt-1">
            <span className={`text-xs ${textColor} opacity-60`}>
              {percentage}%
            </span>
                        {dueDate && (
                            <span className={`text-xs ${textColor} opacity-60`}>
                due: {new Date(dueDate).toLocaleDateString('uk-UA', {
                                day: 'numeric',
                                month: 'short'
                            })}
              </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GoalProgress;