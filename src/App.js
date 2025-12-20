import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './hooks/useAuth';
import { useLabels } from './hooks/useLabels';
import { useLogs } from './hooks/useLogs';
import { THEMES, getTextColor } from './config/themes';
import LoginScreen from './components/Auth/LoginScreen';
import Header from './components/Layout/Header';
import LabelManager from './components/Tracker/LabelManager';
import LabelSelector from './components/Tracker/LabelSelector';
import ActiveTask from './components/Tracker/ActiveTask';
import PausedTasks from './components/Tracker/PausedTasks';
import LogsView from './components/Logs/LogsView';
import './index.css';

function App() {
    const { user, login, logout } = useAuth();
    const { labels, addLabel, deleteLabel, updateLabelUsage, getSortedLabels } = useLabels(user);
    const { logs, addLog, deleteLog, updateLogLabels, getTotalTimeForLabels } = useLogs(user);

    const [selectedLabels, setSelectedLabels] = useState([]);
    const [activeTask, setActiveTask] = useState(null);
    const [pausedTasks, setPausedTasks] = useState([]);
    const [currentTime, setCurrentTime] = useState(0);
    const [view, setView] = useState('tracker');
    const [brightness, setBrightness] = useState(100);
    const [bgTheme, setBgTheme] = useState('black');
    const [accentColor, setAccentColor] = useState('purple');

    const intervalRef = useRef(null);

    const theme = THEMES.accent[accentColor];
    const bg = THEMES.bg[bgTheme];
    const textColor = getTextColor(bgTheme, theme);

    useEffect(() => {
        if (activeTask && activeTask.startTime) {
            intervalRef.current = setInterval(() => {
                const elapsed = Math.floor((Date.now() - activeTask.startTime) / 1000);
                setCurrentTime(activeTask.elapsedSeconds + elapsed);
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [activeTask]);

    const handleLogout = () => {
        setPausedTasks([]);
        setActiveTask(null);
        setSelectedLabels([]);
        logout();
    };

    const toggleLabel = (labelName) => {
        if (selectedLabels.includes(labelName)) {
            setSelectedLabels(selectedLabels.filter(l => l !== labelName));
        } else {
            setSelectedLabels([...selectedLabels, labelName]);
        }
    };

    const startTask = () => {
        if (selectedLabels.length === 0) return;

        updateLabelUsage(selectedLabels);
        const totalTime = getTotalTimeForLabels(selectedLabels);

        setActiveTask({
            labels: [...selectedLabels],
            startTime: Date.now(),
            elapsedSeconds: 0,
            totalPreviousTime: totalTime
        });
        setCurrentTime(0);
        setSelectedLabels([]);
    };

    const pauseTask = () => {
        if (!activeTask) return;

        const elapsed = Math.floor((Date.now() - activeTask.startTime) / 1000);
        const totalElapsed = activeTask.elapsedSeconds + elapsed;

        setPausedTasks([...pausedTasks, {
            ...activeTask,
            elapsedSeconds: totalElapsed,
            startTime: null
        }]);

        setActiveTask(null);
        setCurrentTime(0);
    };

    const resumeTask = (index) => {
        const task = pausedTasks[index];
        setActiveTask({
            ...task,
            startTime: Date.now()
        });
        setPausedTasks(pausedTasks.filter((_, i) => i !== index));
    };

    const stopTask = async () => {
        if (!activeTask) return;

        const elapsed = Math.floor((Date.now() - activeTask.startTime) / 1000);
        const totalElapsed = activeTask.elapsedSeconds + elapsed;

        await addLog(activeTask.labels, totalElapsed);
        setActiveTask(null);
        setCurrentTime(0);
    };

    const cancelTask = () => {
        setActiveTask(null);
        setCurrentTime(0);
    };

    const cancelPausedTask = (index) => {
        setPausedTasks(pausedTasks.filter((_, i) => i !== index));
    };

    if (!user) {
        return (
            <LoginScreen
                onLogin={login}
                theme={theme}
                bg={bg}
                brightness={brightness}
            />
        );
    }

    return (
        <div
            className={`min-h-screen ${bg.main} ${textColor} p-4`}
            style={{ filter: `brightness(${brightness}%)` }}
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        .pixel-text {
          font-family: 'Press Start 2P', cursive;
          font-size: 12px;
          text-shadow: 2px 2px 0px rgba(0,0,0,0.5);
        }
        
        .pixel-border {
          border: 4px solid;
          box-shadow: 4px 4px 0px rgba(0,0,0,0.5);
        }
        
        .pixel-button {
          font-family: 'Press Start 2P', cursive;
          font-size: 10px;
          border: 3px solid;
          transition: all 0.1s;
          box-shadow: 3px 3px 0px rgba(0,0,0,0.5);
        }
        
        .pixel-button:hover {
          transform: translate(2px, 2px);
          box-shadow: 1px 1px 0px rgba(0,0,0,0.5);
        }
        
        .pixel-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

            <div className="max-w-4xl mx-auto">
                <Header
                    onLogout={handleLogout}
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

                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setView('tracker')}
                        className={`pixel-button px-4 py-2 ${
                            view === 'tracker'
                                ? `${theme.button} text-white`
                                : `${bg.secondary} ${textColor}`
                        }`}
                    >
                        TRACKER
                    </button>
                    <button
                        onClick={() => setView('logs')}
                        className={`pixel-button px-4 py-2 ${
                            view === 'logs'
                                ? `${theme.button} text-white`
                                : `${bg.secondary} ${textColor}`
                        }`}
                    >
                        LOGS
                    </button>
                </div>

                {view === 'tracker' ? (
                    <div className="space-y-6">
                        <LabelManager
                            labels={getSortedLabels()}
                            onAdd={addLabel}
                            onDelete={deleteLabel}
                            theme={theme}
                            bg={bg}
                            textColor={textColor}
                        />

                        {!activeTask && (
                            <LabelSelector
                                labels={getSortedLabels()}
                                selectedLabels={selectedLabels}
                                onToggle={toggleLabel}
                                onStart={startTask}
                                theme={theme}
                                bg={bg}
                                textColor={textColor}
                            />
                        )}

                        {activeTask && (
                            <ActiveTask
                                task={activeTask}
                                currentTime={currentTime}
                                onPause={pauseTask}
                                onStop={stopTask}
                                onCancel={cancelTask}
                                theme={theme}
                                bg={bg}
                                textColor={textColor}
                            />
                        )}

                        <PausedTasks
                            tasks={pausedTasks}
                            onResume={resumeTask}
                            onCancel={cancelPausedTask}
                            activeTaskExists={activeTask !== null}
                            theme={theme}
                            bg={bg}
                            textColor={textColor}
                        />
                    </div>
                ) : (
                    <LogsView
                        logs={logs}
                        labels={labels}
                        onDeleteLog={deleteLog}
                        onUpdateLogLabels={updateLogLabels}
                        theme={theme}
                        bg={bg}
                        textColor={textColor}
                    />
                )}
            </div>
        </div>
    );
}

export default App;