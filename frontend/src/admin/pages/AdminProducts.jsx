import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";

import {
  getProductsRequest,
  deleteProductRequest,
} from "../../api/catalogApi";

function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await getProductsRequest(0, 100);

      setProducts(data?.content || []);
    } catch (error) {
      console.error("Error cargando productos:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Eliminar producto?"
    );

    if (!confirmDelete) return;

    try {
      await deleteProductRequest(id);

      await loadProducts();
    } catch (error) {
      console.error(error);
      alert("Error eliminando producto");
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-black text-white">
          Productos
        </h1>

        <button
          onClick={() => navigate("/admin/products/new")}
          className="
            bg-gradient-to-r
            from-[#FF6B35]
            to-[#FFB347]
            text-black
            font-bold
            px-5
            py-3
            rounded-xl
            hover:opacity-90
            transition
          "
        >
          + Nuevo Producto
        </button>
      </div>

      {loading ? (
        <div className="text-white">
          Cargando productos...
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <p className="text-zinc-400">
            No hay productos registrados.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="
                bg-white/5
                border
                border-white/10
                rounded-2xl
                p-5
                flex
                items-center
                justify-between
              "
            >
              <div>
                <h3 className="text-white font-bold text-lg">
                  {product.name}
                </h3>

                <p className="text-zinc-400">
                  ${product.basePrice}
                </p>

                <p className="text-zinc-500 text-sm">
                  {product.categoryName}
                </p>
              </div>

              <button
                onClick={() => handleDelete(product.id)}
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-red-500/20
                  text-red-400
                  hover:bg-red-500/30
                  transition
                "
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminProducts;