import React, { useState } from 'react';

const GIFS = {
    none: { name: 'NONE', url: null },
    rain: { name: 'RAIN', url: `${process.env.PUBLIC_URL}/gifs/rain.gif` },
    forest: { name: 'FOREST', url: `${process.env.PUBLIC_URL}/gifs/forest.gif` },
    cafe: { name: 'CAFE', url: `${process.env.PUBLIC_URL}/gifs/cafe.gif` },
    homestorm: { name: 'HOME STORM', url: `${process.env.PUBLIC_URL}/gifs/homestorm.gif` },
    pinkdrink: { name: 'PINK DRINK', url: `${process.env.PUBLIC_URL}/gifs/pinkdrink.gif` },
};

const LoginScreen = ({ onLogin, theme, bg, brightness }) => {
    const [activeGif] = useState('cafe');
    const gifUrl = GIFS[activeGif].url;

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden">

            {/* Background gif layer */}
            {gifUrl && (
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `url(${gifUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: `brightness(${brightness * 0.6}%)`,
                    }}
                />
            )}

            {/* Fallback bg when no gif */}
            {!gifUrl && (
                <div
                    className={`absolute inset-0 z-0 ${bg.main}`}
                    style={{ filter: `brightness(${brightness}%)` }}
                />
            )}

            {/* Dark vignette overlay */}
            {gifUrl && (
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)',
                    }}
                />
            )}

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-6" style={{ filter: `brightness(${brightness}%)` }}>

                {/* Title */}
                <div className="text-center mb-2">
                    <h1 className="pixel-text text-3xl md:text-5xl text-yellow-300 tracking-widest">
                        TIME TRACKER
                    </h1>
                    <p className="pixel-text text-xs mt-2 opacity-50 text-yellow-300 tracking-[0.3em]">
                        TRACK · FOCUS · GROW
                    </p>
                </div>

                {/* Login card */}
                <div
                    // className={`pixel-border p-6 md:p-8 flex flex-col items-center gap-6 ${theme.dark}`}
                    // style={{
                    //     background: gifUrl ? 'rgba(0,0,0,0.55)' : undefined,
                    //     backdropFilter: gifUrl ? 'blur(2px)' : undefined,
                    //     minWidth: '280px',
                    // }}
                >
                    <button
                        onClick={onLogin}
                        className={`pixel-button ${theme.main} ${theme.hover} text-white px-8 py-4 text-xs pixel-text tracking-widest w-full`}
                    >
                        ▶ GOOGLE LOGIN
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;