import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { getAdminProductsRequest, getCategoriesRequest, getInventoryRequest } from "../api/adminProductApi";
import { getOrdersRequest } from "../../api/orderApi";

function StatCard({ label, value, icon, accent = "orange", onClick }) {
  const accents = {
    orange: "from-[#FF6B35]/20 to-[#FFB347]/10 border-[#FF6B35]/20 text-[#FF8C42]",
    green:  "from-emerald-500/15 to-emerald-500/5 border-emerald-500/20 text-emerald-400",
    blue:   "from-blue-500/15 to-blue-500/5 border-blue-500/20 text-blue-400",
    purple: "from-purple-500/15 to-purple-500/5 border-purple-500/20 text-purple-400",
  };

  return (
    <div
      onClick={onClick}
      className={`bg-gradient-to-br ${accents[accent]} border rounded-2xl p-6 cursor-pointer hover:scale-[1.02] transition-transform duration-200`}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        {onClick && <span className="text-xs text-zinc-600 hover:text-zinc-400">Ver →</span>}
      </div>
      <p className="text-zinc-400 text-sm mb-1">{label}</p>
      <h2 className="text-4xl font-black text-white">{value ?? "—"}</h2>
    </div>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, inventory: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      getAdminProductsRequest(0, 1),
      getCategoriesRequest(),
      getOrdersRequest(),
      getInventoryRequest(),
    ]).then(([products, categories, orders, inventory]) => {
      setStats({
        products:   products.status   === "fulfilled" ? (products.value?.totalElements   ?? 0) : 0,
        categories: categories.status === "fulfilled" ? (categories.value?.length        ?? 0) : 0,
        orders:     orders.status     === "fulfilled" ? (orders.value?.totalElements     ?? orders.value?.content?.length ?? 0) : 0,
        inventory:  inventory.status  === "fulfilled" ? (inventory.value?.length         ?? 0) : 0,
      });
    }).finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white tracking-tight">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">Resumen general de ShopFlow</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="Productos"   value={stats.products}   icon="📦" accent="orange" onClick={() => navigate("/admin/products")} />
          <StatCard label="Categorías"  value={stats.categories} icon="🏷️" accent="blue"   onClick={() => navigate("/admin/categories")} />
          <StatCard label="Órdenes"     value={stats.orders}     icon="🛒" accent="green"  onClick={() => navigate("/admin/orders")} />
          <StatCard label="Inventario"  value={stats.inventory}  icon="🏪" accent="purple" />
        </div>
      )}

      {/* Accesos rápidos */}
      <div className="mt-10">
        <h2 className="text-white font-bold text-lg mb-4">Acciones rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/admin/products/new")}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FFB347] text-white font-bold text-sm hover:opacity-90 transition"
          >
            + Nuevo producto
          </button>
          <button
            onClick={() => navigate("/admin/categories")}
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 font-medium text-sm hover:bg-white/10 transition"
          >
            + Nueva categoría
          </button>
          <button
            onClick={() => navigate("/admin/inventory")}
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 font-medium text-sm hover:bg-white/10 transition"
          >
            Gestionar stock
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;