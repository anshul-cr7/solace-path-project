
import React, { useState, useEffect } from 'react';
import LoginSignup from '@/components/LoginSignup';
import Dashboard from '@/components/Dashboard';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

type UserState = {
  isLoggedIn: boolean;
  userType: 'registered' | 'trial' | null;
  userData: any;
};

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userState, setUserState] = useState<UserState>({
    isLoggedIn: false,
    userType: null,
    userData: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setUserState({
            isLoggedIn: true,
            userType: 'registered',
            userData: session.user
          });
        } else {
          setUserState({
            isLoggedIn: false,
            userType: null,
            userData: null
          });
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setUserState({
          isLoggedIn: true,
          userType: 'registered',
          userData: session.user
        });
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleTryFree = () => {
    setUserState({
      isLoggedIn: true,
      userType: 'trial',
      userData: { name: 'Trial User' }
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userState.isLoggedIn) {
    return (
      <LoginSignup 
        onTryFree={handleTryFree}
      />
    );
  }

  return (
    <Dashboard 
      onSignOut={handleSignOut}
      userType={userState.userType!}
    />
  );
};

export default Index;
