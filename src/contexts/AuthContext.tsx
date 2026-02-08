import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

// ✅ Din egen User type
interface User {
    id: string;
    email: string;
    fullName: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    currentUser: User | null;
    session: Session | null;
    loading: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    // ✅ Fetch user details from public.users
    const fetchUserDetails = async (
        supabaseUser: SupabaseUser,
        accessToken: string  // ← Lägg till parameter
    ): Promise<User | null> => {
        try {
            console.log('🔵 Fetching user details for:', supabaseUser.email);
            console.log('🔵 Using token:', accessToken.substring(0, 20) + '...');

            const response = await fetch(`http://localhost:8080/api/users/email/${supabaseUser.email}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,  // ✅ Använd parameter
                    'Content-Type': 'application/json'
                }
            });

            console.log('🔵 Response status:', response.status);

            if (!response.ok) {
                console.error('❌ Failed to fetch user details:', response.status, response.statusText);
                return null;
            }

            const result = await response.json();
            console.log('✅ User details fetched:', result.data);
            return result.data;
        } catch (error) {
            console.error('❌ Error fetching user details:', error);
            return null;
        }
    };

// Uppdatera useEffect:
    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setSession(session);

            if (session?.user && session.access_token) {
                const userDetails = await fetchUserDetails(session.user, session.access_token);  // ✅ Skicka token
                setUser(userDetails);
            } else {
                setUser(null);
            }

            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);

            if (session?.user && session.access_token) {
                const userDetails = await fetchUserDetails(session.user, session.access_token);  // ✅ Skicka token
                setUser(userDetails);
            } else {
                setUser(null);
            }

            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

// Uppdatera login:
    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error('❌ Login error:', error.message);
                return false;
            }

            if (data.session && data.session.access_token) {
                setSession(data.session);

                const userDetails = await fetchUserDetails(data.user, data.session.access_token);  // ✅ Skicka token
                setUser(userDetails);

                return true;
            }

            return false;
        } catch (error) {
            console.error('❌ Login exception:', error);
            return false;
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
    };

    const getToken = async (): Promise<string | null> => {
        const { data } = await supabase.auth.getSession();
        return data.session?.access_token ?? null;
    };

    return (
        <AuthContext.Provider value={{
            user,
            currentUser: user,
            session,
            loading,
            isLoading: loading,
            login,
            logout,
            getToken
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}