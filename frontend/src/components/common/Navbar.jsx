import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/shopflow-logo.png";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/">
          <img
            src={logo}
            alt="ShopFlow"
            className="h-30 w-auto object-contain"
          />
        </Link>

        {/* LINKS */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-zinc-400 hover:text-[#FF8C42] transition font-medium"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="text-zinc-400 hover:text-[#FF8C42] transition font-medium"
          >
            Productos
          </Link>

          {user?.role === "ADMIN" && (
            <Link
              to="/admin"
              className="text-zinc-400 hover:text-[#FF8C42] transition font-medium"
            >
              Admin
            </Link>
          )}

          {user && (
            <>
              <Link
                to="/orders"
                className="text-zinc-400 hover:text-[#FF8C42] transition font-medium"
              >
                Órdenes
              </Link>

              <Link
                to="/cart"
                className="relative text-zinc-400 hover:text-[#FF8C42] transition"
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
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFB347] flex items-center justify-center text-black font-bold text-sm">
                  {user.email?.charAt(0).toUpperCase()}
                </div>

                <div className="flex flex-col">
                  <span className="text-white text-sm font-medium">
                    {user.email}
                  </span>

                  <span className="text-zinc-500 text-xs uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="border border-white/10 hover:border-[#FF6B35]/50 hover:text-[#FF8C42] transition text-zinc-400 px-5 py-2 rounded-xl text-sm"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-zinc-400 hover:text-[#FF8C42] transition font-medium"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-gradient-to-r from-[#FF6B35] to-[#FFB347] hover:opacity-90 transition text-black font-bold px-5 py-2 rounded-xl text-sm shadow-lg shadow-[#FF6B35]/20"
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