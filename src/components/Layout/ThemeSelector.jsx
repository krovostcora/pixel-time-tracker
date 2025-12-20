import React from 'react';

const ThemeSelector = ({
                           brightness,
                           setBrightness,
                           bgTheme,
                           setBgTheme,
                           accentColor,
                           setAccentColor,
                           theme,
                           bg,
                           textColor
                       }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="flex flex-col gap-2">
                <span className="pixel-text text-xs">DIM</span>
                <input
                    type="range"
                    min="30"
                    max="100"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full"
                />
            </div>

            <div className="flex flex-col gap-2">
                <span className="pixel-text text-xs">BACKGROUND</span>
                <select
                    value={bgTheme}
                    onChange={(e) => setBgTheme(e.target.value)}
                    className={`${bg.secondary} border-2 ${theme.border} px-2 py-1 pixel-text text-xs ${textColor} w-full`}
                >
                    <option value="black">BLACK</option>
                    <option value="white">WHITE</option>
                    <option value="gray">GRAY</option>
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <span className="pixel-text text-xs">ACCENT</span>
                <select
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className={`${bg.secondary} border-2 ${theme.border} px-2 py-1 pixel-text text-xs ${textColor} w-full`}
                >
                    <option value="purple">PURPLE</option>
                    <option value="blue">BLUE</option>
                    <option value="green">GREEN</option>
                    <option value="red">RED</option>
                    <option value="yellow">YELLOW</option>
                    <option value="dark">DARK</option>
                </select>
            </div>
        </div>
    );
};

export default ThemeSelector;