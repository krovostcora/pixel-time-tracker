import React, { useState } from 'react';
import { formatTime } from '../../utils/timeUtils';

const LogEntry = ({
                      task,
                      labels,
                      onDelete,
                      onUpdateLabels,
                      theme,
                      bg,
                      textColor
                  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editLabels, setEditLabels] = useState(task.labels);

    const toggleEditLabel = (labelName) => {
        if (editLabels.includes(labelName)) {
            setEditLabels(editLabels.filter(l => l !== labelName));
        } else {
            setEditLabels([...editLabels, labelName]);
        }
    };

    const saveEdit = () => {
        onUpdateLabels(task.id, editLabels);
        setIsEditing(false);
    };

    return (
        <div className={`mb-2 p-2 md:p-3 ${bg.tertiary} border-2 ${theme.border}`}>
            {isEditing ? (
                <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {labels.map((label) => (
                            <button
                                key={label.name}
                                onClick={() => toggleEditLabel(label.name)}
                                className={`pixel-button px-2 md:px-3 py-1 text-xs ${
                                    editLabels.includes(label.name)
                                        ? `${theme.selected} text-white`
                                        : `${bg.main} ${textColor}`
                                }`}
                            >
                                {label.name}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={saveEdit}
                            className="pixel-button bg-green-700 hover:bg-green-600 text-white px-3 py-1 text-xs flex-1"
                        >
                            SAVE
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="pixel-button bg-red-700 hover:bg-red-600 text-white px-3 py-1 text-xs flex-1"
                        >
                            CANCEL
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div className="flex flex-wrap gap-2">
                        {task.labels.map((label) => (
                            <span
                                key={label}
                                className={`${theme.button} px-2 py-1 pixel-text text-xs text-white break-all`}
                            >
                {label}
              </span>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`pixel-text text-xs ${theme.light}`}>
              {formatTime(task.duration, true)}
            </span>
                        <button
                            onClick={() => setIsEditing(true)}
                            className={`pixel-button ${theme.button} text-white px-2 py-1 text-xs`}
                        >
                            EDIT
                        </button>
                        <button
                            onClick={() => onDelete(task.id)}
                            className="pixel-button bg-red-700 hover:bg-red-600 text-white px-2 py-1 text-xs"
                        >
                            DEL
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LogEntry;