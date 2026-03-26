import { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, query, where, orderBy, getDocs, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export const useLogs = (user) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadLogs = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            const q = query(
                collection(db, 'tasks'),
                where('userId', '==', user.uid),
                where('endTime', '>=', Timestamp.fromDate(sixMonthsAgo)),
                orderBy('endTime', 'desc')
            );

            const querySnapshot = await getDocs(q);
            const tasksData = [];
            querySnapshot.forEach((document) => {
                tasksData.push({ id: document.id, ...document.data() });
            });
            console.log('Loaded logs:', tasksData);
            setLogs(tasksData);
        } catch (error) {
            console.error('Error loading logs:', error);
            console.error('Error details:', error.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadLogs();
    }, [loadLogs]);

    const addLog = async (labels, sessions) => {
        if (!user) return;
        try {
            const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
            const newLog = {
                userId: user.uid,
                labels,
                sessions, // [{date: "2025-01-13", duration: 1200}, ...]
                totalDuration,
                endTime: Timestamp.now()
            };
            console.log('Saving log:', newLog);
            await addDoc(collection(db, 'tasks'), newLog);
            await loadLogs();
        } catch (error) {
            console.error('Error saving task:', error);
            console.error('Error details:', error.message);
        }
    };

    const deleteLog = async (logId) => {
        try {
            await deleteDoc(doc(db, 'tasks', logId));
            await loadLogs();
        } catch (error) {
            console.error('Error deleting log:', error);
        }
    };

    const updateLogLabels = async (logId, newLabels) => {
        try {
            await updateDoc(doc(db, 'tasks', logId), {
                labels: newLabels
            });
            await loadLogs();
        } catch (error) {
            console.error('Error updating log:', error);
        }
    };

    const updateLogDuration = async (logId, newDuration) => {
        try {
            const log = logs.find(l => l.id === logId);
            if (log && log.sessions) {
                await updateDoc(doc(db, 'tasks', logId), {
                    totalDuration: newDuration
                });
            } else {
                await updateDoc(doc(db, 'tasks', logId), {
                    duration: newDuration
                });
            }
            await loadLogs();
        } catch (error) {
            console.error('Error updating duration:', error);
        }
    };

    const renameLabel = async (oldLabel, newLabel) => {
        try {
            const logsWithLabel = logs.filter(log => log.labels.includes(oldLabel));
            for (const log of logsWithLabel) {
                const newLabels = log.labels.map(l => l === oldLabel ? newLabel : l);
                await updateDoc(doc(db, 'tasks', log.id), {
                    labels: newLabels
                });
            }
            await loadLogs();
        } catch (error) {
            console.error('Error renaming label:', error);
        }
    };

    const deleteAllLogsWithLabel = async (labelName) => {
        try {
            const logsWithLabel = logs.filter(log => log.labels.includes(labelName));
            for (const log of logsWithLabel) {
                await deleteDoc(doc(db, 'tasks', log.id));
            }
            await loadLogs();
        } catch (error) {
            console.error('Error deleting logs with label:', error);
        }
    };

    const getTotalTimeForLabels = (labelsList) => {
        const total = logs
            .filter(log => {
                return labelsList.every(label => log.labels.includes(label)) &&
                    labelsList.length === log.labels.length;
            })
            .reduce((sum, log) => {
                return sum + (log.totalDuration || log.duration || 0);
            }, 0);
        console.log('Total time for labels', labelsList, ':', total);
        return total;
    };

    return {
        logs,
        loading,
        addLog,
        deleteLog,
        updateLogLabels,
        updateLogDuration,
        renameLabel,
        deleteAllLogsWithLabel,
        getTotalTimeForLabels
    };
};