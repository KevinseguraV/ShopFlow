import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { getCategoriesRequest, createCategoryRequest, deleteCategoryRequest } from "../api/adminProductApi";

function AdminCategories() {
  const [categories, setCategories]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [creating, setCreating]       = useState(false);
  const [showForm, setShowForm]       = useState(false);
  const [name, setName]               = useState("");
  const [error, setError]             = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const data = await getCategoriesRequest();
      setCategories(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!name.trim()) { setError("El nombre es obligatorio"); return; }
    setError("");
    try {
      setCreating(true);
      await createCategoryRequest({ name: name.trim() });
      setName("");
      setShowForm(false);
      await load();
    } catch (e) {
      console.error(e);
      setError("Error al crear la categoría");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`¿Eliminar categoría "${catName}"?`)) return;
    try {
      await deleteCategoryRequest(id);
      await load();
    } catch (e) {
      console.error(e);
      alert("Error eliminando categoría");
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Categorías</h1>
          <p className="text-zinc-500 text-sm mt-1">{categories.length} categorías registradas</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(""); setName(""); }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FFB347] text-white font-bold text-sm hover:opacity-90 transition"
        >
          {showForm ? "Cancelar" : "+ Nueva categoría"}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 mb-6">
          <h2 className="text-white font-bold mb-4">Nueva categoría</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Nombre de la categoría"
              className={`flex-1 h-11 px-4 rounded-xl bg-white/[0.04] border text-white placeholder-zinc-600 outline-none transition
                ${error ? "border-red-500/50" : "border-white/[0.08] focus:border-[#FF6B35]/60"}`}
            />
            <button
              onClick={handleCreate}
              disabled={creating}
              className="px-6 h-11 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FFB347] text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 transition"
            >
              {creating ? "Creando..." : "Crear"}
            </button>
          </div>
          {error && <p className="text-red-400 text-xs mt-2">⚠ {error}</p>}
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-12 text-center">
          <p className="text-zinc-500">No hay categorías registradas.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between bg-white/[0.03] border border-white/[0.07] rounded-xl px-5 py-4 hover:border-white/15 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FF6B35]" />
                <span className="text-white font-medium">{cat.name}</span>
              </div>
              <button
                onClick={() => handleDelete(cat.id, cat.name)}
                className="text-zinc-600 hover:text-red-400 transition text-sm"
                title="Eliminar"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminCategories;