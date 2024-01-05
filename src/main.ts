import { getData, getAnimeByTitle, Anime } from './api';
import {
  saveDataInLocalStorage,
  getDataFromLocalStorage,
} from './localStorageApi';

import './index.less';

const input = document.querySelector('#search__input') as HTMLInputElement;
const suggest = document.querySelector('.suggest') as HTMLDivElement;
const output = document.querySelector('.output') as HTMLDivElement;
const aside = document.querySelector('.last-searches') as HTMLDivElement;

const suggestListFill = (animes: Anime[]): void => {
  suggest.classList.remove('active');

  if (!animes.length) {
    const div = document.createElement('div');
    div.classList.add('suggest__item');
    div.textContent = 'There is no valid search results';
    suggest.append(div);
    suggest.classList.add('active');
  } else {
    const visitedAnimes = getDataFromLocalStorage('visited');
    let visited_count = 0;

    animes
      .map((anime) => {
        return anime.title;
      })
      .slice(0, 10)
      .forEach((title) => {
        const div = document.createElement('div');
        div.classList.add('suggest__item');
        div.classList.add('suggest__item_anime');
        div.textContent = title;

        if (
          visitedAnimes.find((anime) => anime.title === title) &&
          visited_count < 5
        ) {
          visited_count += 1;
          div.classList.add('suggest__item_visited');
          suggest.prepend(div);
        } else {
          suggest.append(div);
        }
      });
    suggest.classList.add('active');
  }
};

const renderAnimeInfo = (anime: Anime): void => {
  const header = document.querySelector(
    '.output__header',
  ) as HTMLHeadingElement;
  const poster = document.querySelector(
    '.output__poster .poster-logo',
  ) as HTMLImageElement;
  const genres = document.querySelector('.genres-text') as HTMLSpanElement;
  const synopsis = document.querySelector('.synopsys-text') as HTMLSpanElement;
  const score = document.querySelector('.score-text') as HTMLSpanElement;
  const url = document.querySelector('.url-text a') as HTMLSpanElement;

  header.textContent = anime.title;
  poster.setAttribute('src', anime.images.webp.image_url);
  genres.textContent = anime.genres.map((genre) => genre.name).join(', ');
  synopsis.textContent = anime.synopsis;
  score.textContent = `${anime.score}`;
  url.setAttribute('href', anime.url);

  output.classList.add('show');
};

const renderAside = (): void => {
  aside.innerHTML = '';

  const header = document.createElement('h2');
  header.classList.add('last-searches__header');
  header.textContent = 'Последние запросы:';

  const content = document.createElement('div');
  content.classList.add('last-searches__content');

  aside.append(header, content);

  const visitedAnimes = getDataFromLocalStorage('visited');
  visitedAnimes.slice(0, 3).forEach((anime: Anime) => {
    const div = document.createElement('div');
    div.classList.add('last-searches__item');
    div.textContent = anime.title;
    content.append(div);
  });

  aside.classList.add('show');
};

let timeout: number;

input.addEventListener('input', (event) => {
  event.preventDefault();

  if (input.value) {
    clearTimeout(timeout);

    timeout = setTimeout(async () => {
      suggest.innerHTML = '';
      suggest.classList.remove('active');

      let animeList = [] as Anime[];

      try {
        const animes = await getData(input.value);
        console.log(animes);
        animeList = animes.data;
        saveDataInLocalStorage('animes', animeList);
        suggestListFill(animeList);
      } catch (error) {
        console.log(error);

        const div = document.createElement('div');
        div.classList.add('suggest__item');

        if (
          typeof error === 'object' &&
          error !== null &&
          'status' in error &&
          'message' in error
        ) {
          div.textContent = `Error ${error.status as number}. 
            ${error.message as string}`;
        } else {
          div.textContent = `${error as string}`;
        }

        suggest.append(div);
        suggest.classList.add('active');
      }
    }, 300);
  } else {
    suggest.innerHTML = '';
    suggest.classList.remove('active');
  }
});

suggest.addEventListener('click', (event) => {
  if (
    event.target instanceof HTMLDivElement &&
    event.target.classList.contains('suggest__item_anime')
  ) {
    input.value = '';
    suggest.classList.remove('active');

    const title = event.target.textContent;

    const anime = getAnimeByTitle(title as string);
    const visitedAnimes = getDataFromLocalStorage('visited');
    if (!visitedAnimes.find((anime) => anime.title === title)) {
      visitedAnimes.unshift(anime);
    }
    saveDataInLocalStorage('visited', visitedAnimes);
    renderAnimeInfo(anime);
    renderAside();
  }
});

window.addEventListener('storage', () => {
  renderAside();
});
