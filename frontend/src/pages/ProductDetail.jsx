import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getProductByIdRequest } from "../api/catalogApi";
import { addItemRequest } from "../api/cartApi";
import { getInventoryByProductRequest } from "../api/inventoryApi";
import { useAuth } from "../context/AuthContext";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct]           = useState(null);
  const [inventory, setInventory]       = useState(null);
  const [loading, setLoading]           = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity]         = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartFeedback, setCartFeedback] = useState(null);
  const { user } = useAuth();
  const navigate  = useNavigate();

  useEffect(() => {
    Promise.all([
      getProductByIdRequest(id),
      getInventoryByProductRequest(id).catch(() => null), // no falla si no hay registro
    ]).then(([prod, inv]) => {
      setProduct(prod);
      setInventory(inv);
      if (prod.variants?.length > 0) setSelectedVariant(prod.variants[0]);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency", currency: "COP", minimumFractionDigits: 0,
    }).format(price);

  const isOutOfStock = inventory !== null && inventory.quantity === 0;
  const isLowStock   = inventory !== null && inventory.quantity > 0 &&
                       inventory.quantity <= (inventory.lowStockThreshold || 5);

  const maxQuantity  = inventory ? inventory.quantity : 99;

  const handleAddToCart = async () => {
    if (!user) { navigate("/login"); return; }
    if (isOutOfStock) return;
    setAddingToCart(true);
    setCartFeedback(null);
    try {
      const price = selectedVariant ? selectedVariant.price : product.basePrice;
      const slug  = product.slug ?? product.id;
      await addItemRequest(id, quantity, selectedVariant?.id ?? null, product.name, slug, price);
      setCartFeedback("success");
      setTimeout(() => setCartFeedback(null), 3000);
    } catch (err) {
      console.error(err);
      setCartFeedback("error");
      setTimeout(() => setCartFeedback(null), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return (
    <MainLayout>
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
      </div>
    </MainLayout>
  );

  if (!product) return (
    <MainLayout>
      <div className="text-center py-20 text-zinc-500">Producto no encontrado</div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-zinc-500 text-sm mb-8">
          <button onClick={() => navigate("/products")} className="hover:text-[#FF8C42] transition">
            Productos
          </button>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Imagen */}
          <div className="relative aspect-square bg-white/5 rounded-3xl overflow-hidden border border-white/8">
            {product.images?.length > 0 ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-700">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            {/* Badge agotado sobre la imagen */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="bg-red-500/90 text-white font-black text-xl px-6 py-3 rounded-2xl tracking-wide">
                  AGOTADO
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-[#FF8C42] text-sm font-medium uppercase tracking-wide mb-2">
              {product.categoryName}
            </p>
            <h1 className="text-4xl font-black text-white mb-4">{product.name}</h1>
            <p className="text-zinc-400 text-lg leading-relaxed mb-6">{product.description}</p>

            <div className="text-4xl font-black bg-gradient-to-r from-[#FF6B35] to-[#FFB347] bg-clip-text text-transparent mb-4">
              {formatPrice(selectedVariant ? selectedVariant.price : product.basePrice)}
            </div>

            {/* Stock badge */}
            {inventory !== null && (
              <div className="mb-6">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-400/10 border border-red-400/25 text-red-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    Sin stock
                  </span>
                ) : isLowStock ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FFB347]/10 border border-[#FFB347]/25 text-[#FFB347]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB347] animate-pulse" />
                    ¡Solo quedan {inventory.quantity} unidades!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-400/10 border border-emerald-400/25 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    En stock · {inventory.quantity} disponibles
                  </span>
                )}
              </div>
            )}

            {/* Variantes */}
            {product.variants?.length > 0 && (
              <div className="mb-6">
                <p className="text-zinc-300 font-medium mb-3">{product.variants[0].name}:</p>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={variant.stock === 0}
                      className={`px-4 py-2 rounded-xl border text-sm font-medium transition ${
                        selectedVariant?.id === variant.id
                          ? "bg-gradient-to-r from-[#FF6B35] to-[#FFB347] border-transparent text-black font-bold"
                          : variant.stock === 0
                          ? "border-white/5 text-zinc-700 cursor-not-allowed"
                          : "border-white/10 text-zinc-400 hover:border-[#FF6B35]/40 hover:text-[#FF8C42]"
                      }`}
                    >
                      {variant.value}{variant.stock === 0 && " (Agotado)"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cantidad */}
            {!isOutOfStock && (
              <div className="mb-8">
                <p className="text-zinc-300 font-medium mb-3">Cantidad:</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white hover:border-[#FF6B35]/30 transition flex items-center justify-center text-lg"
                  >−</button>
                  <span className="text-white font-bold text-xl w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white hover:border-[#FF6B35]/30 transition flex items-center justify-center text-lg"
                  >+</button>
                </div>
              </div>
            )}

            {/* Feedback carrito */}
            {cartFeedback === "success" && (
              <div className="mb-4 flex items-center gap-2 text-green-400 bg-green-400/10 border border-green-400/20 rounded-2xl px-4 py-3 text-sm">
                ✓ Producto agregado al carrito
                <button onClick={() => navigate("/cart")} className="ml-auto underline hover:no-underline">
                  Ver carrito
                </button>
              </div>
            )}
            {cartFeedback === "error" && (
              <div className="mb-4 flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-2xl px-4 py-3 text-sm">
                ✕ No se pudo agregar al carrito. Intenta de nuevo.
              </div>
            )}

            {/* Botón */}
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || isOutOfStock}
              className={`w-full font-bold py-4 rounded-2xl text-lg flex items-center justify-center gap-2 transition
                ${isOutOfStock
                  ? "bg-white/5 border border-white/10 text-zinc-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#FF6B35] to-[#FFB347] hover:opacity-90 disabled:opacity-60 text-black"
                }`}
            >
              {isOutOfStock ? "Producto agotado" : addingToCart ? (
                <><div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> Agregando...</>
              ) : "Agregar al carrito"}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default ProductDetail;