import { Anime } from './api';

const saveDataInLocalStorage = (key: string, data: unknown[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

const getDataFromLocalStorage = (title: string) => {
  if (localStorage.getItem(title) !== null) {
    const data = JSON.parse(localStorage.getItem(title) as string) as Anime[];
    return data;
  }
  return [];
};

export { saveDataInLocalStorage, getDataFromLocalStorage };
