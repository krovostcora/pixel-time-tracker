import { useState, useEffect, useCallback } from 'react';

export const useLabels = (user) => {
    const [labels, setLabels] = useState([]);

    const loadLabels = useCallback(() => {
        if (user) {
            const stored = localStorage.getItem(`labels_${user.uid}`);
            if (stored) {
                setLabels(JSON.parse(stored));
            }
        }
    }, [user]);

    useEffect(() => {
        loadLabels();
    }, [loadLabels]);

    const saveLabels = (newLabels) => {
        if (user) {
            localStorage.setItem(`labels_${user.uid}`, JSON.stringify(newLabels));
            setLabels(newLabels);
        }
    };

    const addLabel = (name) => {
        if (name.trim() && !labels.some(l => l.name === name.trim())) {
            const newLabel = {
                name: name.trim(),
                createdAt: Date.now(),
                lastUsed: null,
                goals: {
                    daily: null,
                    weekly: null,
                    monthly: null,
                    total: null
                }
            };
            saveLabels([...labels, newLabel]);
            return true;
        }
        return false;
    };

    const deleteLabel = (name) => {
        saveLabels(labels.filter(l => l.name !== name));
    };

    const updateLabelUsage = (labelNames) => {
        const updatedLabels = labels.map(label => {
            if (labelNames.includes(label.name)) {
                return { ...label, lastUsed: Date.now() };
            }
            return label;
        });
        saveLabels(updatedLabels);
    };

    const updateLabelGoals = (labelName, goals) => {
        const updatedLabels = labels.map(label => {
            if (label.name === labelName) {
                return {
                    ...label,
                    goals: {
                        ...label.goals,
                        ...goals
                    }
                };
            }
            return label;
        });
        saveLabels(updatedLabels);
    };

    const getSortedLabels = () => {
        const labelsCopy = [...labels];
        return labelsCopy.sort((a, b) => {
            if (a.lastUsed && b.lastUsed) {
                return b.lastUsed - a.lastUsed;
            }
            if (a.lastUsed) return -1;
            if (b.lastUsed) return 1;
            return b.createdAt - a.createdAt;
        });
    };

    return {
        labels,
        addLabel,
        deleteLabel,
        updateLabelUsage,
        updateLabelGoals,
        getSortedLabels
    };
};