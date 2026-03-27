import React from 'react';
import GoalProgress from './GoalProgress';

const GoalsView = ({ labels, logs, onUpdateGoals, theme, bg, textColor }) => {
    const labelsWithGoals = labels.filter(label => {
        return label.goals && Object.values(label.goals).some(g => g);
    });

    const handleDeleteGoal = (labelName, goalType) => {
        const label = labels.find(l => l.name === labelName);
        if (!label) return;

        const updatedGoals = {
            ...label.goals,
            [goalType]: null
        };

        onUpdateGoals(labelName, updatedGoals);
    };

    return (
        <div className="space-y-4">
            {labelsWithGoals.length === 0 ? (
                <div className={`pixel-border p-8 ${bg.secondary} ${theme.border} text-center`}>
                    <div className={`pixel-text text-xs ${textColor} opacity-50 mb-4`}>
                        NO GOALS SET YET
                    </div>
                    <div className={`text-xs ${textColor} opacity-30`}>
                        Select labels and click "SET GOAL" to create your first goal
                    </div>
                </div>
            ) : (
                labelsWithGoals.map(label => (
                    <GoalProgress
                        key={label.name}
                        label={label}
                        logs={logs}
                        onDeleteGoal={handleDeleteGoal}
                        theme={theme}
                        bg={bg}
                        textColor={textColor}
                    />
                ))
            )}
        </div>
    );
};

export default GoalsView;