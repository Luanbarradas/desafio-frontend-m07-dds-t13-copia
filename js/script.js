import {
  highlightTitle,
  highlightRating,
  highlightGenres,
  highlightLaunch,
  highlightDescription,
  highlightVideoLink,
  highlightVideo,
  moviesContainer,
  prevButton,
  nextButton,
  input,
  modal,
  modalClose,
  modalTitle,
  modalImg,
  modalDescription,
  modalGenresContainer,
  modalAverage,
  btnTheme,
  body,
} from "./domElements.js";

const apiUrl =
  "https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false";
const modalApiUrl = "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/";

const loadMovies = async () => {
  try {
    const result = await axios.get(apiUrl);
    const movieData = result.data.results;
    for (const movie of movieData) {
      const img = new Image();
      img.src = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
    }
    initializePagination(movieData);
    showHighlightMovie(movieData);
  } catch (error) {
    console.error(error);
  }
};

document.addEventListener("DOMContentLoaded", loadMovies);

const initializePagination = (movieData) => {
  let currentPage = 0;
  let moviesPerPage = getNumberOfPages();
  let totalPages;

  const renderMovies = () => {
    moviesContainer.innerHTML = "";

    const firstMovie = currentPage * moviesPerPage;
    const lastMovie = Math.min(firstMovie + moviesPerPage, movieData.length);

    const moviesToDisplay = movieData.slice(firstMovie, lastMovie);

    moviesToDisplay.forEach((movie) => {
      const movieDiv = document.createElement("div");
      movieDiv.classList.add("movie");
      movieDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.poster_path})`;
      movieDiv.dataset.id = movie.id;

      const movieInfo = document.createElement("div");
      movieInfo.classList.add("movie__info");
      movieInfo.innerHTML = `
        <span class="movie__title">${movie.title}</span>
        <span class="movie__rating">
          ${movie.vote_average.toFixed(1)}
          <img src="./assets/estrela.svg" alt="Estrela">
        </span>
      `;
      movieDiv.appendChild(movieInfo);
      moviesContainer.appendChild(movieDiv);
    });
  };

  const updatePagination = () => {
    moviesPerPage = getNumberOfPages();
    totalPages = Math.ceil(movieData.length / moviesPerPage);
    currentPage = 0;
    renderMovies();
  };

  window.addEventListener("resize", updatePagination);

  prevButton.addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
    } else {
      currentPage = totalPages - 1;
    }
    renderMovies();
  });

  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages - 1) {
      currentPage++;
    } else {
      currentPage = 0;
    }
    renderMovies();
  });

  updatePagination();
};

const getNumberOfPages = () => {
  const windowWidth = window.innerWidth;

  return windowWidth <= 420
    ? 1
    : windowWidth <= 540
    ? 2
    : windowWidth <= 820
    ? 3
    : windowWidth <= 1024
    ? 4
    : 5;
};

input.addEventListener("keyup", async (event) => {
  try {
    if (event.key === "Enter") {
      if (input.value.trim() === "") {
        await loadMovies(); // Não era pro filme do dia recarregar mas não sei como arrumar isso
      } else {
        const searchUrl = `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${input.value}`;
        const result = await axios.get(searchUrl);

        if (result.data.results.length > 0) {
          const movieData = result.data.results;
          initializePagination(movieData);
        }
      }
      input.value = "";
    }
  } catch (error) {
    console.error(error);
  }
});

const fillModal = async (movieId) => {
  try {
    const response = await axios.get(`${modalApiUrl}${movieId}?language=pt-BR`);
    const movie = response.data;
    const imagePath = movie.backdrop_path
      ? movie.backdrop_path
      : movie.poster_path;

    modalTitle.textContent = movie.title;
    modalImg.src = `https://image.tmdb.org/t/p/original${imagePath}`;
    modalDescription.textContent = movie.overview;

    if (imagePath === movie.poster_path) {
      modalImg.classList.add("decrease-poster");
    }

    modalGenresContainer.innerHTML = "";
    movie.genres.forEach((genre) => {
      const genreElement = document.createElement("span");
      genreElement.classList.add("modal__genre");
      genreElement.textContent = genre.name;
      modalGenresContainer.appendChild(genreElement);
    });

    modalAverage.textContent = movie.vote_average.toFixed(1);

    showModal();
  } catch (error) {
    console.error(error);
  }
};

const toggleModal = (show) => {
  modal.classList.toggle("hidden", !show);
};

const showModal = toggleModal.bind(null, true);
const closeModal = toggleModal.bind(null, false);

document.addEventListener("click", (event) => {
  const target = event.target;
  const movie = target.closest(".movie");
  const isModal =
    target === modal || target === modalClose || target.closest(".modal");

  if (movie) {
    const isDescription = target.closest(".modal__description");
    if (!isDescription) {
      const movieId = movie.dataset.id;
      fillModal(movieId);
    }
  } else if (isModal && !target.closest(".modal__description")) {
    closeModal();
  }
});

modalClose.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

const showHighlightMovie = async (movies) => {
  try {
    const randomIndex = (Math.random() * movies.length) | 0;
    const movieId = movies[randomIndex].id;

    const response = await axios.get(`${modalApiUrl}${movieId}?language=pt-BR`);
    const movie = response.data;

    const formattedRating = movie.vote_average.toFixed(1);

    highlightTitle.textContent = movie.title;
    highlightRating.innerHTML = `<img src="./assets/estrela.svg" alt="Estrela"> ${formattedRating}`;
    highlightGenres.textContent = movie.genres
      .map((genre) => genre.name)
      .join(", ");
    highlightLaunch.textContent = movie.release_date.slice(0, 4);
    highlightDescription.textContent = movie.overview;
    highlightVideoLink.href = `https://www.youtube.com/results?search_query=${movie.title} Trailer`;
    highlightVideo.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
  } catch (error) {
    console.error(error);
  }
};

// dark-mode

btnTheme.addEventListener("click", () => {
  const isDarkMode = body.classList.contains("dark-mode");

  if (isDarkMode) {
    body.classList.remove("dark-mode");
    btnTheme.src = "./assets/light-mode.svg";
    prevButton.src = "./assets/seta-esquerda-preta.svg";
    nextButton.src = "./assets/seta-direita-preta.svg";
  } else {
    const darkModeClass = document.createElement("style");
    darkModeClass.textContent = `
      .dark-mode {
        --background-color: #242424;
        --input-border-color: #ffffff;
        --color: #ffffff;
        --shadow-color: 0px 4px 8px rgba(0, 0, 0, 0.15);
        --highlight-background: #454545;
        --highlight-color: rgba(255, 255, 255, 0.7);
        --highlight-description: #ffffff;
    
        background-color: var(--background-color);
      }
    `;
    document.head.appendChild(darkModeClass);

    body.classList.add("dark-mode");
    btnTheme.src = "./assets/dark-mode.svg";
    prevButton.src = "./assets/seta-esquerda-branca.svg";
    nextButton.src = "./assets/seta-direita-branca.svg";
  }
});
