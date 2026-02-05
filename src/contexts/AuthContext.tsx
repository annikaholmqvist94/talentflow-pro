import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
  fullName: string;
  organizationId: string;
  organizationName: string;
}

interface StoredUser extends AuthUser {
  password: string;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
  addUser: (user: StoredUser) => void;
  getUsers: () => StoredUser[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded users for demo
const DEFAULT_USERS: StoredUser[] = [
  {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'admin@acme.com',
    password: 'admin123',
    role: 'ADMIN',
    fullName: 'Admin User',
    organizationId: '11111111-1111-1111-1111-111111111111',
    organizationName: 'Acme Corp'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'user@acme.com',
    password: 'user123',
    role: 'USER',
    fullName: 'Regular User',
    organizationId: '11111111-1111-1111-1111-111111111111',
    organizationName: 'Acme Corp'
  }
];

// Load users from localStorage or use defaults
const loadUsers = (): StoredUser[] => {
  const stored = localStorage.getItem('ats_users');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_USERS;
    }
  }
  return DEFAULT_USERS;
};

// Save users to localStorage
const saveUsers = (users: StoredUser[]) => {
  localStorage.setItem('ats_users', JSON.stringify(users));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<StoredUser[]>(loadUsers);

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
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('adminSelectedOrgId');
  }, []);

  const addUser = useCallback((user: StoredUser) => {
    setUsers(prev => {
      const updated = [...prev, user];
      saveUsers(updated);
      return updated;
    });
  }, []);

  const getUsers = useCallback(() => users, [users]);

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        login, 
        logout, 
        isLoading,
        addUser,
        getUsers
      }}
    >
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
