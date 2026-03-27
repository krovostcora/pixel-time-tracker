import { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        }, (error) => {
            console.error('Auth state error:', error);
            setError(error.message);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async () => {
        setError(null);
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'
        });

        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message);
            if (error.code === 'auth/popup-blocked') {
                alert('Popup blocked. Try to open in regular browser.');
            }
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout error:', error);
            setError(error.message);
        }
    };

    return { user, loading, error, login, logout };
};