
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedDate: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('compass-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    // Simulate Google auth - in real app this would use actual Google OAuth
    setTimeout(() => {
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=john`,
        joinedDate: new Date().toISOString()
      };
      setUser(mockUser);
      localStorage.setItem('compass-user', JSON.stringify(mockUser));
      setLoading(false);
    }, 1500);
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('compass-user');
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
