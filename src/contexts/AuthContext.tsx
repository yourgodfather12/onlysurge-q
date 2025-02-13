import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import type { CreatorProfile } from '../types/database';
import { toast } from 'react-hot-toast';
import { PlatformManager } from '../lib/platforms';

interface AuthContextType {
  user: User | null;
  profile: CreatorProfile | null;
  loading: boolean;
  platformManager: PlatformManager | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<CreatorProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Development user UUID - using a proper UUID format
const DEV_USER_ID = uuidv4();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [platformManager, setPlatformManager] = useState<PlatformManager | null>(null);

  useEffect(() => {
    // Check for development credentials
    if (import.meta.env.DEV) {
      const devCreds = localStorage.getItem('dev_credentials');
      if (devCreds) {
        const { email } = JSON.parse(devCreds);
        const devUser = {
          id: DEV_USER_ID,
          email,
          role: email === 'admin@example.com' ? 'admin' : 'creator',
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString()
        } as User;

        setUser(devUser);
        setProfile({
          id: DEV_USER_ID,
          onlyfans_username: email.split('@')[0],
          display_name: email.split('@')[0],
          bio: 'Development account for testing',
          avatar_url: null,
          banner_url: null,
          subscription_price: 9.99,
          total_earnings: 1234.56,
          total_subscribers: 100,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

        // Initialize platform manager with mock connections
        setPlatformManager(new PlatformManager([
          {
            id: 'mock_onlyfans',
            platform: 'onlyfans',
            accessToken: 'mock_token',
            refreshToken: 'mock_refresh',
            expiresAt: Date.now() + 3600000,
            username: email.split('@')[0],
            profileUrl: `https://onlyfans.com/${email.split('@')[0]}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]));

        setLoading(false);
        return;
      }
    }

    // Normal authentication flow
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setPlatformManager(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);

      // Initialize platform manager with real connections
      const { data: connections, error: connectionsError } = await supabase
        .from('platform_connections')
        .select('*')
        .eq('creator_id', userId);

      if (connectionsError) throw connectionsError;
      setPlatformManager(new PlatformManager(connections));
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
      setPlatformManager(null);
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Welcome back!');
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in. Please check your credentials.');
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('Failed to create account. Please try again.');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Clear development credentials if they exist
      if (import.meta.env.DEV) {
        localStorage.removeItem('dev_credentials');
      }
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<CreatorProfile>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const { data, error } = await supabase
        .from('creator_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading,
      platformManager,
      signIn, 
      signUp,
      signOut,
      updateProfile 
    }}>
      {!loading && children}
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