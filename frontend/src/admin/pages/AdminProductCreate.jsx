import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";

import {
  createProductRequest,
  getCategoriesRequest,
} from "../../api/catalogApi";

import { uploadImageToCloudinary } from "../api/cloudinaryApi";

function AdminProductCreate() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    basePrice: "",
    categoryId: "",
    images: [],
    variants: [],
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategoriesRequest();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let imageUrl = "";

      if (image) {
        imageUrl = await uploadImageToCloudinary(image);
      }

      await createProductRequest({
        ...form,
        basePrice: Number(form.basePrice),
        images: imageUrl ? [imageUrl] : [],
      });

      alert("Producto creado correctamente");

      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      alert("Error creando producto");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF8C42]";

  return (
    <AdminLayout>
      <h1 className="text-4xl font-black text-white mb-8">
        Nuevo Producto
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid lg:grid-cols-2 gap-8"
      >
        {/* IZQUIERDA */}
        <div className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Nombre del producto"
            value={form.name}
            onChange={handleChange}
            required
            className={inputStyle}
          />

          <textarea
            rows="6"
            name="description"
            placeholder="Descripción"
            value={form.description}
            onChange={handleChange}
            required
            className={inputStyle}
          />

          <input
            type="number"
            name="basePrice"
            placeholder="Precio"
            value={form.basePrice}
            onChange={handleChange}
            required
            className={inputStyle}
          />

          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
            className={inputStyle}
          >
            <option value="">
              Seleccione categoría
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-gradient-to-r
              from-[#FF6B35]
              to-[#FFB347]
              text-black
              font-bold
              py-4
              rounded-xl
              hover:opacity-90
              transition
            "
          >
            {loading
              ? "Subiendo imagen..."
              : "Guardar Producto"}
          </button>
        </div>

        {/* DERECHA */}
        <div>
          <div
            className="
              bg-white/5
              border
              border-white/10
              rounded-2xl
              p-6
            "
          >
            <h3 className="text-white font-bold mb-4">
              Imagen principal
            </h3>

            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="
                  w-full
                  h-80
                  object-cover
                  rounded-xl
                  mb-4
                "
              />
            ) : (
              <div
                className="
                  h-80
                  rounded-xl
                  border-2
                  border-dashed
                  border-white/10
                  flex
                  items-center
                  justify-center
                  text-zinc-500
                  mb-4
                "
              >
                Vista previa de imagen
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-white"
            />
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}

export default AdminProductCreate;