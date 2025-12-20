import React from 'react';
import { formatTime } from '../../utils/timeUtils';

const PausedTasks = ({
                         tasks,
                         onResume,
                         onCancel,
                         activeTaskExists,
                         theme,
                         bg,
                         textColor
                     }) => {
    if (tasks.length === 0) return null;

    return (
        <div className={`pixel-border p-4 ${bg.secondary} ${theme.border}`}>
            <h2 className={`pixel-text mb-4 ${theme.light}`}>PAUSED TASKS</h2>
            {tasks.map((task, index) => (
                <div
                    key={index}
                    className={`mb-3 p-3 ${bg.tertiary} pixel-border ${theme.border}`}
                >
                    <div className="flex flex-wrap gap-2 mb-2">
                        {task.labels.map((label) => (
                            <span
                                key={label}
                                className={`${theme.button} px-2 py-1 pixel-text text-xs text-white`}
                            >
                {label}
              </span>
                        ))}
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <div>
                            <div className={`text-xs pixel-text ${textColor} mb-1`}>CURRENT</div>
                            <div className={`pixel-text text-xl ${theme.light}`}>
                                {formatTime(task.elapsedSeconds, true)}
                            </div>
                        </div>
                        {task.totalPreviousTime > 0 && (
                            <div className="text-right">
                                <div className={`text-xs pixel-text ${textColor} mb-1`}>TOTAL</div>
                                <div className={`pixel-text text-lg ${theme.light}`}>
                                    {formatTime(task.totalPreviousTime + task.elapsedSeconds, true)}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onResume(index)}
                            disabled={activeTaskExists}
                            className={`pixel-button ${theme.button} ${theme.hover} text-white px-4 py-2 flex-1`}
                        >
                            RESUME
                        </button>
                        <button
                            onClick={() => onCancel(index)}
                            className="pixel-button bg-red-700 hover:bg-red-600 text-white px-4 py-2"
                        >
                            X
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PausedTasks;