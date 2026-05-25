import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import HeroPage from "./pages/HeroPage";
import ReservePage from "./pages/ReservePage";
import AuthPage from "./pages/AuthPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="/reserve" element={<ReservePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/bookings" element={<MyBookingsPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  );
}