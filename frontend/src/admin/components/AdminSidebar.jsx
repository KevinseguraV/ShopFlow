import { Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <aside className="w-64 bg-white/5 border-r border-white/10 min-h-screen p-6">

      <h2 className="text-white text-2xl font-black mb-10">
        Admin
      </h2>

      <nav className="flex flex-col gap-3">

        <Link
          to="/admin"
          className="text-zinc-400 hover:text-[#FF8C42]"
        >
          Dashboard
        </Link>

        <Link
          to="/admin/products"
          className="text-zinc-400 hover:text-[#FF8C42]"
        >
          Productos
        </Link>

      </nav>

    </aside>
  );
}

export default AdminSidebar;