import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface AuthUser {
    id: string;
    email: string;
    role: 'ADMIN' | 'RECRUITER' | 'HIRING_MANAGER';
    fullName: string;
    organizationId: string;
    organizationName?: string;
}

interface StoredUser extends AuthUser {
    password: string;
}

interface AuthContextType {
    currentUser: AuthUser | null;
    login: (email: string, password: string) => boolean;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Mock users with REAL IDs from Supabase database
const DEFAULT_USERS: StoredUser[] = [
    {
        id: '8615009f-57bc-43a8-83f9-6c14fe42a276', // ✅ REAL ID from database!
        email: 'admin@acme.com',
        password: 'admin123',
        role: 'ADMIN',
        fullName: 'Admin User',
        organizationId: '11111111-1111-1111-1111-111111111111',
        organizationName: 'Acme Corp'
    },
    {
        id: 'e31c9580-3d88-4018-a69a-d0d6747c19ef', // ✅ REAL ID from database!
        email: 'test@acme.com',
        password: 'admin123',
        role: 'ADMIN',
        fullName: 'Test User',
        organizationId: '11111111-1111-1111-1111-111111111111',
        organizationName: 'Acme Corp'
    }
];

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check localStorage on mount
        const stored = localStorage.getItem('currentUser');
        if (stored) {
            try {
                setCurrentUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem('currentUser');
            }
        }
        setIsLoading(false);
    }, []);

    const login = useCallback((email: string, password: string): boolean => {
        const user = DEFAULT_USERS.find(u => u.email === email && u.password === password);
        if (user) {
            const { password: _, ...userWithoutPassword } = user;
            setCurrentUser(userWithoutPassword);
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
            return true;
        }
        return false;
    }, []);

    const logout = useCallback(() => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, isLoading }}>
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