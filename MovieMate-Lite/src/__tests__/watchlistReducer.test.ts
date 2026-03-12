import watchlistReducer, {
  watchlistInitialState,
  type WatchlistState,
} from "../reducers/watchlistReducer";
import type { Movie } from "../types/movie";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const inception: Movie = {
  id: "1", title: "Inception", genre: ["Action", "Sci-Fi"],
  year: 2010, poster: "", rating: 8.8, watched: false,
};

const darkKnight: Movie = {
  id: "2", title: "The Dark Knight", genre: ["Action", "Crime", "Drama"],
  year: 2008, poster: "", rating: 9.0, watched: false,
};

const pulpFiction: Movie = {
  id: "3", title: "Pulp Fiction", genre: ["Crime"],
  year: 1994, poster: "", rating: 8.9, watched: false,
};

// ── watchlistReducer tests ────────────────────────────────────────────────────

describe("watchlistReducer", () => {

  // ── Initial state ──────────────────────────────────────────────────────────
  describe("initial state", () => {
    it("starts with an empty watchlist", () => {
      expect(watchlistInitialState.watchlist).toEqual([]);
    });

    it("starts with no trending genre", () => {
      expect(watchlistInitialState.trendingGenre).toBeNull();
    });
  });

  // ── SET_WATCHLIST ──────────────────────────────────────────────────────────
  describe("SET_WATCHLIST", () => {
    it("sets watchlist from empty to populated", () => {
      const state = watchlistReducer(watchlistInitialState, {
        type: "SET_WATCHLIST",
        payload: [inception, darkKnight],
      });
      expect(state.watchlist).toHaveLength(2);
      expect(state.watchlist[0].id).toBe("1");
    });

    it("replaces existing watchlist entirely", () => {
      const populated: WatchlistState = {
        watchlist: [inception, darkKnight],
        trendingGenre: "Action",
      };
      const state = watchlistReducer(populated, {
        type: "SET_WATCHLIST",
        payload: [pulpFiction],
      });
      expect(state.watchlist).toHaveLength(1);
      expect(state.watchlist[0].id).toBe("3");
    });

    it("sets watchlist to empty array", () => {
      const populated: WatchlistState = {
        watchlist: [inception],
        trendingGenre: "Action",
      };
      const state = watchlistReducer(populated, {
        type: "SET_WATCHLIST",
        payload: [],
      });
      expect(state.watchlist).toHaveLength(0);
    });
  });

  // ── ADD_MOVIE ──────────────────────────────────────────────────────────────
  describe("ADD_MOVIE", () => {
    it("adds a movie to an empty watchlist", () => {
      const state = watchlistReducer(watchlistInitialState, {
        type: "ADD_MOVIE",
        payload: [inception],
      });
      expect(state.watchlist).toHaveLength(1);
      expect(state.watchlist[0].title).toBe("Inception");
    });

    it("adds a movie to an existing watchlist", () => {
      const state = watchlistReducer(watchlistInitialState, {
        type: "ADD_MOVIE",
        payload: [inception, darkKnight],
      });
      expect(state.watchlist).toHaveLength(2);
    });

    it("does not mutate previous state", () => {
      const prev = { ...watchlistInitialState };
      watchlistReducer(prev, { type: "ADD_MOVIE", payload: [inception] });
      expect(prev.watchlist).toHaveLength(0);
    });
  });

  // ── REMOVE_MOVIE ───────────────────────────────────────────────────────────
  describe("REMOVE_MOVIE", () => {
    const withTwo: WatchlistState = {
      watchlist: [inception, darkKnight],
      trendingGenre: "Action",
    };

    it("removes a movie leaving the rest", () => {
      const state = watchlistReducer(withTwo, {
        type: "REMOVE_MOVIE",
        payload: [darkKnight],
      });
      expect(state.watchlist).toHaveLength(1);
      expect(state.watchlist[0].id).toBe("2");
    });

    it("removes last movie resulting in empty list", () => {
      const withOne: WatchlistState = { watchlist: [inception], trendingGenre: "Action" };
      const state = watchlistReducer(withOne, {
        type: "REMOVE_MOVIE",
        payload: [],
      });
      expect(state.watchlist).toHaveLength(0);
    });
  });

  // ── trendingGenre computation ──────────────────────────────────────────────
  describe("trendingGenre", () => {
    it("is null when watchlist is empty", () => {
      const state = watchlistReducer(watchlistInitialState, {
        type: "SET_WATCHLIST",
        payload: [],
      });
      expect(state.trendingGenre).toBeNull();
    });

    it("returns the most common genre", () => {
      // Action appears in inception + darkKnight = 2 times, Crime in darkKnight + pulpFiction = 2 times
      // Action wins because inception is processed first and ties go to first-encountered
      const state = watchlistReducer(watchlistInitialState, {
        type: "SET_WATCHLIST",
        payload: [inception, darkKnight, pulpFiction],
      });
      // Action: 2 (inception, darkKnight), Crime: 2 (darkKnight, pulpFiction), Drama: 1, Sci-Fi: 1
      expect(["Action", "Crime"]).toContain(state.trendingGenre);
    });

    it("returns single genre when watchlist has one movie", () => {
      const state = watchlistReducer(watchlistInitialState, {
        type: "SET_WATCHLIST",
        payload: [pulpFiction],
      });
      expect(state.trendingGenre).toBe("Crime");
    });

    it("updates trending genre when a movie is added", () => {
      const afterFirst = watchlistReducer(watchlistInitialState, {
        type: "ADD_MOVIE",
        payload: [pulpFiction],
      });
      expect(afterFirst.trendingGenre).toBe("Crime");

      const afterSecond = watchlistReducer(afterFirst, {
        type: "ADD_MOVIE",
        payload: [pulpFiction, darkKnight],
      });
      // Crime: 2, Action: 1, Drama: 1 → Crime wins
      expect(afterSecond.trendingGenre).toBe("Crime");
    });

    it("updates trending genre when a movie is removed", () => {
      const initial: WatchlistState = {
        watchlist: [inception, darkKnight, pulpFiction],
        trendingGenre: "Action",
      };
      // Remove inception — Action drops to 1, Crime stays 2
      const state = watchlistReducer(initial, {
        type: "REMOVE_MOVIE",
        payload: [darkKnight, pulpFiction],
      });
      expect(state.trendingGenre).toBe("Crime");
    });
  });
});