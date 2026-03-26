import React, { useState } from 'react';
import ThemeSelector from './ThemeSelector';
import GifSelector from './GifSelector';

const Header = ({
                    onLogout,
                    brightness,
                    setBrightness,
                    bgTheme,
                    setBgTheme,
                    accentColor,
                    setAccentColor,
                    selectedGif,
                    setSelectedGif,
                    theme,
                    bg,
                    textColor
                }) => {
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className={`text-xl md:text-2xl pixel-text ${theme.light}`}>PixeL.TRACKER</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`pixel-button ${theme.main} ${theme.hover} text-white px-3 py-2 text-xs`}
                    >
                        {showSettings ? 'HIDE' : 'SETTINGS'}
                    </button>
                    <button
                        onClick={onLogout}
                        className={`pixel-button ${theme.main} ${theme.hover} text-white px-3 py-2 text-xs`}
                    >
                        EXIT
                    </button>
                </div>
            </div>

            {showSettings && (
                <div className={`pixel-border p-4 ${bg.secondary} ${theme.border} space-y-4`}>
                    <div>
                        <h3 className={`pixel-text text-xs mb-2 ${theme.light}`}>THEME</h3>
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
                    </div>

                    <div>
                        <h3 className={`pixel-text text-xs mb-2 ${theme.light}`}>AMBIENT GIF</h3>
                        <GifSelector
                            selectedGif={selectedGif}
                            setSelectedGif={setSelectedGif}
                            theme={theme}
                            bg={bg}
                            textColor={textColor}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;