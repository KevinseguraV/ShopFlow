import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getOrderByIdRequest } from "../api/orderApi";

const STATUS_CONFIG = {
  CONFIRMED: {
    label: "Confirmada",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/25",
    dot: "bg-emerald-400",
    description: "Tu pago fue procesado exitosamente.",
  },
  CANCELLED: {
    label: "Cancelada",
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/25",
    dot: "bg-red-400",
    description: "El pago no pudo ser procesado.",
  },
  PENDING: {
    label: "Pendiente",
    color: "text-[#FFB347]",
    bg: "bg-[#FFB347]/10",
    border: "border-[#FFB347]/25",
    dot: "bg-[#FFB347]",
    description: "Tu orden está siendo procesada.",
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
  return d.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* ── Timeline de estados ── */
const STEPS = ["PENDING", "CONFIRMED"];

function StatusTimeline({ current }) {
  if (current === "CANCELLED") {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-400/5 border border-red-400/15 rounded-xl">
        <div className="w-8 h-8 rounded-full bg-red-400/15 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div>
          <p className="text-red-400 font-semibold text-sm">Orden cancelada</p>
          <p className="text-red-400/60 text-xs">El pago fue rechazado por el sistema.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, idx) => {
        const isActive  = step === current;
        const isDone    = STEPS.indexOf(current) > idx;
        const isLast    = idx === STEPS.length - 1;
        const label     = step === "PENDING" ? "Pendiente" : "Confirmada";

        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                  ${isDone || isActive
                    ? "border-[#FF6B35] bg-gradient-to-br from-[#FF6B35] to-[#FFB347]"
                    : "border-white/15 bg-white/5"
                  }`}
              >
                {isDone ? (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className={`w-2 h-2 rounded-full ${isActive ? "bg-white" : "bg-white/20"}`} />
                )}
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap ${isActive || isDone ? "text-white" : "text-zinc-600"}`}>
                {label}
              </span>
            </div>
            {!isLast && (
              <div className={`h-[2px] flex-1 mx-2 mb-4 rounded-full transition-all ${isDone ? "bg-gradient-to-r from-[#FF6B35] to-[#FFB347]" : "bg-white/10"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Sección con título ── */
function Section({ title, children }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">{title}</h3>
      {children}
    </div>
  );
}

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(false);

  useEffect(() => {
    getOrderByIdRequest(id)
      .then(setOrder)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (error || !order) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto py-16 px-4 text-center">
          <p className="text-zinc-500 mb-6">No se encontró la orden.</p>
          <button
            onClick={() => navigate("/orders")}
            className="px-5 py-2 rounded-xl border border-white/10 text-zinc-300 text-sm hover:bg-white/5 transition"
          >
            ← Volver a órdenes
          </button>
        </div>
      </MainLayout>
    );
  }

  const status   = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
  const subtotal = order.items?.reduce((s, i) => s + i.totalPrice, 0) || 0;
  const shipping = 0; // mock — podría venir del backend

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-10 px-4">

        {/* Back */}
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 text-zinc-500 hover:text-white text-sm mb-8 transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Mis órdenes
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-zinc-500 text-sm">Orden</span>
              <span className="text-white font-black font-mono text-lg tracking-wider">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <p className="text-zinc-500 text-sm capitalize">{formatDate(order.createdAt)}</p>
          </div>
          <div className={`self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${status.bg} ${status.border} ${status.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${order.status === "PENDING" ? "animate-pulse" : ""}`} />
            {status.label}
          </div>
        </div>

        <div className="flex flex-col gap-4">

          {/* Timeline */}
          <Section title="Estado de la orden">
            <StatusTimeline current={order.status} />
            <p className="text-zinc-500 text-xs mt-4">{status.description}</p>
          </Section>

          {/* Productos */}
          <Section title={`Productos · ${order.items?.length || 0} ${order.items?.length === 1 ? "artículo" : "artículos"}`}>
            <div className="flex flex-col gap-3">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Quantity badge */}
                    <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-zinc-300">
                      {item.quantity}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{item.productName}</p>
                      <p className="text-zinc-500 text-xs">{formatPrice(item.unitPrice)} c/u</p>
                    </div>
                  </div>
                  <span className="text-zinc-300 text-sm font-mono flex-shrink-0">{formatPrice(item.totalPrice)}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Dirección */}
          {order.shippingAddress && (
            <Section title="Dirección de envío">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="text-zinc-300 text-sm leading-relaxed">
                  <p>{order.shippingAddress.street}</p>
                  {order.shippingAddress.city && (
                    <p className="text-zinc-500">{order.shippingAddress.city}{order.shippingAddress.country ? `, ${order.shippingAddress.country}` : ""}</p>
                  )}
                </div>
              </div>
            </Section>
          )}

          {/* Resumen de pago */}
          <Section title="Resumen de pago">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Subtotal</span>
                <span className="text-zinc-300 font-mono">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Envío</span>
                <span className="text-emerald-400 text-sm font-medium">Gratis</span>
              </div>
              <div className="border-t border-white/[0.07] my-1" />
              <div className="flex justify-between items-center">
                <span className="text-white font-bold">Total</span>
                <span className="bg-gradient-to-r from-[#FF6B35] to-[#FFB347] bg-clip-text text-transparent font-black text-xl">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </Section>

        </div>

        {/* CTA bottom */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FFB347] text-white text-sm font-bold hover:opacity-90 transition-opacity"
          >
            Seguir comprando
          </button>
        </div>

      </div>
    </MainLayout>
  );
}

export default OrderDetail;