import React, { useEffect, useState } from "react";
import "./index.css";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [artists, setArtists] = useState([]);

  const BASE_URL = "https://api.themoviedb.org/3";

  // Função para buscar dados da API
  const fetchData = async (endpoint, setState) => {
    try {
      const response = await fetch(
        `${BASE_URL}`
      );
      const data = await response.json();
      setState(data.results);
    } catch (error) {
      console.error(`Erro ao buscar ${endpoint}:`, error);
    }
  };

  // UseEffect para carregar dados ao iniciar
  useEffect(() => {
    fetchData("movie/popular", setMovies);
    fetchData("tv/popular", setSeries);
    fetchData("person/popular", setArtists);
  }, []);

  return (
    <div className="app">
      <header>
        <h1>TMDB Explorer</h1>
      </header>

      {/* Seção de Filmes */}
      <section>
        <h2>Filmes Populares</h2>
        <div className="grid">
          {movies.map((movie) => (
            <div className="card" key={movie.id}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
              <h3>{movie.title}</h3>
              <p>⭐ {movie.vote_average}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Seção de Séries */}
      <section>
        <h2>Séries Populares</h2>
        <div className="grid">
          {series.map((tv) => (
            <div className="card" key={tv.id}>
              <img
                src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                alt={tv.name}
              />
              <h3>{tv.name}</h3>
              <p>⭐ {tv.vote_average}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Seção de Artistas */}
      <section>
        <h2>Artistas Populares</h2>
        <div className="grid">
          {artists.map((person) => (
            <div className="card" key={person.id}>
              <img
                src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                alt={person.name}
              />
              <h3>{person.name}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default App;
