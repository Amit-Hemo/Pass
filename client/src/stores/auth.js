import { create } from 'zustand';

const useAuthStore = create(() => ({
  accessToken: null,
  isLoggedIn: false,
}));

export const setAccessToken = (token) =>
  useAuthStore.setState(() => ({ accessToken: token }));

export const clearAccessToken = () =>
  useAuthStore.setState(() => ({ accessToken: null }));

export const setIsLoggedIn = (status) =>
  useAuthStore.setState(() => ({ isLoggedIn: status }));

export default useAuthStore;
