import { create } from 'zustand';

const useUserStore = create(() => ({
  uuid: '',
  firstName: '',
  lastName: '',
  email: '',
}));

export const setUuid = (uuid) => useUserStore.setState(() => ({ uuid }));

export const setFirstName = (firstName) =>
  useUserStore.setState(() => ({ firstName }));

export const setLastName = (lastName) =>
  useUserStore.setState(() => ({ lastName }));

export const setEmail = (email) => useUserStore.setState(() => ({ email }));

export const clearUser = () =>
  useUserStore.setState(() => ({
    uuid: '',
    firstName: '',
    lastName: '',
    email: '',
  }));

export default useUserStore;
