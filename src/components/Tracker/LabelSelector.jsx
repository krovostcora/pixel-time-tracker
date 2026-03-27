import React from 'react';
import GoalSetter from '../Goals/GoalSetter';

const LabelSelector = ({
                           labels,
                           selectedLabels,
                           onToggle,
                           onStart,
                           onUpdateGoals,
                           theme,
                           bg,
                           textColor
                       }) => {
    return (
        <div className={`pixel-border p-4 ${bg.secondary} ${theme.border}`}>
            <h2 className={`pixel-text mb-4 ${theme.light}`}>SELECT LABELS</h2>
            <div className="flex flex-wrap gap-2 mb-4">
                {labels.map((label) => (
                    <button
                        key={label.name}
                        onClick={() => onToggle(label.name)}
                        className={`pixel-button px-4 py-2 ${
                            selectedLabels.includes(label.name)
                                ? `${theme.selected} text-white`
                                : `${bg.tertiary} ${textColor}`
                        }`}
                    >
                        {label.name}
                    </button>
                ))}
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onStart}
                    disabled={selectedLabels.length === 0}
                    className="pixel-button bg-green-700 hover:bg-green-600 text-white px-6 py-3 flex-1"
                >
                    START
                </button>
                <GoalSetter
                    selectedLabels={selectedLabels}
                    labels={labels}
                    onUpdateGoals={onUpdateGoals}
                    theme={theme}
                    bg={bg}
                    textColor={textColor}
                />
            </div>
        </div>
    );
};

export default LabelSelector;