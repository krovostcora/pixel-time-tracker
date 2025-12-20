import React, { useState } from 'react';

const LabelManager = ({ labels, onAdd, onDelete, theme, bg, textColor }) => {
    const [newLabel, setNewLabel] = useState('');

    const handleAdd = () => {
        if (onAdd(newLabel)) {
            setNewLabel('');
        }
    };

    return (
        <div className={`pixel-border p-3 md:p-4 ${bg.secondary} ${theme.border}`}>
            <h2 className={`pixel-text mb-3 md:mb-4 text-xs md:text-base ${theme.light}`}>LABELS</h2>
            <div className="flex flex-col sm:flex-row gap-2 mb-3 md:mb-4">
                <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                    placeholder="NEW LABEL"
                    className={`flex-1 ${bg.tertiary} border-2 ${theme.border} px-3 py-2 pixel-text text-xs ${textColor}`}
                />
                <button
                    onClick={handleAdd}
                    className={`pixel-button ${theme.button} ${theme.hover} text-white px-4 py-2 w-full sm:w-auto`}
                >
                    ADD
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {labels.map((label) => (
                    <div
                        key={label.name}
                        className={`flex items-center gap-2 ${bg.tertiary} px-2 md:px-3 py-1 md:py-2 pixel-border ${theme.border}`}
                    >
                        <span className={`pixel-text text-xs ${textColor} break-all`}>{label.name}</span>
                        <button
                            onClick={() => onDelete(label.name)}
                            className="text-red-400 hover:text-red-300 pixel-text text-xs flex-shrink-0"
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LabelManager;