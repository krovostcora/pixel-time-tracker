import React, { useState } from 'react';

const GoalSetter = ({ selectedLabels, labels, onUpdateGoals, theme, bg, textColor }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState('');
    const [goalType, setGoalType] = useState('');
    const [hours, setHours] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleOpen = () => {
        if (selectedLabels.length === 0) return;
        setSelectedLabel(selectedLabels[0]);
        setShowModal(true);
    };

    const handleSave = () => {
        if (!selectedLabel || !goalType || !hours) return;

        const label = labels.find(l => l.name === selectedLabel);
        if (!label) return;

        const updatedGoals = {
            ...label.goals,
            [goalType]: {
                hours: parseFloat(hours),
                dueDate: dueDate || null
            }
        };

        onUpdateGoals(selectedLabel, updatedGoals);
        handleClose();
    };

    const handleClose = () => {
        setShowModal(false);
        setGoalType('');
        setHours('');
        setDueDate('');
    };

    const getLabelGoals = (labelName) => {
        const label = labels.find(l => l.name === labelName);
        return label?.goals || {};
    };

    const currentGoals = selectedLabel ? getLabelGoals(selectedLabel) : {};

    return (
        <>
            <button
                onClick={handleOpen}
                disabled={selectedLabels.length === 0}
                className={`pixel-button ${theme.button} ${theme.hover} text-white px-4 py-2 text-xs`}
            >
                SET GOAL
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <div className={`${bg.main} pixel-border p-4 max-w-md w-full max-h-[90vh] overflow-y-auto`}>
                        <h3 className={`pixel-text text-xs mb-4 ${theme.light}`}>SET GOAL</h3>

                        {/* Label selection */}
                        <div className="mb-3">
                            <label className={`pixel-text text-xs ${textColor} mb-2 block`}>LABEL</label>
                            <select
                                value={selectedLabel}
                                onChange={(e) => setSelectedLabel(e.target.value)}
                                className={`w-full ${bg.tertiary} border-2 ${theme.border} px-2 py-2 pixel-text text-xs ${textColor}`}
                            >
                                {selectedLabels.map(label => (
                                    <option key={label} value={label}>{label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Goal type */}
                        <div className="mb-3">
                            <label className={`pixel-text text-xs ${textColor} mb-2 block`}>TYPE</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['daily', 'weekly', 'monthly', 'total'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setGoalType(type)}
                                        className={`pixel-button px-3 py-2 text-xs ${
                                            goalType === type
                                                ? `${theme.selected} text-white`
                                                : `${bg.tertiary} ${textColor}`
                                        }`}
                                    >
                                        {type.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Hours */}
                        <div className="mb-3">
                            <label className={`pixel-text text-xs ${textColor} mb-2 block`}>HOURS</label>
                            <input
                                type="number"
                                step="0.5"
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                                placeholder="e.g. 2.5"
                                className={`w-full ${bg.tertiary} border-2 ${theme.border} px-2 py-2 pixel-text text-xs ${textColor}`}
                            />
                        </div>

                        {/* Due date (optional) */}
                        <div className="mb-4">
                            <label className={`pixel-text text-xs ${textColor} mb-2 block`}>DUE DATE (optional)</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className={`w-full ${bg.tertiary} border-2 ${theme.border} px-2 py-2 pixel-text text-xs ${textColor}`}
                            />
                        </div>

                        {/* Current goals display */}
                        {selectedLabel && (
                            <div className={`mb-4 p-3 ${bg.tertiary} border-2 ${theme.border}`}>
                                <div className={`pixel-text text-xs ${theme.light} mb-2`}>CURRENT GOALS:</div>
                                {['daily', 'weekly', 'monthly', 'total'].map(type => {
                                    const goal = currentGoals[type];
                                    if (!goal) return null;
                                    return (
                                        <div key={type} className={`text-xs ${textColor} mb-1 flex justify-between`}>
                                            <span className="pixel-text">{type.toUpperCase()}:</span>
                                            <span className="pixel-text">
                        {goal.hours}h
                                                {goal.dueDate && ` (due: ${new Date(goal.dueDate).toLocaleDateString('uk-UA')})`}
                      </span>
                                        </div>
                                    );
                                })}
                                {!Object.values(currentGoals).some(g => g) && (
                                    <div className={`text-xs ${textColor} opacity-50 pixel-text`}>No goals set</div>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                disabled={!goalType || !hours}
                                className="pixel-button bg-green-700 hover:bg-green-600 text-white px-4 py-2 text-xs flex-1"
                            >
                                SAVE
                            </button>
                            <button
                                onClick={handleClose}
                                className={`pixel-button ${bg.tertiary} ${textColor} px-4 py-2 text-xs flex-1`}
                            >
                                CANCEL
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GoalSetter;