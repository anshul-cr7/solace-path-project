
import React, { useState } from 'react';
import LoginSignup from '@/components/LoginSignup';
import Dashboard from '@/components/Dashboard';

type UserState = {
  isLoggedIn: boolean;
  userType: 'registered' | 'trial' | null;
  userData: any;
};

const Index = () => {
  const [userState, setUserState] = useState<UserState>({
    isLoggedIn: false,
    userType: null,
    userData: null
  });

  const handleLogin = (userData: any) => {
    setUserState({
      isLoggedIn: true,
      userType: 'registered',
      userData
    });
  };

  const handleTryFree = () => {
    setUserState({
      isLoggedIn: true,
      userType: 'trial',
      userData: { name: 'Trial User' }
    });
  };

  const handleSignOut = () => {
    setUserState({
      isLoggedIn: false,
      userType: null,
      userData: null
    });
  };

  if (!userState.isLoggedIn) {
    return (
      <LoginSignup 
        onLogin={handleLogin}
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
