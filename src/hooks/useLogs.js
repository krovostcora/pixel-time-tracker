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
            console.log('Loaded logs:', tasksData); // DEBUG
            setLogs(tasksData);
        } catch (error) {
            console.error('Error loading logs:', error);
            console.error('Error details:', error.message); // DEBUG
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadLogs();
    }, [loadLogs]);

    const addLog = async (labels, duration) => {
        if (!user) return;
        try {
            const newLog = {
                userId: user.uid,
                labels,
                duration,
                endTime: Timestamp.now()
            };
            console.log('Saving log:', newLog); // DEBUG
            await addDoc(collection(db, 'tasks'), newLog);
            await loadLogs();
        } catch (error) {
            console.error('Error saving task:', error);
            console.error('Error details:', error.message); // DEBUG
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

    const getTotalTimeForLabels = (labelsList) => {
        const total = logs
            .filter(log => {
                return labelsList.every(label => log.labels.includes(label)) &&
                    labelsList.length === log.labels.length;
            })
            .reduce((sum, log) => sum + log.duration, 0);
        console.log('Total time for labels', labelsList, ':', total); // DEBUG
        return total;
    };

    return {
        logs,
        loading,
        addLog,
        deleteLog,
        updateLogLabels,
        getTotalTimeForLabels
    };
};