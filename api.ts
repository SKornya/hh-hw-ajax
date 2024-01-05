import { getDataFromLocalStorage } from './localStorageApi';

interface Anime {
  title: string;
  images: {
    webp: {
      image_url: string;
    };
  };
  genres: Array<{ name: string }>;
  synopsis: string;
  score: number;
  url: string;
}

interface AnimeData {
  data: Anime[];
}

type CustomError = {
  status: number;
  message: string;
};

const API_URL = 'https://api.jikan.moe/v4/anime';

const getData = async (param: string): Promise<AnimeData> => {
  try {
    const response = await fetch(`${API_URL}?q=${param}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
    });

    if (response.ok) {
      return response.json() as Promise<AnimeData>;
    } else {
      throw response;
    }
  } catch (error) {
    console.log(error);

    if (error instanceof Response) {
      const myError: CustomError = {
        status: error.status,
        message: error.statusText,
      };
      throw myError;
    } else {
      throw error;
    }
  }
};

const getAnimeByTitle = (title: string): Anime => {
  const animes = getDataFromLocalStorage('animes');
  const anime = animes.find((anime) => anime.title === title);
  return anime as Anime;
};

export { getData, getAnimeByTitle, Anime };
