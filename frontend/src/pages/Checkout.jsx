import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getCartRequest, clearCartRequest } from "../api/cartApi";
import { createOrderRequest } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";

const formatPrice = (price) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price || 0);

function CheckIcon({ className = "" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function StepBar({ step }) {
  const steps = ["Carrito", "Dirección", "Confirmar"];
  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {steps.map((label, idx) => {
        const num      = idx + 1;
        const isActive = num === step;
        const isDone   = num < step;
        const isLast   = idx === steps.length - 1;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all duration-300
                ${isDone   ? "bg-gradient-to-br from-[#FF6B35] to-[#FFB347] border-transparent text-white" : ""}
                ${isActive ? "border-[#FF6B35] text-[#FF6B35] bg-transparent" : ""}
                ${!isActive && !isDone ? "border-white/15 text-zinc-600 bg-transparent" : ""}
              `}>
                {isDone ? <CheckIcon className="w-3.5 h-3.5" /> : num}
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap tracking-wide
                ${isActive ? "text-white" : isDone ? "text-[#FFB347]" : "text-zinc-600"}`}>
                {label}
              </span>
            </div>
            {!isLast && (
              <div className={`w-16 sm:w-24 h-[2px] mx-2 mb-5 rounded-full transition-all duration-500
                ${isDone ? "bg-gradient-to-r from-[#FF6B35] to-[#FFB347]" : "bg-white/10"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FloatingField({ label, value, onChange, error, rows = 1, placeholder = "" }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.trim().length > 0;
  const isUp     = focused || hasValue;

  const baseClass = `w-full bg-white/[0.04] border rounded-xl px-4 text-white placeholder-transparent outline-none transition-all duration-200 resize-none
    ${error
      ? "border-red-500/50 focus:border-red-500"
      : focused
        ? "border-[#FF6B35]/60 shadow-[0_0_0_3px_rgba(255,107,53,0.08)]"
        : "border-white/[0.08] hover:border-white/20"
    }`;

  return (
    <div className="relative">
      <label className={`absolute left-4 pointer-events-none transition-all duration-200 font-medium
        ${isUp
          ? "top-2 text-[10px] tracking-widest uppercase " + (error ? "text-red-400" : focused ? "text-[#FF6B35]" : "text-zinc-500")
          : "top-1/2 -translate-y-1/2 text-sm text-zinc-500"
        } ${rows > 1 && !isUp ? "top-4 translate-y-0" : ""}`}>
        {label}
      </label>

      {rows > 1 ? (
        <textarea
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`${baseClass} pt-6 pb-3`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`${baseClass} pt-5 pb-2 h-14`}
        />
      )}

      {error && (
        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

function SummaryItem({ item }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/[0.05] last:border-0">
      <div className="w-7 h-7 flex-shrink-0 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-[11px] font-bold text-zinc-300">
        {item.quantity}
      </div>
      <span className="text-zinc-300 text-sm flex-1 truncate">{item.productName}</span>
      <span className="text-zinc-300 text-sm font-mono flex-shrink-0">{formatPrice(item.subtotal)}</span>
    </div>
  );
}

function ErrorToast({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-red-500/10 border border-red-500/30 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-2xl">
      <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
      <span className="text-red-300 text-sm font-medium">{message}</span>
      <button onClick={onClose} className="text-red-400/60 hover:text-red-300 ml-2 text-lg leading-none">&times;</button>
    </div>
  );
}

function SuccessOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFB347] flex items-center justify-center shadow-[0_0_40px_rgba(255,107,53,0.4)]">
          <CheckIcon className="w-8 h-8 text-white" />
        </div>
        <p className="text-white font-black text-xl">¡Orden creada!</p>
        <p className="text-zinc-400 text-sm">Redirigiendo...</p>
      </div>
    </div>
  );
}

function Checkout() {
  const navigate    = useNavigate();
  const { user }    = useAuth();

  const [cart, setCart]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [creating, setCreating]       = useState(false);
  const [success, setSuccess]         = useState(false);
  const [globalError, setGlobalError] = useState("");

  const [street, setStreet] = useState("");
  const [city,   setCity]   = useState("");
  const [notes,  setNotes]  = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getCartRequest()
      .then(setCart)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const validate = () => {
    const e = {};
    if (!street.trim()) e.street = "La dirección es obligatoria";
    if (!city.trim())   e.city   = "La ciudad es obligatoria";
    return e;
  };

  const handleCheckout = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});

    try {
      setCreating(true);
      const shippingAddress = `${street.trim()}, ${city.trim()}${notes.trim() ? ` — ${notes.trim()}` : ""}`;

      const payload = {
        shippingAddress,
        userEmail: user?.email || "",
        items: cart.items.map((item) => ({
          productId:   item.productId,
          productName: item.productName,
          variantId:   item.variantId || "default",
          quantity:    item.quantity,
          unitPrice:   Number(item.unitPrice),
        })),
      };

      const order = await createOrderRequest(payload);
      await clearCartRequest();
      setSuccess(true);
      setTimeout(() => navigate("/orders", { state: { success: true, orderId: order.id } }), 1800);
    } catch (err) {
      console.error(err);
      setGlobalError("No se pudo crear la orden. Intenta de nuevo.");
    } finally {
      setCreating(false);
    }
  };

  const subtotal  = cart?.totalPrice || 0;
  const itemCount = cart?.items?.reduce((s, i) => s + i.quantity, 0) || 0;

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
      {success && <SuccessOverlay />}
      <ErrorToast message={globalError} onClose={() => setGlobalError("")} />

      <div className="max-w-5xl mx-auto py-10 px-4">
        <StepBar step={2} />

        <div className="mb-8">
          <h1 className="text-4xl font-black text-white tracking-tight">Finalizar compra</h1>
          <p className="text-zinc-500 text-sm mt-1">Completa tu dirección para confirmar el pedido</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

          {/* Formulario */}
          <div className="flex flex-col gap-4">
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#FF6B35]/15 border border-[#FF6B35]/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#FF6B35]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-white font-bold text-lg">Dirección de envío</h2>
              </div>
              <div className="flex flex-col gap-4">
                <FloatingField
                  label="Calle y número"
                  value={street}
                  onChange={(e) => { setStreet(e.target.value); setErrors((p) => ({ ...p, street: "" })); }}
                  error={errors.street}
                />
                <FloatingField
                  label="Ciudad"
                  value={city}
                  onChange={(e) => { setCity(e.target.value); setErrors((p) => ({ ...p, city: "" })); }}
                  error={errors.city}
                />
                <FloatingField
                  label="Notas adicionales (opcional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-white font-bold text-lg">Pago seguro</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Pago simulado", "Sin datos reales", "Procesamiento automático"].map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 sticky top-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold text-lg">Resumen</h2>
              <span className="text-xs text-zinc-500 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                {itemCount} {itemCount === 1 ? "artículo" : "artículos"}
              </span>
            </div>

            <div className="mb-5">
              {cart?.items?.map((item) => (
                <SummaryItem key={item.productId} item={item} />
              ))}
            </div>

            <div className="flex flex-col gap-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Subtotal</span>
                <span className="text-zinc-300 font-mono">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Envío</span>
                <span className="text-emerald-400 font-medium">Gratis</span>
              </div>
              <div className="h-px bg-white/[0.07] my-1" />
              <div className="flex justify-between items-center">
                <span className="text-white font-black text-lg">Total</span>
                <span className="bg-gradient-to-r from-[#FF6B35] to-[#FFB347] bg-clip-text text-transparent font-black text-2xl">
                  {formatPrice(subtotal)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={creating || success}
              className="relative w-full overflow-hidden rounded-xl py-4 font-black text-base transition-all duration-200
                bg-gradient-to-r from-[#FF6B35] to-[#FFB347]
                hover:opacity-90 hover:shadow-[0_8px_30px_rgba(255,107,53,0.35)]
                active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                text-white"
            >
              {creating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Procesando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Confirmar compra
                </span>
              )}
            </button>

            <p className="text-center text-zinc-600 text-xs mt-3">
              Al confirmar aceptas los términos del servicio
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Checkout;