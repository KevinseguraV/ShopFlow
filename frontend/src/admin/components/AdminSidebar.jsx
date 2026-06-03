import { Link, useLocation } from "react-router-dom";

function AdminSidebar() {

  const location = useLocation();

  const linkClass = (path) =>
    `block px-4 py-3 rounded-xl transition ${
      location.pathname === path
        ? "bg-[#FF6B35]/20 text-[#FF8C42] border border-[#FF6B35]/30"
        : "text-zinc-400 hover:text-[#FF8C42] hover:bg-white/5"
    }`;

  return (
    <aside className="w-64 bg-white/5 border-r border-white/10 min-h-screen p-6">

      <h2 className="text-white text-2xl font-black mb-10">
        Admin
      </h2>

      <nav className="flex flex-col gap-2">

        <Link
          to="/admin"
          className={linkClass("/admin")}
        >
          Dashboard
        </Link>

        <Link
          to="/admin/products"
          className={linkClass("/admin/products")}
        >
          Productos
        </Link>

        <Link
          to="/admin/categories"
          className={linkClass("/admin/categories")}
        >
          Categorías
        </Link>

        <Link
          to="/admin/orders"
          className={linkClass("/admin/orders")}
        >
          Órdenes
        </Link>

      </nav>

    </aside>
  );
}

export default AdminSidebar;