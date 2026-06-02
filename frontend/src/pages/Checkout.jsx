import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getCartRequest, clearCartRequest } from "../api/cartApi";
import { createOrderRequest } from "../api/orderApi";
import { useEffect } from "react";

function Checkout() {

  const navigate = useNavigate();

  const [cart, setCart] = useState(null);

  const [loading, setLoading] = useState(true);

  const [creating, setCreating] = useState(false);

  const [shippingAddress, setShippingAddress] = useState("");

  useEffect(() => {

    getCartRequest()
      .then(setCart)
      .catch(console.error)
      .finally(() => setLoading(false));

  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price || 0);

  const handleCheckout = async () => {

    if (!shippingAddress.trim()) {
      alert("Debes ingresar una dirección");
      return;
    }

    try {

      setCreating(true);

      const payload = {
        shippingAddress,
        items: cart.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          variantId: item.variantId || "default",
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
        })),
      };

      const order = await createOrderRequest(payload);

      await clearCartRequest();

      navigate("/orders", {
        state: {
          success: true,
          orderId: order.id,
        },
      });

    } catch (err) {
      console.error(err);
      alert("No se pudo crear la orden");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      <div className="py-10 max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-white mb-10">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Formulario */}
          <div className="bg-white/10 border border-white/10 rounded-3xl p-6">

            <h2 className="text-white text-2xl font-bold mb-6">
              Dirección de envío
            </h2>

            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              rows={5}
              placeholder="Ingresa tu dirección..."
              className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 resize-none"
            />

          </div>

          {/* Resumen */}
          <div className="bg-white/10 border border-white/10 rounded-3xl p-6 h-fit sticky top-6">

            <h2 className="text-white text-2xl font-bold mb-6">
              Resumen
            </h2>

            <div className="flex flex-col gap-4 mb-6">

              {cart?.items?.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between text-slate-300"
                >
                  <span>
                    {item.productName} × {item.quantity}
                  </span>

                  <span>
                    {formatPrice(item.subtotal)}
                  </span>
                </div>
              ))}

            </div>

            <div className="border-t border-white/10 pt-4 mb-6">

              <div className="flex justify-between text-white text-xl font-bold">

                <span>Total</span>

                <span>
                  {formatPrice(cart?.totalPrice)}
                </span>

              </div>

            </div>

            <button
              onClick={handleCheckout}
              disabled={creating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition text-white py-4 rounded-2xl font-semibold text-lg"
            >
              {creating
                ? "Procesando..."
                : "Confirmar compra"}
            </button>

          </div>

        </div>

      </div>

    </MainLayout>
  );
}

export default Checkout;