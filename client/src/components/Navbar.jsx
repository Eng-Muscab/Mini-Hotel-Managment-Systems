import { useState, useEffect } from "react";

export default function Navbar() {

  // ✅ Theme switcher (light/dark)
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.querySelector("html").setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  return (
    <div className="navbar bg-base-100 border-b shadow-sm px-4">
      
      {/* Drawer menu for small screens */}
      <div className="flex-none lg:hidden">
        <label htmlFor="main-drawer" className="btn btn-ghost btn-square">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </label>
      </div>

      {/* Logo */}
      <div className="flex-1">
        <h1 className="text-xl font-bold tracking-wide">🏨 Hotel MS</h1>
      </div>

      {/* Search Bar */}
      <div className="form-control hidden md:flex">
        <input
          type="text"
          placeholder="Search..."
          className="input input-bordered input-sm w-48 lg:w-64"
        />
      </div>

      <div className="flex-none gap-2 ml-4">

        {/* Theme Toggle */}
        <button className="btn btn-ghost btn-sm" onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {/* Notification */}
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            🔔
            <span className="badge badge-sm indicator-item bg-primary text-white">3</span>
          </div>
        </button>

        {/* Profile Dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-9 rounded-full">
              <img
                alt="profile"
                src="https://i.pravatar.cc/150?img=32"
              />
            </div>
          </div>

          <ul tabIndex={0}
            className="menu dropdown-content bg-base-100 rounded-box w-48 mt-3 p-2 shadow z-[1]">
            <li><a>👤 Profile</a></li>
            <li><a>⚙️ Settings</a></li>
            <li><a className="text-red-500">🚪 Logout</a></li>
          </ul>
        </div>

      </div>
    </div>
  );
}
