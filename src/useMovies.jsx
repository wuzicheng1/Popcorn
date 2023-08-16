import { useEffect, useState } from "react";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const KEY = "48324e4c";

  useEffect(() => {
    const controller = new AbortController();
    async function fecthMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("fetching failed"); // stop here if error

        const data = await res.json();

        if (data.Response === "False") throw new Error("Movie not found");

        setMovies(data.Search);
        setIsLoading(false);
        // console.log(data.Search);
      } catch (err) {
        // console.log(err.message);
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    // .then((res) => res.json())
    // .then((data) => console.log(data));
    //do not request if query is less than 3 letter
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    callback?.(); // optional chaining
    fecthMovies();

    return function () {
      controller.abort();
    };
  }, [query]);
  return { movies, error, isLoading, KEY };
}
