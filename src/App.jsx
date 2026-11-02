import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { APP } from "./config/constants";
import HomePage from "./pages/HomePage";
import ViewPage from "./pages/ViewPage";

export default function App() {
  useEffect(() => {
    document.title = APP.documentTitle;
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/view/:code" element={<ViewPage />} />
    </Routes>
  );
}
