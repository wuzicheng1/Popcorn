import { useEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";
import StarRating from "./starRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useHook";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>Popcorn®</h1>
    </div>
  );
}

function NumResult({ movie }) {
  return (
    <p className="num-results">
      Found <strong>{movie.length}</strong> results
    </p>
  );
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);
  useKey("Enter", setQuery);
  // useEffect(() => {
  //   function callback(e) {
  //     if (document.activeElement === inputEl.current) return;

  //     if (e.code === "Enter") {
  //       inputEl.current.focus();
  //       setQuery("");
  //     }
  //   }

  //   document.addEventListener("keydown", callback);
  //   return () => document.removeEventListener("keydown", callback);
  // }, [setQuery]);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function Main({ children }) {
  return (
    <main className="main">
      {children}
      {/* <ListBox movie={movie} />
      <WatchBox /> */}
    </main>
  );
}

function MovieList({ movie, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movie?.map((movie) => (
        <Movie onSelectMovie={onSelectMovie} movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>📅</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = +average(
    watched.map((movie) => movie.imdbRating)
  ).toFixed(1);
  const avgUserRating = +average(
    watched.map((movie) => movie.userRating)
  ).toFixed(1);
  const avgRuntime = +average(watched.map((movie) => movie.runtime)).toFixed(1);

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
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen1] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen ? "-" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function WatchedMovieList({ watched, onDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} onDelete={onDelete} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDelete }) {
  // const handleAddWachted = function (movies) {
  //   setWatched((watched) => [...watched, movies]);
  // };
  const handleDelete = function () {
    onDelete(movie);
  };

  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime ? movie.runtime : 0} min</span>
        </p>
        <button className="btn-delete" onClick={handleDelete}>
          X
        </button>
      </div>
    </li>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [selectID, setSelectID] = useState(null);
  const { movies, isLoading, error, KEY } = useMovies(query, handleCloseDetail); //custom hook

  const [watched, setWatched] = useLocalStorageState([], "watched");

  // useMovies(query);

  const handleSelectMovie = function (id) {
    setSelectID(id);
  }; //not hoisted

  function handleCloseDetail() {
    setSelectID(null);
  } // hoisted due to function declaration

  const handleAddWachted = function (movies) {
    // localStorage.setItem("watched", JSON.stringify([...watched, movies]));
    setWatched((watched) => [...watched, movies]);
  };

  const handleDelete = function (movies) {
    setWatched((watched) =>
      watched.filter((watchedMovie) => watchedMovie.imdbID !== movies.imdbID)
    );
  };

  // useEffect(() => {
  //   localStorage.removeItem("watched");
  // }, [watched]);

  // const tempQuery = "interstellar";

  // useEffect(() => {}, []);

  //as watched changes, store that data inside "watched"

  return (
    <>
      <NavBar>
        <>
          <Logo />
          <Search query={query} setQuery={setQuery} />
          <NumResult movie={movies} />
        </>
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList
              selectID={selectID}
              onSelectMovie={handleSelectMovie}
              movie={movies}
            />
          )}
          {error && <ErrorMessage message={error} />}{" "}
        </Box>

        <Box>
          {selectID ? (
            <MovieDetail
              KEY={KEY}
              selectID={selectID}
              onCloseDetail={handleCloseDetail}
              onAddWatched={handleAddWachted}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} onDelete={handleDelete} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function MovieDetail({ selectID, onCloseDetail, onAddWatched, watched, KEY }) {
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState({}); //set as object as data is object
  const [userRating, setUserRating] = useState(0);

  const countClick = useRef(0);
  useEffect(() => {
    if (userRating) countClick.current++;
  }, [userRating]);

  const handleRating = function (rating) {
    setUserRating(rating);
  };

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
  } = movie;

  useEffect(() => {
    if (!title) return; //guard clause
    document.title = `Movie | ${title}`;
    return function () {
      document.title = "Popcorn";
    };
  }, [title]);

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectID}`
      );
      if (!res.ok) throw new Error("fetching failed");

      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    }
    getMovieDetails();
  }, [selectID, KEY]);

  const handleAdd = function () {
    const newWatchedMovie = {
      imdbID: selectID,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: parseFloat(runtime, 1),
      userRating,
      countRatingDecisions: countClick.current, //link to a ref data not triggering render
    };
    onAddWatched(newWatchedMovie);

    onCloseDetail();
  };

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseDetail}>
              &larr;
            </button>
            <img src={poster} alt={`${title}`}></img>

            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} · {runtime}
              </p>
            </div>
          </header>

          <section>
            {watched.some((watch) => watch.imdbID === selectID) || (
              <div className="rating">
                <StarRating
                  className="rating"
                  maxRating={10}
                  color="#fcc419"
                  size={24}
                  defaultRating={5}
                  onRatingChange={handleRating}
                ></StarRating>
                {userRating > 0 && (
                  <button className="btn-add" onClick={handleAdd}>
                    + ADD TO LIST
                  </button>
                )}
              </div>
            )}

            <p>
              <em>{plot} </em>
            </p>
            <p>Starring {actors === "N/A" ? "unknown actors" : actors}</p>
            <p>
              Directed by {director === "N/A" ? "unknown director" : director}
            </p>
          </section>
        </>
      )}
      {/* <img></img> */}
    </div>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>ERROR </span>
      {message}
    </p>
  );
}

//项目难点：处理
