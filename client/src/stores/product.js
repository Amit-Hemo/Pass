import { create } from 'zustand';

const useProductStore = create(() => ({
  name: '',
  size: '',
  price: '',
  sku: '',
  image: '',
  tagUuid: '',
  scanned: false,
}));

export const setName = (name) => useProductStore.setState(() => ({ name }));

export const setSize = (size) => useProductStore.setState(() => ({ size }));

export const setPrice = (price) => useProductStore.setState(() => ({ price }));

export const setSku = (sku) => useProductStore.setState(() => ({ sku }));

export const setImage = (url) =>
  useProductStore.setState(() => ({ image: url }));

export const setTagUuid = (tagUuid) =>
  useProductStore.setState(() => ({ tagUuid }));

export const setScanned = (status) =>
  useProductStore.setState(() => ({ scanned: status }));

export const setClearProduct = () =>
  useProductStore.setState(() => ({
    name: '',
    size: '',
    price: '',
    sku: '',
    image: '',
    tagUuid: '',
    scanned: false,
  }));

export default useProductStore;
