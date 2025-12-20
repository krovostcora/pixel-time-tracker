export const THEMES = {
    bg: {
        black: {
            main: 'bg-black',
            secondary: 'bg-gray-900',
            tertiary: 'bg-gray-800'
        },
        white: {
            main: 'bg-white',
            secondary: 'bg-gray-100',
            tertiary: 'bg-gray-200'
        },
        gray: {
            main: 'bg-gray-800',
            secondary: 'bg-gray-700',
            tertiary: 'bg-gray-600'
        }
    },
    accent: {
        purple: {
            light: 'text-purple-300',
            main: 'bg-purple-700',
            dark: 'bg-purple-950',
            border: 'border-purple-700',
            hover: 'hover:bg-purple-600',
            button: 'bg-purple-600',
            selected: 'bg-purple-600'
        },
        blue: {
            light: 'text-blue-300',
            main: 'bg-blue-700',
            dark: 'bg-blue-950',
            border: 'border-blue-700',
            hover: 'hover:bg-blue-600',
            button: 'bg-blue-600',
            selected: 'bg-blue-600'
        },
        green: {
            light: 'text-green-300',
            main: 'bg-green-700',
            dark: 'bg-green-950',
            border: 'border-green-700',
            hover: 'hover:bg-green-600',
            button: 'bg-green-600',
            selected: 'bg-green-600'
        },
        red: {
            light: 'text-red-300',
            main: 'bg-red-800',
            dark: 'bg-red-950',
            border: 'border-red-800',
            hover: 'hover:bg-red-700',
            button: 'bg-red-700',
            selected: 'bg-red-700'
        },
        yellow: {
            light: 'text-yellow-300',
            main: 'bg-yellow-700',
            dark: 'bg-yellow-900',
            border: 'border-yellow-700',
            hover: 'hover:bg-yellow-600',
            button: 'bg-yellow-600',
            selected: 'bg-yellow-600'
        },
        dark: {
            light: 'text-gray-400',
            main: 'bg-gray-700',
            dark: 'bg-gray-900',
            border: 'border-gray-600',
            hover: 'hover:bg-gray-600',
            button: 'bg-gray-600',
            selected: 'bg-gray-600'
        }
    }
};

export const getTextColor = (bgTheme, theme) => {
    return bgTheme === 'white' ? 'text-gray-800' : theme.light;
};