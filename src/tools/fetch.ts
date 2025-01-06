import 'dotenv/config';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const db = require(join(__dirname, '../../db.json'));

const apiKey = process.env.TMDB_API_KEY;
const themoviedbOrigin = 'https://api.themoviedb.org';

fetchData();

async function fetchData() {
  await fetchTopRatedMovies();
  await fetchPopularMovies();
  await fetchHorrorMovies();
  // await fetchGenres();
}

async function saveData(fileName: string, data: unknown) {
  const filePath = join(__dirname, fileName);
  writeFileSync(filePath, JSON.stringify(data, null, 2));
}

async function fetchTopRatedMovies() {
  const movies = new Map<number, Movie>();
  const actors = new Map<number, Person>();
  const directors = new Map<number, Person>();

  const discoverMovie = `${themoviedbOrigin}/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&sort_by=vote_average.desc&vote_count.gte=1000&with_origin_country=US&with_original_language=en`;

  for (let page = 1; page <= 2; page++) {
    const url = `${discoverMovie}&page=${page}`;

    const rsp = await fetch(url);
    if (!rsp.ok) {
      throw new Error(
        `Failed to fetch top rated movies: ${rsp.status} ${rsp.statusText}`
      );
    }

    const data = await rsp.json();
    for (const movie of data.results) {
      await addMovieWithActorsAndDirectors(movie);
    }
  }

  // for (let page = 1; page <= 25; page += 20) {
  //   const url = `${discoverMovie}&with_genres=878&page=${page}`;

  //   const rsp = await fetch(url);
  //   if (!rsp.ok) {
  //     throw new Error(
  //       `Failed to fetch science fiction movies: ${rsp.status} ${rsp.statusText}`
  //     );
  //   }

  // const data = await rsp.json();
  // for (const movie of data.results) {
  //   await addMovieWithActorsAndDirectors(movie);
  // }
  // }

  db['top-rated-movies'] = Array.from(movies.values());
  await saveData('../../db.json', db);

  // await saveData('movies.json', Array.from(movies.values()));
  // await saveData('actors.json', Array.from(actors.values()));
  // await saveData('directors.json', Array.from(directors.values()));

  async function addMovieWithActorsAndDirectors(movie: Movie) {
    // const result = await fetchActorsAndDirectors(movie.id);
    // movie.actorIds = result.actors;
    // movie.directorIds = result.directors;
    movies.set(movie.id, movie);
  }

  async function fetchActorsAndDirectors(
    movieId: number
  ): Promise<{ actors: number[]; directors: number[] }> {
    const url = `${themoviedbOrigin}/3/movie/${movieId}/credits?api_key=${apiKey}`;
    const rsp = await fetch(url);
    if (!rsp.ok) {
      throw new Error(
        `Failed to fetch actors for movie ${movieId}: ${rsp.status} ${rsp.statusText}`
      );
    }
    const data = await rsp.json();
    const movieActors = data.cast
      .sort((a: Actor, b: Actor) => b.popularity - a.popularity)
      .slice(0, 5)
      .map((actor: Actor) => ({ id: actor.id, name: actor.name })); // Get top 5 actors

    movieActors.forEach((actor: Person) => {
      actors.set(actor.id, actor);
    });

    const movieDirectors = data.crew
      .filter((crewMember: any) => crewMember.job === 'Director')
      .map((director: Person) => ({ id: director.id, name: director.name })); // Get directors

    movieDirectors.forEach((director: Person) => {
      directors.set(director.id, director);
    });

    return {
      actors: movieActors.map((actor: { id: number }) => actor.id),
      directors: movieDirectors.map((director: { id: number }) => director.id),
    };
  }
}

async function fetchPopularMovies() {
  const movies = new Map<number, Movie>();
  const actors = new Map<number, Person>();
  const directors = new Map<number, Person>();

  const popularMoviesUrl = `${themoviedbOrigin}/3/movie/popular?api_key=${apiKey}&language=en-US`;

  for (let page = 1; page <= 2; page++) {
    const url = `${popularMoviesUrl}&page=${page}`;

    const rsp = await fetch(url);
    if (!rsp.ok) {
      throw new Error(
        `Failed to fetch top rated movies: ${rsp.status} ${rsp.statusText}`
      );
    }

    const data = await rsp.json();
    for (const movie of data.results) {
      await addMovieWithActorsAndDirectors(movie);
    }
  }

  // for (let page = 1; page <= 25; page += 20) {
  //   const url = `${discoverMovie}&with_genres=878&page=${page}`;

  //   const rsp = await fetch(url);
  //   if (!rsp.ok) {
  //     throw new Error(
  //       `Failed to fetch science fiction movies: ${rsp.status} ${rsp.statusText}`
  //     );
  //   }

  // const data = await rsp.json();
  // for (const movie of data.results) {
  //   await addMovieWithActorsAndDirectors(movie);
  // }
  // }

  db['popular-movies'] = Array.from(movies.values());
  await saveData('../../db.json', db);

  // await saveData('movies.json', Array.from(movies.values()));
  // await saveData('actors.json', Array.from(actors.values()));
  // await saveData('directors.json', Array.from(directors.values()));

  async function addMovieWithActorsAndDirectors(movie: Movie) {
    // const result = await fetchActorsAndDirectors(movie.id);
    // movie.actorIds = result.actors;
    // movie.directorIds = result.directors;
    movies.set(movie.id, movie);
  }

  async function fetchActorsAndDirectors(
    movieId: number
  ): Promise<{ actors: number[]; directors: number[] }> {
    const url = `${themoviedbOrigin}/3/movie/${movieId}/credits?api_key=${apiKey}`;
    const rsp = await fetch(url);
    if (!rsp.ok) {
      throw new Error(
        `Failed to fetch actors for movie ${movieId}: ${rsp.status} ${rsp.statusText}`
      );
    }
    const data = await rsp.json();
    const movieActors = data.cast
      .sort((a: Actor, b: Actor) => b.popularity - a.popularity)
      .slice(0, 5)
      .map((actor: Actor) => ({ id: actor.id, name: actor.name })); // Get top 5 actors

    movieActors.forEach((actor: Person) => {
      actors.set(actor.id, actor);
    });

    const movieDirectors = data.crew
      .filter((crewMember: any) => crewMember.job === 'Director')
      .map((director: Person) => ({ id: director.id, name: director.name })); // Get directors

    movieDirectors.forEach((director: Person) => {
      directors.set(director.id, director);
    });

    return {
      actors: movieActors.map((actor: { id: number }) => actor.id),
      directors: movieDirectors.map((director: { id: number }) => director.id),
    };
  }
}

async function fetchHorrorMovies() {
  const movies = new Map<number, Movie>();
  const actors = new Map<number, Person>();
  const directors = new Map<number, Person>();

  const horrorMoviesUrl = `${themoviedbOrigin}/3/discover/movie?api_key=${apiKey}&language=en-US&with_genres=27&sort_by=vote_average.desc&vote_count.gte=1000&`;

  for (let page = 1; page <= 2; page++) {
    const url = `${horrorMoviesUrl}&page=${page}`;

    const rsp = await fetch(url);
    if (!rsp.ok) {
      throw new Error(
        `Failed to fetch horror movies: ${rsp.status} ${rsp.statusText}`
      );
    }

    const data = await rsp.json();
    for (const movie of data.results) {
      await addMovieWithActorsAndDirectors(movie);
    }
  }

  // for (let page = 1; page <= 25; page += 20) {
  //   const url = `${discoverMovie}&with_genres=878&page=${page}`;

  //   const rsp = await fetch(url);
  //   if (!rsp.ok) {
  //     throw new Error(
  //       `Failed to fetch science fiction movies: ${rsp.status} ${rsp.statusText}`
  //     );
  //   }

  // const data = await rsp.json();
  // for (const movie of data.results) {
  //   await addMovieWithActorsAndDirectors(movie);
  // }
  // }

  db['horror-movies'] = Array.from(movies.values()).sort((a, b) =>
    a.title.localeCompare(b.title)
  );
  await saveData('../../db.json', db);

  // await saveData('movies.json', Array.from(movies.values()));
  // await saveData('actors.json', Array.from(actors.values()));
  // await saveData('directors.json', Array.from(directors.values()));

  async function addMovieWithActorsAndDirectors(movie: Movie) {
    // const result = await fetchActorsAndDirectors(movie.id);
    // movie.actorIds = result.actors;
    // movie.directorIds = result.directors;
    movies.set(movie.id, movie);
  }
}

async function fetchGenres() {
  const movieBase = `${themoviedbOrigin}/3/genre`;
  const url = `${movieBase}/movie/list?api_key=${apiKey}&language=en-US`;

  const rsp = await fetch(url);
  if (!rsp.ok) {
    throw new Error(`Failed to fetch genres: ${rsp.status} ${rsp.statusText}`);
  }

  const data = await rsp.json();

  // await saveData('genres.json', data.genres);
}
interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface Actor {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

interface Person {
  id: number;
  name: string;
}
