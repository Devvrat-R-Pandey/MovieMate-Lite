export interface Movie {
  id: string;        
  title: string;
  genre: string[];
  year: number;
  poster: string;
  rating?: number;
  watched?: boolean;
}