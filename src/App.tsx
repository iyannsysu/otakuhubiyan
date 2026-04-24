import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/Home";
import SearchPage from "./pages/Search";
import AnimeDetail from "./pages/AnimeDetail";
import WatchPage from "./pages/Watch";
import GenresPage from "./pages/Genres";
import TopPage from "./pages/Top";
import SeasonalPage from "./pages/Seasonal";
import SchedulePage from "./pages/Schedule";
import CharactersPage from "./pages/Characters";
import CharacterDetail from "./pages/CharacterDetail";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="anime/:id" element={<AnimeDetail />} />
        <Route path="anime/:id/watch" element={<WatchPage />} />
        <Route path="genres" element={<GenresPage />} />
        <Route path="top" element={<TopPage />} />
        <Route path="seasonal" element={<SeasonalPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="characters" element={<CharactersPage />} />
        <Route path="characters/:id" element={<CharacterDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
