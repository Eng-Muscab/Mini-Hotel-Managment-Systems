import { Outlet, NavLink } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "🏠" },
  { to: "/rooms", label: "Rooms", icon: "🛏️" },
  { to: "/beds", label: "Beds", icon: "🧺" },
  { to: "/customers", label: "Customers", icon: "👤" },
  { to: "/bookings", label: "Bookings", icon: "🗓️" },
];

export default function DashboardLayout() {
  return (
    <div data-theme="corporate" className="min-h-screen">
      <div className="drawer lg:drawer-open">
        <input id="main-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <Navbar />
          <main className="p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
        <div className="drawer-side">
          <label htmlFor="main-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <aside className="menu p-4 w-72 min-h-full bg-base-200">
            <h1 className="text-xl font-bold mb-4">Hotel MS</h1>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-md ${
                        isActive ? "bg-primary text-primary-content" : "hover:bg-base-300"
                      }`
                    }
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
