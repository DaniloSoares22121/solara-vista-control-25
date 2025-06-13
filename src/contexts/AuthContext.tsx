
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
    let mounted = true;

    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 [AUTH] Auth state changed:', event, session ? `User: ${session.user.email}` : 'No user');
      
      if (!mounted) return;

      // Only update state if component is still mounted
      setSession(session);
      setCurrentUser(session?.user ?? null);
      
      // Only set loading to false after we've processed the auth state
      if (event !== 'INITIAL_SESSION') {
        setLoading(false);
      }
    });

    // Get initial session AFTER setting up the listener
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ [AUTH] Error getting session:', error);
        }
        
        if (!mounted) return;

        console.log('🔐 [AUTH] Initial session:', session ? `User: ${session.user.email}` : 'No session');
        setSession(session);
        setCurrentUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error('❌ [AUTH] Error in getInitialSession:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
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
