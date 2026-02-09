import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { api } from '@/utils/api';
import type { Session } from '@supabase/supabase-js';

export interface AuthUser {
    id: string;
    email: string;
    role: 'ADMIN' | 'RECRUITER' | 'HIRING_MANAGER';
    fullName: string;
    organizationId: string;
    organizationName?: string;
}

interface AuthContextType {
    currentUser: AuthUser | null;
    session: Session | null;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchUserProfile(email: string): Promise<AuthUser | null> {
    try {
        const user = await api.get<AuthUser>(`/users/email/${encodeURIComponent(email)}`);
        return user;
    } catch (error) {
        console.error('Failed to fetch user profile:', error);
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, newSession) => {
                setSession(newSession);

                if (!newSession) {
                    setCurrentUser(null);
                    setIsLoading(false);
                    return;
                }

                // Defer profile fetch to avoid deadlock
                if (newSession.user?.email) {
                    setTimeout(() => {
                        fetchUserProfile(newSession.user.email!).then((profile) => {
                            setCurrentUser(profile);
                            setIsLoading(false);
                        });
                    }, 0);
                }
            }
        );

        // THEN check for existing session
        supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
            setSession(existingSession);
            if (existingSession?.user?.email) {
                fetchUserProfile(existingSession.user.email).then((profile) => {
                    setCurrentUser(profile);
                    setIsLoading(false);
                });
            } else {
                setIsLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            return { success: false, error: error.message };
        }

        if (data.session) {
            setSession(data.session);
            const profile = await fetchUserProfile(email);
            if (profile) {
                setCurrentUser(profile);
                return { success: true };
            }
            return { success: false, error: 'User profile not found in backend' };
        }

        return { success: false, error: 'Login failed' };
    }, []);

    const logout = useCallback(async () => {
        await supabase.auth.signOut();
        setCurrentUser(null);
        setSession(null);
        localStorage.removeItem('adminSelectedOrgId');
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, session, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
