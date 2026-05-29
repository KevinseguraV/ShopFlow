import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getProductByIdRequest } from "../api/catalogApi";
import { useAuth } from "../context/AuthContext";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getProductByIdRequest(id)
      .then((data) => {
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    // Se conectará al cart-service en el siguiente paso
    alert(`Agregado al carrito: ${product.name} x${quantity}`);
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

  if (!product) {
    return (
      <MainLayout>
        <div className="text-center py-20 text-slate-400">
          Producto no encontrado
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-slate-400 text-sm mb-8">
          <button onClick={() => navigate("/products")} className="hover:text-white transition">
            Productos
          </button>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Imagen */}
          <div className="aspect-square bg-white/5 rounded-3xl overflow-hidden border border-white/10">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-blue-400 text-sm font-medium uppercase tracking-wide mb-2">
              {product.categoryName}
            </p>
            <h1 className="text-4xl font-bold text-white mb-4">
              {product.name}
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="text-4xl font-bold text-white mb-8">
              {formatPrice(selectedVariant ? selectedVariant.price : product.basePrice)}
            </div>

            {/* Variantes */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <p className="text-slate-300 font-medium mb-3">
                  {product.variants[0].name}:
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={variant.stock === 0}
                      className={`px-4 py-2 rounded-xl border text-sm font-medium transition ${
                        selectedVariant?.id === variant.id
                          ? "bg-blue-600 border-blue-600 text-white"
                          : variant.stock === 0
                          ? "border-white/10 text-slate-600 cursor-not-allowed"
                          : "border-white/20 text-slate-300 hover:border-blue-400 hover:text-white"
                      }`}
                    >
                      {variant.value}
                      {variant.stock === 0 && " (Agotado)"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cantidad */}
            <div className="mb-8">
              <p className="text-slate-300 font-medium mb-3">Cantidad:</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition flex items-center justify-center text-lg"
                >
                  −
                </button>
                <span className="text-white font-bold text-xl w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition flex items-center justify-center text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 transition text-white py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-blue-500/30"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default ProductDetail;