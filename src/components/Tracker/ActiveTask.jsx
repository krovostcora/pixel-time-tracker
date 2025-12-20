import React from 'react';
import { formatTime } from '../../utils/timeUtils';

const ActiveTask = ({
                        task,
                        currentTime,
                        onPause,
                        onStop,
                        onCancel,
                        theme,
                        bg,
                        textColor
                    }) => {
    return (
        <div className={`pixel-border p-4 ${bg.secondary} ${theme.border}`}>
            <h2 className={`pixel-text mb-4 ${theme.light}`}>ACTIVE TASK</h2>
            <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-4">
                    {task.labels.map((label) => (
                        <span
                            key={label}
                            className={`${theme.button} px-3 py-1 pixel-text text-xs text-white`}
                        >
              {label}
            </span>
                    ))}
                </div>
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <div className={`text-xs pixel-text ${textColor} mb-1`}>CURRENT</div>
                        <div className={`text-3xl pixel-text ${theme.light}`}>
                            {formatTime(currentTime)}
                        </div>
                    </div>
                    {task.totalPreviousTime > 0 && (
                        <div className="text-right">
                            <div className={`text-xs pixel-text ${textColor} mb-1`}>TOTAL</div>
                            <div className={`text-2xl pixel-text ${theme.light}`}>
                                {formatTime(task.totalPreviousTime + currentTime)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onPause}
                    className="pixel-button bg-yellow-700 hover:bg-yellow-600 text-white px-4 py-2 flex-1"
                >
                    PAUSE
                </button>
                <button
                    onClick={onStop}
                    className="pixel-button bg-green-700 hover:bg-green-600 text-white px-4 py-2 flex-1"
                >
                    STOP
                </button>
                <button
                    onClick={onCancel}
                    className="pixel-button bg-red-700 hover:bg-red-600 text-white px-4 py-2 flex-1"
                >
                    CANCEL
                </button>
            </div>
        </div>
    );
};

export default ActiveTask;