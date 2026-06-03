import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import {
  createProductRequest,
  getCategoriesRequest,
} from "../../api/catalogApi";

function AdminProductCreate() {
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    basePrice: "",
    categoryId: "",
    images: [],
    variants: [],
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createProductRequest({
        ...form,
        basePrice: Number(form.basePrice),
      });

      alert("Producto creado");
    } catch (error) {
      console.error(error);
      alert("Error creando producto");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-4xl font-black text-white mb-8">
        Nuevo Producto
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-3xl"
      >
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white"
        />

        <textarea
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white"
        />

        <input
          type="number"
          name="basePrice"
          placeholder="Precio"
          value={form.basePrice}
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white"
        />

        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white"
        >
          <option value="">Seleccione categoría</option>

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
          className="bg-gradient-to-r from-[#FF6B35] to-[#FFB347]
          text-black font-bold px-8 py-3 rounded-xl"
        >
          Guardar Producto
        </button>
      </form>
    </AdminLayout>
  );
}

export default AdminProductCreate;