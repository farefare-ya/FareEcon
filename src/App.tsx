import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import InstrumentDetail from "@/pages/InstrumentDetail";
import NewsFeed from "@/pages/NewsFeed";
import Watchlist from "@/pages/Watchlist";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/instrument/:id" element={<InstrumentDetail />} />
          <Route path="/news" element={<NewsFeed />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
