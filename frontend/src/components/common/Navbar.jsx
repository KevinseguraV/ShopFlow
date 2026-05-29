import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="border-b border-white/10 backdrop-blur-md bg-black/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link to="/" className="text-2xl font-bold text-white">
          ShopFlow
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-slate-300 hover:text-white transition-colors">
            Home
          </Link>

          <Link to="/products" className="text-slate-300 hover:text-white transition-colors">
            Productos
          </Link>

          {user ? (
            <>
              <Link to="/cart" className="text-slate-300 hover:text-white transition-colors">
                Carrito
              </Link>

              <Link to="/orders" className="text-slate-300 hover:text-white transition-colors">
                Mis órdenes
              </Link>

              <div className="flex items-center gap-3">
                <span className="text-slate-300 text-sm">
                  {user.email}
                </span>
                {user.role === "ADMIN" && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    Admin
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-white/10 border border-white/20 hover:bg-white/20 transition text-white px-4 py-2 rounded-xl text-sm"
                >
                  Salir
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-xl text-sm font-medium"
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