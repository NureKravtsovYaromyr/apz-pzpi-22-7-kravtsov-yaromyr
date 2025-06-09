import create from 'zustand';
import axios from 'axios';
import AppService from '../api/service/AppService';
import { jwtDecode } from 'jwt-decode';
import $api from '../api/http';
import { RoleType } from '../../models/IUser';



interface BearState {
  userId: number
  loggedIn: boolean;
  role: RoleType;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  isLoading: boolean;
  setLoggedIn: (value: boolean) => void;
  setRole: (role: RoleType) => void;
  setIsLoading: (value: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => void;
  authError: boolean;

}
// ERROR After reload page as loged user auto log out !!!
export const useAuthStore = create<BearState>((set) => ({
  firstName: '',
  lastName: '',
  position: '',
  profileImageUrl: '',
  authError: false,
  userId: 0,
  loggedIn: false,
  setLoggedIn: (value: boolean) => set(() => ({ loggedIn: value })),
  role: '',
  setRole: (role: RoleType) => set(() => ({ role })),
  isLoading: true,
  setIsLoading: (value: boolean) => set(() => ({ isLoading: value })),
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data } = await AppService.login(email, password);

      const decodedToken: any = jwtDecode(data.accessToken);
      console.log(decodedToken) 
      set({
        userId: decodedToken.userId,
        loggedIn: true,
        role: decodedToken.role,
        isLoading: false,
        authError: false,
        firstName: decodedToken.firstName,
        lastName: decodedToken.lastName,
        profileImageUrl: decodedToken.profileImageUrl,
      });
      localStorage.setItem('token', data.accessToken);
    } catch (error: any) {
      console.error(error);
      set({ isLoading: false, authError: true });
      throw new Error(error)

    }
  },
  checkAuth: async () => {
    set({ isLoading: true });
    try {
/*       localStorage.setItem('token', response.data.accessToken);
      const decodedToken: any = jwtDecode(response.data.accessToken); */
      const accessToken = localStorage.getItem('token');
      const decodedToken : any = jwtDecode(accessToken || '');
      console.log(decodedToken)
      set({
        userId: decodedToken.userId,
        loggedIn: true,
        role: decodedToken.role,
        isLoading: false,
        authError: false,
        firstName: decodedToken.firstName,
        lastName: decodedToken.lastName,
        profileImageUrl: decodedToken.profileImageUrl,
      });
    } catch (error: any) {
      console.error(error.response?.data?.message);
      set({ isLoading: false, loggedIn: false });
    }
  },

  logout: () => {
    set({ loggedIn: false, role: '', isLoading: false, userId: 0 });
    localStorage.removeItem('token');
    $api.post('/logout', {}, { withCredentials: true })
      .then(() => {
        console.log('Successfully logged out');
      })
      .catch((error: any) => {
        console.error('Logout error', error);
      });
  },
}));
