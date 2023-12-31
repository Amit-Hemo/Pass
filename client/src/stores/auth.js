import { create } from 'zustand';

const useAuthStore = create(() => ({
  accessToken: null,
  isLoggedIn: false,
  isForcedLogout: false,
  isSignedWithProvider: false,
}));

export const setAccessToken = (token) =>
  useAuthStore.setState(() => ({ accessToken: token }));

export const setIsLoggedIn = (status) =>
  useAuthStore.setState(() => ({ isLoggedIn: status }));

export const setIsForcedLogout = (status) =>
  useAuthStore.setState(() => ({ isForcedLogout: status }));

export const setClearAuth = () =>
  useAuthStore.setState(() => ({
    accessToken: null,
    isLoggedIn: false,
    isSignedWithProvider: false,
  }));

export const setIsSignedWithProvider = (status) =>
  useAuthStore.setState(() => ({ isSignedWithProvider: status }));

export default useAuthStore;
