import { create } from 'zustand';
import { setAuthToken } from '../api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  profilePic: string;
  location?: string;
  bio?: string;
  aboutMe?: string[];
  interests?: string[];
  lookingTo?: string[];
  groupsCount?: number;
  interestsCount?: number;
  rsvpsCount?: number;
}

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken?: string) => void;
  logout: () => void;
  setAccessToken: (accessToken: string) => void;
  updateUser: (updatedUser: Partial<User>) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken, refreshToken) => {
        (setAuthToken(accessToken),
          set({ user, accessToken, refreshToken, isAuthenticated: true }));
      },
      setAccessToken: (accessToken: string) => {
        (setAuthToken(accessToken), set({ accessToken }));
      },
      logout: () => {
        setAuthToken(null);
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        AsyncStorage.removeItem('auth-storage');
      },
      updateUser: updatedUser =>
        set(state => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => state => {
        if (state?.accessToken) {
          setAuthToken(state.accessToken);
        }
      },
    },
  ),
);
