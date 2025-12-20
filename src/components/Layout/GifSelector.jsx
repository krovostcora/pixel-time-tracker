import React from 'react';

const GIFS = {
    none: { name: 'NONE', url: null },
    rain: { name: 'RAIN', url: `${process.env.PUBLIC_URL}/gifs/rain.gif` },
    forest: { name: 'FOREST', url: `${process.env.PUBLIC_URL}/gifs/forest.gif` },
    cafe: { name: 'CAFE', url: `${process.env.PUBLIC_URL}/gifs/cafe.gif` },
    homestorm: { name: 'HOME STORM', url: `${process.env.PUBLIC_URL}/gifs/homestorm.gif` },
    pinkdrink: { name: 'PINK DRINK', url: `${process.env.PUBLIC_URL}/gifs/pinkdrink.gif` }
};

const GifSelector = ({ selectedGif, setSelectedGif, theme, bg, textColor }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {Object.entries(GIFS).map(([key, gif]) => (
                <button
                    key={key}
                    onClick={() => setSelectedGif(key)}
                    className={`pixel-button px-3 py-2 text-xs ${
                        selectedGif === key
                            ? `${theme.selected} text-white`
                            : `${bg.tertiary} ${textColor}`
                    }`}
                >
                    {gif.name}
                </button>
            ))}
        </div>
    );
};

export { GIFS };
export default GifSelector;