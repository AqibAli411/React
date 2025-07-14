import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorage } from "./useLocalStorage";
import { useKey } from "./useKey";

const KEY = "e7ec76ec";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useLocalStorage([], "watched");
  const { movies, isLoading, error } = useMovies(query);

  const isWatched = watched.some((item) => item.imdbID === selectedId);

  function getWatchedRating() {
    //only executed when isWatched is ture and therefore movie must exist
    //so this variable is never undefined..
    return watched.find((item) => item.imdbID === selectedId).Rating;
  }

  function handleSelectedId(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleResetSelection() {
    setSelectedId(null);
  }

  function handleAdd(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((item) => item.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} onSetQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {!isLoading && !error ? (
            <MovieList movies={movies} handleSelectedId={handleSelectedId} />
          ) : isLoading ? (
            <Loading />
          ) : (
            <ErrorMessage message={error} />
          )}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              movies={movies}
              selectedId={selectedId}
              handleResetSelection={handleResetSelection}
              handleAdd={handleAdd}
              isWatched={isWatched}
              getWatchedRating={getWatchedRating}
              key={selectedId}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                handleDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, onSetQuery, onSetSelectedId }) {
  const inputEl = useRef(null);
  
  useKey(
    "Enter",
    function () {
      if (inputEl.current === document.activeElement) return;
      onSetQuery("");
      inputEl.current.focus();
    }
  );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => {
        onSetQuery(e.target.value);
      }}
      ref={inputEl}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Loading() {
  return <p className="loader"> Loading...</p>;
}

function ErrorMessage({ message }) {
  return <p className="error"> {message}</p>;
}

function MovieDetails({
  selectedId,
  handleResetSelection,
  handleAdd,
  isWatched,
  getWatchedRating,
}) {
  const [movie, setMovie] = useState({});
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const countRatingClikcs = useRef(0);

  //custom hook designed for handling key down events
  useKey("Escape", handleResetSelection);

  //to use ref we have to create a useEffect
  useEffect(
    function () {
      if (rating) countRatingClikcs.current += 1;
    },
    [rating]
  );

  function onSetRating(val) {
    setRating(val);
  }

  function handleAddClick() {
    const newMovie = {
      Poster: movie.Poster,
      imdbRating: Number(movie.imdbRating),
      Runtime: Number(movie.Runtime.split(" ")[0]),
      Rating: rating,
      Title: movie.Title,
      imdbID: movie.imdbID,
    };

    handleAdd(newMovie);
    handleResetSelection();
  }

  useEffect(
    function () {
      async function movieDetails() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
          );

          if (!res.ok) throw new Error(`network issues`);

          const data = await res.json();

          if (data.Response === "False") throw new Error("no movie found");

          setMovie(data);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
      movieDetails();
    },
    [selectedId]
  );

  function handleBackClick() {
    handleResetSelection();
    setMovie({ Title: "Default Title" }); // Now effect will run  }
  }

  useEffect(
    function () {
      if (!movie.Title) return;
      document.title = `movie | ${movie.Title}`;

      //as clean up function
      //Note that clean up functions run at the re-render and unmount of a component
      return function () {
        document.title = "usePopcorn";
      };
    },
    [movie]
  );

  // if the movie is already in the watched array then display its rating...
  // using some-> we can definetly check if it already exists if it exists

  return (
    <div className="details">
      {!isLoading ? (
        <>
          <header>
            <button className="btn-back" onClick={handleBackClick}>
              &larr;
            </button>
            <img src={movie.Poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>
                {movie.Released} &bull; {movie.Runtime}
              </p>
              <p>{movie.Genre}</p>
              <p>
                <span>⭐️</span>
                {movie.imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={onSetRating}
                  />
                  {rating > 0 && (
                    <button className="btn-add" onClick={handleAddClick}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p className="loading">
                  You have already rated this movie ⭐️ {getWatchedRating()}
                </p>
              )}
            </div>
            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>Starring {movie.Actors}</p>
            <p>Directed by {movie.Director}</p>
          </section>
        </>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, handleSelectedId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          handleSelectedId={handleSelectedId}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, handleSelectedId }) {
  return (
    <li onClick={() => handleSelectedId(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.Rating));
  const avgRuntime = average(watched.map((movie) => movie.Runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, handleDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          handleDeleteWatched={handleDeleteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, handleDeleteWatched }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.Rating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.Runtime} min</span>
        </p>
        <button
          class="btn-delete"
          onClick={() => handleDeleteWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}
