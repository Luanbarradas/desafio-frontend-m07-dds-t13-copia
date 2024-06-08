const select = (selector) => document.querySelector(selector);

export const highlightTitle = select(".highlight__title");
export const highlightRating = select(".highlight__rating");
export const highlightGenres = select(".highlight__genres");
export const highlightLaunch = select(".highlight__launch");
export const highlightDescription = select(".highlight__description");
export const highlightVideoLink = select(".highlight__video-link");
export const highlightVideo = select(".highlight__video");

export const moviesContainer = select(".movies");
export const prevButton = select(".btn-prev");
export const nextButton = select(".btn-next");
export const input = select(".input");

export const modal = select(".modal");
export const modalClose = select(".modal__close");
export const modalTitle = select(".modal__title");
export const modalImg = select(".modal__img");
export const modalDescription = select(".modal__description");
export const modalGenresContainer = select(".modal__genres");
export const modalAverage = select(".modal__average");

export const btnTheme = select(".btn-theme");
export const body = document.body;
