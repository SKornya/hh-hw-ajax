import { Anime } from './api';

const saveDataInLocalStorage = (key: string, data: unknown[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    localStorage.removeItem(key);
  }
};

const getDataFromLocalStorage = (title: string) => {
  const storageData = localStorage.getItem(title);
  if (storageData !== null) {
    try {
      const data = JSON.parse(storageData) as Anime[];
      return data;
    } catch (error) {
      return [];
    }
  }
  return [];
};

export { saveDataInLocalStorage, getDataFromLocalStorage };
