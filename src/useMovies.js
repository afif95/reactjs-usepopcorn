import { useState, useEffect } from "react";

const KEY = "c5cba12f";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      callback?.();
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          let res;
          try {
            res = await fetch(
              `https://www.omdbapi.com/?apikey=${KEY}&s=${query}
          `,
              { signal: controller.signal }
            );
          } catch (e) {
            if (!res || !res.ok)
              throw new Error("Something went wrong with fetching movies.");
          }

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found.");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
    // adding callback in the dependency array will result in infinite calling
  );

  return { movies, isLoading, error };
}
