import axios from "axios";
import type { Movie } from "../types/movie";

// This is the URL json-server runs on by default
const API_URL = "http://localhost:3001";

export const fetchMovies = async (): Promise<Movie[]> => {
  const response = await axios.get<Movie[]>(`${API_URL}/movies`);
  return response.data;
};

export const addMovie = async (movie: Omit<Movie, "id">): Promise<Movie> => {
  const response = await axios.post<Movie>(`${API_URL}/movies`, movie);
  return response.data;
};

export const deleteMovie = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/movies/${id}`);
};