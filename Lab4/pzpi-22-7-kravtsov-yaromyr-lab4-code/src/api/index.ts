import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse } from './AppService';

export const API_URL = 'http://172.20.10.2:5001/';

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

// ⛔️ НЕ ПРАЦЮЄ в React Native: localStorage.getItem
$api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

$api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ❗️Якщо хочеш — можна розкоментувати логіку refresh
    /*
    if (error.response?.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.get<AuthResponse>(`${API_URL}/token/refresh`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        await AsyncStorage.setItem('token', response.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

        return $api.request(originalRequest);
      } catch (e) {
        console.log('Token refresh error', e);
      }
    }
    */

    return Promise.reject(error);
  }
);

export default $api;
