import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { createProductRequest, getCategoriesRequest } from "../api/adminProductApi";
import { uploadImageToCloudinary } from "../api/cloudinaryApi";

function AdminProductCreate() {
  const navigate    = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [image, setImage]           = useState(null);
  const [preview, setPreview]       = useState("");
  const [error, setError]           = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    basePrice: "",
    categoryId: "",
  });

  useEffect(() => {
    getCategoriesRequest()
      .then(setCategories)
      .catch(console.error);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    if (!form.name.trim())        return "El nombre es obligatorio";
    if (!form.description.trim()) return "La descripción es obligatoria";
    if (!form.basePrice || Number(form.basePrice) <= 0) return "El precio debe ser mayor a 0";
    if (!form.categoryId)         return "Selecciona una categoría";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");

    try {
      setLoading(true);
      let imageUrl = "";
      if (image) imageUrl = await uploadImageToCloudinary(image);

      await createProductRequest({
        ...form,
        basePrice: Number(form.basePrice),
        images: imageUrl ? [imageUrl] : [],
        variants: [],
      });

      navigate("/admin/products");
    } catch (e) {
      console.error(e);
      setError("Error creando el producto. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (hasError) =>
    `w-full px-4 rounded-xl bg-white/[0.04] border text-white placeholder-zinc-600 outline-none transition
    ${hasError ? "border-red-500/50" : "border-white/[0.08] focus:border-[#FF6B35]/60 hover:border-white/20"}`;

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Nuevo producto</h1>
          <p className="text-zinc-500 text-sm mt-1">Completa la información del producto</p>
        </div>
        <button
          onClick={() => navigate("/admin/products")}
          className="text-zinc-500 hover:text-white text-sm transition flex items-center gap-1"
        >
          ← Volver
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">

        {/* Izquierda — Formulario */}
        <div className="flex flex-col gap-4">
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
            <h2 className="text-white font-bold mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#FF6B35]/20 flex items-center justify-center text-[#FF6B35] text-xs">1</span>
              Información básica
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1.5 block">Nombre del producto</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ej: Camiseta Nike Air"
                  className={`${fieldClass(false)} h-11`}
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1.5 block">Descripción</label>
                <textarea
                  rows={4}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe el producto..."
                  className={`${fieldClass(false)} py-3 resize-none`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1.5 block">Precio (COP)</label>
                  <input
                    type="number"
                    name="basePrice"
                    value={form.basePrice}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className={`${fieldClass(false)} h-11`}
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1.5 block">Categoría</label>
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    className={`${fieldClass(false)} h-11`}
                    style={{ backgroundColor: '#1a1a1a' }}
                  >
                    <option value="" style={{ backgroundColor: '#1a1a1a' }}>Seleccionar...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} style={{ backgroundColor: '#1a1a1a' }}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Error + botón */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <span className="text-red-400 text-sm">⚠ {error}</span>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FFB347] text-white font-black text-base
              hover:opacity-90 hover:shadow-[0_8px_30px_rgba(255,107,53,0.3)] active:scale-[0.99]
              disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Guardando...
              </>
            ) : "Guardar producto"}
          </button>
        </div>

        {/* Derecha — Imagen */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 h-fit">
          <h2 className="text-white font-bold mb-5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#FF6B35]/20 flex items-center justify-center text-[#FF6B35] text-xs">2</span>
            Imagen principal
          </h2>

          {preview ? (
            <div className="relative mb-4">
              <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-xl" />
              <button
                onClick={() => { setImage(null); setPreview(""); }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white text-sm flex items-center justify-center hover:bg-black/80 transition"
              >
                ✕
              </button>
            </div>
          ) : (
            <label className="block h-64 rounded-xl border-2 border-dashed border-white/10 hover:border-[#FF6B35]/40 flex items-center justify-center cursor-pointer transition mb-4">
              <div className="text-center">
                <div className="text-3xl mb-2">📷</div>
                <p className="text-zinc-500 text-sm">Haz click para subir imagen</p>
                <p className="text-zinc-600 text-xs mt-1">PNG, JPG, WEBP</p>
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}

          {!preview && (
            <label className="w-full h-10 rounded-xl border border-white/[0.08] text-zinc-400 text-sm font-medium flex items-center justify-center cursor-pointer hover:bg-white/5 transition">
              Seleccionar archivo
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminProductCreate;