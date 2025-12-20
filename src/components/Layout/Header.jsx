import React from 'react';
import ThemeSelector from './ThemeSelector';

const Header = ({
                    onLogout,
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
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h1 className={`text-2xl pixel-text ${theme.light}`}>TRACKER</h1>
            <div className="flex gap-4 items-center flex-wrap">
                <ThemeSelector
                    brightness={brightness}
                    setBrightness={setBrightness}
                    bgTheme={bgTheme}
                    setBgTheme={setBgTheme}
                    accentColor={accentColor}
                    setAccentColor={setAccentColor}
                    theme={theme}
                    bg={bg}
                    textColor={textColor}
                />
                <button
                    onClick={onLogout}
                    className={`pixel-button ${theme.main} ${theme.hover} text-white px-4 py-2`}
                >
                    EXIT
                </button>
            </div>
        </div>
    );
};

export default Header;