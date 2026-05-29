
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-2xl bg-black/20">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className="text-3xl font-black text-white tracking-tight"
        >
          Shop
          <span className="text-blue-400">
            Flow
          </span>
        </Link>

        {/* LINKS */}
        <div className="hidden md:flex items-center gap-8">

          <Link
            to="/"
            className="text-slate-300 hover:text-white transition"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="text-slate-300 hover:text-white transition"
          >
            Productos
          </Link>

          {user && (
            <>
              <Link
                to="/orders"
                className="text-slate-300 hover:text-white transition"
              >
                Órdenes
              </Link>

              <Link
                to="/cart"
                className="relative text-slate-300 hover:text-white transition"
              >
                <FaShoppingCart className="text-xl" />
              </Link>
            </>
          )}
        </div>

        {/* USER */}
        <div className="flex items-center gap-4">

          {user ? (
            <>
              <div className="hidden lg:flex items-center gap-3">

                <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-white font-bold">
                  {user.email?.charAt(0).toUpperCase()}
                </div>

                <div className="flex flex-col">
                  <span className="text-white text-sm font-medium">
                    {user.email}
                  </span>

                  <span className="text-slate-400 text-xs">
                    {user.role}
                  </span>
                </div>

              </div>

              <button
                onClick={handleLogout}
                className="bg-white/10 border border-white/10 hover:bg-white/20 transition text-white px-5 py-2 rounded-xl text-sm"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-300 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-xl text-sm font-medium shadow-lg shadow-blue-500/20"
              >
                Registrarse
              </Link>
            </>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;

