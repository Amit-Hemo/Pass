import { create } from 'zustand';

const useUserStore = create(() => ({
  uuid: '',
  firstName: '',
  lastName: '',
  email: '',
  isCustomer: false,
  hasCreditCard: false,
  cardLastDigits: '',
  cardType: '',
}));

export const setUuid = (uuid) => useUserStore.setState(() => ({ uuid }));

export const setFirstName = (firstName) =>
  useUserStore.setState(() => ({ firstName }));

export const setLastName = (lastName) =>
  useUserStore.setState(() => ({ lastName }));

export const setEmail = (email) => useUserStore.setState(() => ({ email }));

export const setIsCustomer = (status) =>
  useUserStore.setState(() => ({ isCustomer: status }));

export const setCardType = (cardType) =>
  useUserStore.setState(() => ({ cardType }));

export const setCardLastDigits = (lastDigits) =>
  useUserStore.setState(() => ({ cardLastDigits: lastDigits }));

export const setHasCreditCard = (status) =>
  useUserStore.setState(() => ({ hasCreditCard: status }));

export const clearUser = () =>
  useUserStore.setState(() => ({
    uuid: '',
    firstName: '',
    lastName: '',
    email: '',
    isCustomer: false,
    hasCreditCard: false,
    cardLastDigits: '',
    cardType: '',
  }));

export default useUserStore;
