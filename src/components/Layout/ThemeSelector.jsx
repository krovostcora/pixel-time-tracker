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
        <>
            <div className="flex items-center gap-2">
                <span className="pixel-text text-xs">DIM</span>
                <input
                    type="range"
                    min="30"
                    max="100"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-24"
                />
            </div>
            <select
                value={bgTheme}
                onChange={(e) => setBgTheme(e.target.value)}
                className={`${bg.secondary} border-2 ${theme.border} px-2 py-1 pixel-text text-xs ${textColor}`}
            >
                <option value="black">BLACK BG</option>
                <option value="white">WHITE BG</option>
                <option value="gray">GRAY BG</option>
            </select>
            <select
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className={`${bg.secondary} border-2 ${theme.border} px-2 py-1 pixel-text text-xs ${textColor}`}
            >
                <option value="purple">PURPLE</option>
                <option value="blue">BLUE</option>
                <option value="green">GREEN</option>
                <option value="red">RED</option>
                <option value="yellow">YELLOW</option>
                <option value="dark">DARK</option>
            </select>
        </>
    );
};

export default ThemeSelector;