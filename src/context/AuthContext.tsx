'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { account } from '@/lib/appwrite';
import { Models } from 'appwrite';
import { useRouter } from 'next/navigation';
import { getUserProfile } from '@/services/appwrite';
import type { UserProfile } from '@/lib/types';

type User = Models.User<Models.Preferences> | null;

interface AuthContextType {
  user: User;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  checkUserSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    setLoading(true);
    try {
      const currentUser = await account.get();
      setUser(currentUser);
      const profile = await getUserProfile(currentUser.$id);
      setUserProfile(profile);
    } catch (e) {
      setUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, pass: string) => {
    try {
      await account.createEmailPasswordSession(email, pass);
      await checkUserSession();
      router.push('/dashboard');
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      setUserProfile(null);
      router.push('/login');
    } catch (e) {
      console.error(e);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    login,
    logout,
    checkUserSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}