import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../../api/axios";

const STATUS_CONFIG = {
  CONFIRMED: { label: "Confirmada", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/25" },
  CANCELLED: { label: "Cancelada",  color: "text-red-400",     bg: "bg-red-400/10",     border: "border-red-400/25"     },
  PENDING:   { label: "Pendiente",  color: "text-[#FFB347]",   bg: "bg-[#FFB347]/10",   border: "border-[#FFB347]/25"   },
};

const formatPrice = (price) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(price || 0);

const formatDate = (str) => new Date(str).toLocaleDateString("es-CO", {
  day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
});

function AdminOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("ALL");

  useEffect(() => {
    // Usa el endpoint de usuario por ahora — si tienes endpoint admin úsalo aquí
    api.get("/api/orders?page=0&size=100")
      .then((r) => setOrders(r.data?.content || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Órdenes</h1>
          <p className="text-zinc-500 text-sm mt-1">{orders.length} órdenes en total</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["ALL", "PENDING", "CONFIRMED", "CANCELLED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition
              ${filter === s
                ? "bg-[#FF6B35]/20 border-[#FF6B35]/40 text-[#FF8C42]"
                : "bg-white/[0.03] border-white/[0.07] text-zinc-500 hover:border-white/20 hover:text-zinc-300"
              }`}
          >
            {s === "ALL" ? "Todas" : STATUS_CONFIG[s]?.label}
            <span className="ml-1.5 opacity-60">
              {s === "ALL" ? orders.length : orders.filter((o) => o.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-12 text-center">
          <p className="text-zinc-500">No hay órdenes para mostrar.</p>
        </div>
      ) : (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {["Orden", "Fecha", "Productos", "Total", "Estado"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const st = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                return (
                  <tr key={order.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition">
                    <td className="px-5 py-4">
                      <span className="text-white font-mono text-sm font-bold">#{order.id?.slice(0, 8).toUpperCase()}</span>
                    </td>
                    <td className="px-5 py-4 text-zinc-400 text-sm">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-4 text-zinc-400 text-sm">
                      {order.items?.length || 0} {order.items?.length === 1 ? "artículo" : "artículos"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[#FFB347] font-bold font-mono text-sm">{formatPrice(order.totalAmount)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${st.bg} ${st.border} ${st.color}`}>
                        {st.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminOrders;