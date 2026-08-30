import { Link, NavLink, useNavigate } from "react-router-dom";
import { Stethoscope, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/upload", label: "Scan Prescription" },
  { to: "/reminders", label: "Reminders" },
  { to: "/wellness", label: "Wellness" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-pine-100 bg-sand-50/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pine-700 text-sand-50">
            <Stethoscope size={18} />
          </span>
          <span className="font-display text-xl font-semibold text-pine-900">MedAI</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive ? "bg-pine-700 text-sand-50" : "text-pine-700 hover:bg-pine-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm font-medium text-pine-700 sm:block">Hi, {user.name?.split(" ")[0]}</span>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex items-center gap-1.5 rounded-full border border-pine-200 px-4 py-2 text-sm font-medium text-pine-700 transition hover:bg-pine-100"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </nav>
      <div className="flex gap-1 overflow-x-auto px-6 pb-3 md:hidden">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium ${
                isActive ? "bg-pine-700 text-sand-50" : "bg-pine-100 text-pine-700"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </header>
  );
};

export default Navbar;
