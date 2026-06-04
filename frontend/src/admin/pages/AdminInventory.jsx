import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { getInventoryRequest, createInventoryRequest, getAdminProductsRequest } from "../api/adminProductApi";

function AdminInventory() {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [creating, setCreating]   = useState(false);
  const [error, setError]         = useState("");

  const [form, setForm] = useState({ productId: "", quantity: "", lowStockThreshold: "5" });

  const load = async () => {
    try {
      setLoading(true);
      const [inv, prods] = await Promise.all([
        getInventoryRequest(),
        getAdminProductsRequest(0, 200),
      ]);
      setInventory(inv || []);
      setProducts(prods?.content || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.productId) { setError("Selecciona un producto"); return; }
    if (!form.quantity || Number(form.quantity) < 0) { setError("Cantidad inválida"); return; }
    setError("");
    try {
      setCreating(true);
      await createInventoryRequest({
        productId:         form.productId,
        quantity:          Number(form.quantity),
        lowStockThreshold: Number(form.lowStockThreshold) || 5,
      });
      setForm({ productId: "", quantity: "", lowStockThreshold: "5" });
      setShowForm(false);
      await load();
    } catch (e) {
      console.error(e);
      setError("Error al crear el registro de inventario");
    } finally {
      setCreating(false);
    }
  };

  const getStockStatus = (item) => {
    if (item.quantity === 0)                              return { label: "Sin stock",  color: "text-red-400",     bg: "bg-red-400/10",     border: "border-red-400/20"     };
    if (item.quantity <= (item.lowStockThreshold || 5))   return { label: "Stock bajo", color: "text-[#FFB347]",   bg: "bg-[#FFB347]/10",   border: "border-[#FFB347]/20"   };
    return                                                       { label: "Disponible", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" };
  };

  // Productos que ya tienen inventario registrado
  const registeredIds = new Set(inventory.map((i) => i.productId));
  const availableProducts = products.filter((p) => !registeredIds.has(p.id));

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Inventario</h1>
          <p className="text-zinc-500 text-sm mt-1">{inventory.length} productos en inventario</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(""); }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FFB347] text-white font-bold text-sm hover:opacity-90 transition"
        >
          {showForm ? "Cancelar" : "+ Agregar stock"}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 mb-6">
          <h2 className="text-white font-bold mb-5">Registrar inventario</h2>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1.5 block">Producto</label>
              <select
                value={form.productId}
                onChange={(e) => { setForm({ ...form, productId: e.target.value }); setError(""); }}
                className="w-full h-11 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white outline-none focus:border-[#FF6B35]/60 transition"
              >
                <option value="">Seleccionar...</option>
                {availableProducts.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1.5 block">Cantidad</label>
              <input
                type="number"
                min="0"
                value={form.quantity}
                onChange={(e) => { setForm({ ...form, quantity: e.target.value }); setError(""); }}
                placeholder="0"
                className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-zinc-600 outline-none focus:border-[#FF6B35]/60 transition"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1.5 block">Stock mínimo</label>
              <input
                type="number"
                min="1"
                value={form.lowStockThreshold}
                onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })}
                placeholder="5"
                className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-zinc-600 outline-none focus:border-[#FF6B35]/60 transition"
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-xs mb-3">⚠ {error}</p>}
          <button
            onClick={handleCreate}
            disabled={creating}
            className="px-6 h-10 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FFB347] text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 transition"
          >
            {creating ? "Guardando..." : "Guardar"}
          </button>
        </div>
      )}

      {/* Tabla */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : inventory.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-12 text-center">
          <p className="text-zinc-500">No hay registros de inventario.</p>
        </div>
      ) : (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {["Producto", "Stock actual", "Stock mínimo", "Estado"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => {
                const st = getStockStatus(item);
                const product = products.find((p) => p.id === item.productId);
                return (
                  <tr key={item.id || item.productId} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition">
                    <td className="px-5 py-4">
                      <p className="text-white font-medium text-sm">{product?.name || item.productId}</p>
                      <p className="text-zinc-600 text-xs font-mono">{item.productId?.slice(0, 8)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-white font-black text-lg">{item.quantity}</span>
                      <span className="text-zinc-500 text-xs ml-1">unidades</span>
                    </td>
                    <td className="px-5 py-4 text-zinc-400 text-sm">{item.lowStockThreshold || 5}</td>
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

export default AdminInventory;