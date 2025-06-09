import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import AppService from '../api/AppService'; // login
import $api from '../api'; // axios instance with credentials, baseURL

export type RoleType = 'developer' | 'resident' | '';

interface AuthState {
  userId: number;
  loggedIn: boolean;
  role: RoleType;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  isLoading: boolean;
  authError: boolean;
  setIsLoading: (value: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: 0,
  loggedIn: false,
  role: '',
  firstName: '',
  lastName: '',
  profileImageUrl: '',
  isLoading: false,
  authError: false,

  setIsLoading: (value) => set({ isLoading: value }),

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await AppService.login(email, password);
      console.log(data)
      const decoded: any = jwtDecode(data.accessToken);
      await AsyncStorage.setItem('token', data.accessToken);
      console.log(decoded)
      set({
        userId: decoded.userId,
        role: decoded.role,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        profileImageUrl: decoded.profileImageUrl,
        loggedIn: true,
        isLoading: false,
        authError: false,
      });
    } catch (error) {
      console.error(error);
      set({ isLoading: false, authError: true });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token');

      const decoded: any = jwtDecode(token);
      set({
        userId: decoded.userId,
        role: decoded.role,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        profileImageUrl: decoded.profileImageUrl,
        loggedIn: true,
        isLoading: false,
        authError: false,
      });
    } catch (error) {
      console.warn('checkAuth failed:', error);
      set({ loggedIn: false, isLoading: false });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    set({
      userId: 0,
      role: '',
      firstName: '',
      lastName: '',
      profileImageUrl: '',
      loggedIn: false,
      isLoading: false,
      authError: false,
    });

    try {
      await $api.post('/logout', {}, { withCredentials: true });
      console.log('Logout success');
    } catch (e) {
      console.warn('Logout error:', e);
    }
  },
}));
