const apiUrl =
  "https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false";

document.addEventListener("DOMContentLoaded", async () => {
  let movieData = [];
  try {
    const result = await axios.get(apiUrl);
    movieData = result.data.results;
    initializePagination(movieData);
  } catch (error) {
    console.error(error);
  }
});

const initializePagination = (movieData) => {
  const moviesContainer = document.querySelector(".movies");
  const prevButton = document.querySelector(".btn-prev");
  const nextButton = document.querySelector(".btn-next");

  const moviesPerPage = 5;

  const renderMovies = (page) => {
    moviesContainer.innerHTML = "";
    const start = page * moviesPerPage;
    const end = start + moviesPerPage;
    const moviesToDisplay = movieData.slice(start, end);

    moviesToDisplay.forEach((movie) => {
      const movieDiv = document.createElement("div");
      movieDiv.classList.add("movie");
      movieDiv.style.backgroundImage = `url(${movie.poster_path})`;

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

  let currentPage = 0;
  let totalPages = Math.ceil(movieData.length / moviesPerPage);

  prevButton.addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
    } else {
      currentPage = totalPages - 1;
    }
    renderMovies(currentPage);
  });

  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages - 1) {
      currentPage++;
    } else {
      currentPage = 0;
    }
    renderMovies(currentPage);
  });

  renderMovies(currentPage);
};

const input = document.querySelector(".input");

input.addEventListener("keyup", async (event) => {
  try {
    if (event.key === "Enter") {
      const searchUrl = `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${input.value}`;
      const result = await axios.get(searchUrl);

      if (result.data.results.length > 0) {
        const movieData = result.data.results;
        initializePagination(movieData);
      } else {
        await loadPage();
      }

      input.value = "";
    }
  } catch (error) {
    console.log(error);
  }
});
