import { useState, useEffect } from "react";
import { CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSnackbar } from "notistack";

import Navbar from "./components/Navbar";
import SearchMovies from "./pages/SearchMovies";
import SavedMovies from "./pages/SavedMovies";

function App() {
  const [savedMovies, setSavedMovies] = useState([]);
  const [savedMoviesMap, setSavedMoviesMap] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const movies = JSON.parse(localStorage.getItem("savedMovies") || "[]");
    setSavedMovies(movies);
    const mmap = {};
    movies.forEach((sm) => {
      mmap[sm.imdbID] = true;
    });
    setSavedMoviesMap(mmap);
  }, [])

  const handleAddToList = (movie) => {
    const savedMovies = JSON.parse(localStorage.getItem("savedMovies") || "[]");
    const newSavedMovies = [movie, ...savedMovies];
    localStorage.setItem("savedMovies", JSON.stringify(newSavedMovies));
    setSavedMovies(newSavedMovies);
    const newMoviesMap = {
      ...savedMoviesMap,
      [movie.imdbID]: true
    };
    setSavedMoviesMap(newMoviesMap);
    enqueueSnackbar("Added movie to list");
  }

  const handleRemoveFromList = (id) => {
    const savedMovies = JSON.parse(localStorage.getItem("savedMovies") || "[]");
    const filteredMovies = savedMovies.filter((sm) => {
      return sm.imdbID !== id;
    });
    localStorage.setItem("savedMovies", JSON.stringify(filteredMovies));
    setSavedMovies(filteredMovies);
    const newMoviesMap = {
      ...savedMoviesMap,
      [id]: false
    };
    setSavedMoviesMap(newMoviesMap);
    enqueueSnackbar("Removed movie from list");
  }

  return (
    <BrowserRouter>
      <CssBaseline />
      <Navbar />
      <Routes>
        <Route path="/" element={<SearchMovies handleAddToList={handleAddToList} savedMoviesMap={savedMoviesMap} handleRemoveFromList={handleRemoveFromList} />} />
        <Route path="/saved-movies" element={<SavedMovies data={savedMovies} savedMoviesMap={savedMoviesMap} handleRemoveFromList={handleRemoveFromList} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
