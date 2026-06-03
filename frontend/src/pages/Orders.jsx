import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getOrdersRequest } from "../api/orderApi";

const STATUS_CONFIG = {
  CONFIRMED: {
    label: "Confirmada",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/25",
    dot: "bg-emerald-400",
    glow: "shadow-emerald-500/20",
  },
  CANCELLED: {
    label: "Cancelada",
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/25",
    dot: "bg-red-400",
    glow: "shadow-red-500/20",
  },
  PENDING: {
    label: "Pendiente",
    color: "text-[#FFB347]",
    bg: "bg-[#FFB347]/10",
    border: "border-[#FFB347]/25",
    dot: "bg-[#FFB347]",
    glow: "shadow-orange-500/20",
  },
};

const formatPrice = (price) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price || 0);

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return {
    date: d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
  };
};

function OrderCard({ order, onClick }) {
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
  const { date, time } = formatDate(order.createdAt);
  const itemCount = order.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <div
      onClick={onClick}
      className="group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] hover:border-white/[0.15] rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
      style={{ boxShadow: "0 0 0 0 transparent" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-mono uppercase tracking-widest">Orden</span>
            <span className="text-white font-bold font-mono text-sm tracking-wider">
              #{order.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>{date}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span>{time}</span>
          </div>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${status.bg} ${status.border} ${status.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
          {status.label}
        </div>
      </div>

      {/* Items preview */}
      <div className="flex flex-col gap-2 mb-5">
        {order.items?.slice(0, 2).map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-zinc-400 font-bold">
                {item.quantity}
              </span>
              <span className="text-zinc-300 text-sm truncate max-w-[220px]">{item.productName}</span>
            </div>
            <span className="text-zinc-400 text-sm font-mono">{formatPrice(item.totalPrice)}</span>
          </div>
        ))}
        {order.items?.length > 2 && (
          <p className="text-zinc-600 text-xs">+{order.items.length - 2} producto(s) más</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
        <span className="text-zinc-500 text-xs">{itemCount} {itemCount === 1 ? "artículo" : "artículos"}</span>
        <div className="flex items-center gap-3">
          <span className="bg-gradient-to-r from-[#FF6B35] to-[#FFB347] bg-clip-text text-transparent font-black text-lg">
            {formatPrice(order.totalAmount)}
          </span>
          <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors duration-200 text-xs">
            Ver detalle →
          </span>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
        <svg className="w-7 h-7 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h3 className="text-white font-bold text-lg mb-2">Sin órdenes aún</h3>
      <p className="text-zinc-500 text-sm mb-8 max-w-xs">Cuando realices una compra, tus órdenes aparecerán aquí.</p>
      <button
        onClick={() => navigate("/products")}
        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FFB347] text-white text-sm font-bold hover:opacity-90 transition-opacity"
      >
        Explorar productos
      </button>
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getOrdersRequest()
      .then((data) => setOrders(data.content || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const confirmed = orders.filter((o) => o.status === "CONFIRMED").length;
  const pending   = orders.filter((o) => o.status === "PENDING").length;
  const cancelled = orders.filter((o) => o.status === "CANCELLED").length;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-10 px-4">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white tracking-tight mb-1">Mis órdenes</h1>
          <p className="text-zinc-500 text-sm">Historial de todas tus compras</p>
        </div>

        {/* Stats — solo si hay órdenes */}
        {orders.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { label: "Confirmadas", value: confirmed, color: "text-emerald-400" },
              { label: "Pendientes",  value: pending,   color: "text-[#FFB347]"   },
              { label: "Canceladas",  value: cancelled, color: "text-red-400"     },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-center">
                <p className={`text-2xl font-black ${color}`}>{value}</p>
                <p className="text-zinc-500 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Lista */}
        {orders.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => navigate(`/orders/${order.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Orders;