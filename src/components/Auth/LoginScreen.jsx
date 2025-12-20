import React from 'react';

const LoginScreen = ({ onLogin, theme, bg, brightness }) => {
    return (
        <div className={`min-h-screen flex items-center justify-center ${bg.main}`}>
            <div style={{ filter: `brightness(${brightness}%)` }}>
                <div className={`text-center pixel-border p-8 ${theme.dark}`}>
                    <h1 className={`text-4xl mb-8 ${theme.light} pixel-text`}>TIME TRACKER</h1>
                    <button
                        onClick={onLogin}
                        className={`pixel-button ${theme.main} ${theme.hover} text-white px-6 py-3`}
                    >
                        GOOGLE LOGIN
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;