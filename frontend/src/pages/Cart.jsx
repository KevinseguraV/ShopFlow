import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getCartRequest, updateItemRequest, removeItemRequest, clearCartRequest } from "../api/cartApi";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formatPrice = (price) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(price || 0);

  const loadCart = useCallback(async () => {
    try {
      const data = await getCartRequest();
      setCart(data);
    } catch (err) {
      setError("No se pudo cargar el carrito.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCart(); }, [loadCart]);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdatingItem(productId);
    try { setCart(await updateItemRequest(productId, newQuantity)); }
    catch (err) { console.error(err); }
    finally { setUpdatingItem(null); }
  };

  const handleRemove = async (productId) => {
    setUpdatingItem(productId);
    try { setCart(await removeItemRequest(productId)); }
    catch (err) { console.error(err); }
    finally { setUpdatingItem(null); }
  };

  const handleClear = async () => {
    if (!window.confirm("¿Vaciar el carrito?")) return;
    try {
      await clearCartRequest();
      setCart((prev) => ({ ...prev, items: [], totalItems: 0, totalPrice: 0 }));
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <MainLayout>
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
      </div>
    </MainLayout>
  );

  if (error) return (
    <MainLayout><div className="text-center py-20 text-zinc-500">{error}</div></MainLayout>
  );

  const items = cart?.items ?? [];

  if (items.length === 0) return (
    <MainLayout>
      <div className="py-10">
        <h1 className="text-3xl font-black text-white mb-10">Mi carrito</h1>
        <div className="flex flex-col items-center justify-center py-24 bg-white/5 border border-white/8 rounded-3xl">
          <svg className="w-20 h-20 text-zinc-700 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-zinc-500 text-lg mb-6">Tu carrito está vacío</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-gradient-to-r from-[#FF6B35] to-[#FFB347] hover:opacity-90 transition text-black font-bold px-8 py-3 rounded-2xl"
          >
            Ver productos
          </button>
        </div>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="py-10">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-black text-white">Mi carrito</h1>
          <button onClick={handleClear} className="text-zinc-500 hover:text-red-400 transition text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Vaciar carrito
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item) => {
              const isUpdating = updatingItem === item.productId;
              return (
                <div
                  key={item.productId}
                  className={`bg-white/5 border border-white/8 rounded-3xl p-5 flex gap-5 items-center transition ${isUpdating ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <div
                    className="w-20 h-20 rounded-2xl bg-white/5 border border-white/8 overflow-hidden flex-shrink-0 cursor-pointer"
                    onClick={() => navigate(`/products/${item.productId}`)}
                  >
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className="text-white font-semibold truncate cursor-pointer hover:text-[#FF8C42] transition"
                      onClick={() => navigate(`/products/${item.productId}`)}
                    >
                      {item.productName}
                    </p>
                    {item.variantValue && <p className="text-zinc-500 text-sm mt-0.5">{item.variantValue}</p>}
                    <p className="text-[#FF8C42] font-bold mt-1">{formatPrice(item.unitPrice)}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-white hover:border-[#FF6B35]/30 transition flex items-center justify-center disabled:opacity-30"
                    >−</button>
                    <span className="text-white font-bold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                      className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-white hover:border-[#FF6B35]/30 transition flex items-center justify-center"
                    >+</button>
                  </div>

                  <div className="text-white font-bold text-right w-28 flex-shrink-0">{formatPrice(item.subtotal)}</div>

                  <button onClick={() => handleRemove(item.productId)} className="text-zinc-600 hover:text-red-400 transition flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/8 rounded-3xl p-6 sticky top-6">
              <h2 className="text-white font-black text-xl mb-6">Resumen del pedido</h2>
              <div className="flex flex-col gap-3 mb-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm text-zinc-500">
                    <span className="truncate mr-2">{item.productName} <span className="text-zinc-600">×{item.quantity}</span></span>
                    <span className="flex-shrink-0">{formatPrice(item.subtotal)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/8 pt-4 mb-6">
                <div className="flex justify-between text-white font-black text-lg">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-[#FF6B35] to-[#FFB347] bg-clip-text text-transparent">
                    {formatPrice(cart?.totalPrice ?? 0)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FFB347] hover:opacity-90 transition text-black font-bold py-4 rounded-2xl text-lg"
              >
                Proceder al pago
              </button>
              <button
                onClick={() => navigate("/products")}
                className="w-full mt-3 text-zinc-500 hover:text-[#FF8C42] transition text-sm py-2"
              >
                ← Seguir comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Cart;