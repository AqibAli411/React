import { useState,useEffect } from "react";

const KEY = "e7ec76ec";


export function useMovies(query){
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(
      function () {
        const controller = new AbortController();

        async function fetchMoviesData() {
          try {
            setIsLoading(true);

            const res = await fetch(
              `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
              { signal: controller.signal }
            );

            if (!res.ok) throw new Error(`network issues`);

            const data = await res.json();

            //then if data is false then it means that no moive was found...
            if (data.Response === "False") throw new Error("No movies found!");

            //now if data is recived the update the movies list
            setMovies(data.Search);
            setError("");
          } catch (err) {
            console.error(err);
            if (err.name !== "AbortError") setError(err.message);
          } finally {
            setIsLoading(false);
          }
        }

        if (query.length < 3) {
          setMovies([]);
          setError("");
          return;
        }

        //we can do a clean up on the movie details
        // handleResetSelection();
        fetchMoviesData();

        return function () {
          controller.abort();
        };
      },
      [query]
    );
    
    return { movies, isLoading, error };
}

