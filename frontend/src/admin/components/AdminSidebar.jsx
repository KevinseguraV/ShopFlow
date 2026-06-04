import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function AdminSidebar() {
  const location = useNavigate ? useLocation() : { pathname: "" };
  const { logout } = useContext(AuthContext);

  const links = [
    { to: "/admin",            label: "Dashboard",  icon: "▪" },
    { to: "/admin/products",   label: "Productos",  icon: "▪" },
    { to: "/admin/categories", label: "Categorías", icon: "▪" },
    { to: "/admin/inventory",  label: "Inventario", icon: "▪" },
    { to: "/admin/orders",     label: "Órdenes",    icon: "▪" },
  ];

  const isActive = (path) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path);

  return (
    <aside className="w-56 bg-white/[0.02] border-r border-white/[0.07] min-h-screen p-5 flex flex-col">
      {/* Brand */}
      <div className="mb-8">
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Panel</p>
        <h2 className="text-white text-xl font-black">Admin</h2>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
              ${isActive(to)
                ? "bg-[#FF6B35]/15 text-[#FF8C42] border border-[#FF6B35]/20"
                : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
              }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive(to) ? "bg-[#FF6B35]" : "bg-zinc-700"}`} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="pt-4 border-t border-white/[0.07]">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-600 hover:text-zinc-300 text-xs transition"
        >
          ← Ver tienda
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-600 hover:text-red-400 text-xs transition text-left"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;