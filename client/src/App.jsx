import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import RoomsList from "./pages/rooms/RoomsList.jsx";
import BedsList from "./pages/beds/BedsList.jsx";
import CustomersList from "./pages/customers/CustomersList.jsx";
import BookingsList from "./pages/bookings/BookingsList.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rooms" element={<RoomsList />} />
        <Route path="/beds" element={<BedsList />} />
        <Route path="/customers" element={<CustomersList />} />
        <Route path="/bookings" element={<BookingsList />} />
      </Route>
    </Routes>
  );
}
