
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const register = async (email: string, password: string, name: string) => {
    console.log('🔐 [AUTH] Registering user:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
        }
      }
    });
    
    if (error) {
      console.error('❌ [AUTH] Registration error:', error);
      throw error;
    }
    
    console.log('✅ [AUTH] User registered successfully:', data);
  };

  const login = async (email: string, password: string) => {
    console.log('🔐 [AUTH] Logging in user:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('❌ [AUTH] Login error:', error);
      throw error;
    }
    
    console.log('✅ [AUTH] User logged in successfully:', data);
  };

  const logout = async () => {
    console.log('🔐 [AUTH] Logging out user');
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('❌ [AUTH] Logout error:', error);
      throw error;
    }
    
    console.log('✅ [AUTH] User logged out successfully');
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔐 [AUTH] Initial session:', session ? `User: ${session.user.email}` : 'No session');
      setSession(session);
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🔐 [AUTH] Auth state changed:', session ? `User: ${session.user.email}` : 'No user');
      setSession(session);
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    currentUser,
    session,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
