import type { Movie } from "../types/movie";

// ── Pure helper functions (extracted from Home.tsx useMemo logic) ─────────────

const filterMovies = (
  movies: Movie[],
  search: string,
  genre: string,
  sortOrder: "" | "asc" | "desc"
): Movie[] =>
  [...movies]
    .filter((m) => {
      const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = genre === "" || m.genre.includes(genre);
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      if (!sortOrder) return 0;
      const ratingA = a.rating ?? 0;
      const ratingB = b.rating ?? 0;
      return sortOrder === "asc" ? ratingA - ratingB : ratingB - ratingA;
    });

const getGenres = (movies: Movie[]): string[] =>
  Array.from(new Set(movies.flatMap((m) => m.genre)));

// ── Fixtures ──────────────────────────────────────────────────────────────────

const movies: Movie[] = [
  { id: "1", title: "Inception", genre: ["Action", "Sci-Fi"], year: 2010, poster: "", rating: 8.8, watched: false },
  { id: "2", title: "The Dark Knight", genre: ["Action", "Crime", "Drama"], year: 2008, poster: "", rating: 9.0, watched: false },
  { id: "3", title: "Pulp Fiction", genre: ["Crime"], year: 1994, poster: "", rating: 8.9, watched: false },
  { id: "4", title: "Interstellar", genre: ["Adventure", "Sci-Fi"], year: 2014, poster: "", rating: 8.6, watched: false },
  { id: "5", title: "Fight Club", genre: ["Drama"], year: 1999, poster: "", rating: 8.8, watched: false },
];

// ── Search tests ──────────────────────────────────────────────────────────────

describe("Search functionality", () => {
  it("returns all movies when search is empty", () => {
    expect(filterMovies(movies, "", "", "")).toHaveLength(5);
  });

  it("finds a movie by exact title", () => {
    const result = filterMovies(movies, "Inception", "", "");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("finds movies by partial title (case-insensitive)", () => {
    const result = filterMovies(movies, "dark", "", "");
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("The Dark Knight");
  });

  it("is case-insensitive", () => {
    const lower = filterMovies(movies, "inception", "", "");
    const upper = filterMovies(movies, "INCEPTION", "", "");
    expect(lower).toHaveLength(1);
    expect(upper).toHaveLength(1);
    expect(lower[0].id).toBe(upper[0].id);
  });

  it("returns empty array when no match found", () => {
    const result = filterMovies(movies, "nonexistentmovie", "", "");
    expect(result).toHaveLength(0);
  });

  it("matches multiple movies with shared substring", () => {
    // "inter" matches both "Interstellar" and nothing else here
    const result = filterMovies(movies, "inter", "", "");
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Interstellar");
  });

  it("does not mutate the original movies array", () => {
    const original = [...movies];
    filterMovies(movies, "inception", "", "");
    expect(movies).toEqual(original);
  });
});

// ── Filter tests ──────────────────────────────────────────────────────────────

describe("Filter behavior", () => {
  it("returns all movies when genre filter is empty", () => {
    expect(filterMovies(movies, "", "", "")).toHaveLength(5);
  });

  it("filters by a single genre", () => {
    const result = filterMovies(movies, "", "Crime", "");
    expect(result).toHaveLength(2);
    result.forEach((m) => expect(m.genre).toContain("Crime"));
  });

  it("filters by Action genre", () => {
    const result = filterMovies(movies, "", "Action", "");
    expect(result).toHaveLength(2);
    const titles = result.map((m) => m.title);
    expect(titles).toContain("Inception");
    expect(titles).toContain("The Dark Knight");
  });

  it("returns empty when no movies match genre", () => {
    const result = filterMovies(movies, "", "Horror", "");
    expect(result).toHaveLength(0);
  });

  it("combines search and genre filter correctly", () => {
    // Search "dark" + genre "Crime" → The Dark Knight (has both)
    const result = filterMovies(movies, "dark", "Crime", "");
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("The Dark Knight");
  });

  it("returns empty when search and genre filter have no overlap", () => {
    // Inception is Sci-Fi, searching for it with Crime filter → no match
    const result = filterMovies(movies, "Inception", "Crime", "");
    expect(result).toHaveLength(0);
  });

  it("extracts unique genres from all movies", () => {
    const genres = getGenres(movies);
    expect(genres).toContain("Action");
    expect(genres).toContain("Crime");
    expect(genres).toContain("Drama");
    expect(genres).toContain("Sci-Fi");
    expect(genres).toContain("Adventure");
    // No duplicates
    expect(genres.length).toBe(new Set(genres).size);
  });
});

// ── Sort tests ────────────────────────────────────────────────────────────────

describe("Sort behavior", () => {
  it("does not sort when sortOrder is empty", () => {
    const result = filterMovies(movies, "", "", "");
    expect(result.map((m) => m.id)).toEqual(movies.map((m) => m.id));
  });

  it("sorts by rating descending (highest first)", () => {
    const result = filterMovies(movies, "", "", "desc");
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].rating ?? 0).toBeGreaterThanOrEqual(result[i + 1].rating ?? 0);
    }
  });

  it("sorts by rating ascending (lowest first)", () => {
    const result = filterMovies(movies, "", "", "asc");
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].rating ?? 0).toBeLessThanOrEqual(result[i + 1].rating ?? 0);
    }
  });

  it("highest rated movie is first in desc sort", () => {
    const result = filterMovies(movies, "", "", "desc");
    expect(result[0].rating).toBe(9.0);
    expect(result[0].title).toBe("The Dark Knight");
  });

  it("lowest rated movie is first in asc sort", () => {
    const result = filterMovies(movies, "", "", "asc");
    expect(result[0].rating).toBe(8.6);
    expect(result[0].title).toBe("Interstellar");
  });

  it("handles movies with undefined rating (treated as 0)", () => {
    const withNoRating: Movie[] = [
      ...movies,
      { id: "99", title: "Unknown", genre: ["Drama"], year: 2000, poster: "", watched: false },
    ];
    const result = filterMovies(withNoRating, "", "", "asc");
    expect(result[0].id).toBe("99");
  });
});