import React from 'react';
import { GIFS } from '../Layout/GifSelector';

const GifDisplay = ({ selectedGif, theme, bg }) => {
    const gif = GIFS[selectedGif];

    if (!gif || !gif.url) return null;

    return (
        <div className={`pixel-border p-0 ${bg.secondary} ${theme.border} overflow-hidden`}>
            <img
                src={gif.url}
                alt={gif.name}
                className="w-full h-80 md:h-50 object-cover rounded"
                style={{ imageRendering: 'pixelated' }}
            />
        </div>
    );
};

export default GifDisplay;