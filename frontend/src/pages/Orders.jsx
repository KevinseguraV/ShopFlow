import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getOrdersRequest } from "../api/orderApi";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrdersRequest()
      .then((data) => setOrders(data.content || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(price || 0);

  const getStatusStyle = (status) => {
    switch (status) {
      case "CONFIRMED": return "text-green-400 bg-green-400/10 border border-green-400/20";
      case "CANCELLED": return "text-red-400 bg-red-400/10 border border-red-400/20";
      default:          return "text-[#FFB347] bg-[#FFB347]/10 border border-[#FFB347]/20";
    }
  };

  if (loading) return (
    <MainLayout>
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="py-10">
        <h1 className="text-4xl font-black text-white mb-10">Mis órdenes</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20 text-zinc-600">No tienes órdenes aún.</div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white/5 border border-white/8 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-white font-bold">Orden #{order.id.slice(0, 8)}</p>
                    <p className="text-zinc-500 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </div>
                </div>

                <div className="flex flex-col gap-3 mb-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-zinc-400">
                      <span>{item.productName} × {item.quantity}</span>
                      <span>{formatPrice(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/8 pt-4 flex justify-between text-white font-black text-lg">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-[#FF6B35] to-[#FFB347] bg-clip-text text-transparent">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Orders;