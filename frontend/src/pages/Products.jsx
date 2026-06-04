    import { useState, useEffect } from "react";
    import { useNavigate } from "react-router-dom";
    import MainLayout from "../layouts/MainLayout";
    import {
      getProductsRequest, getCategoriesRequest,
      searchProductsRequest, getProductsByCategoryRequest,
    } from "../api/catalogApi";

    function Products() {
      const [products, setProducts] = useState([]);
      const [categories, setCategories] = useState([]);
      const [loading, setLoading] = useState(true);
      const [search, setSearch] = useState("");
      const [selectedCategory, setSelectedCategory] = useState(null);
      const [page, setPage] = useState(0);
      const [totalPages, setTotalPages] = useState(0);
      const navigate = useNavigate();

      useEffect(() => { getCategoriesRequest().then(setCategories).catch(console.error); }, []);
      useEffect(() => { fetchProducts(); }, [page, selectedCategory]);

      const fetchProducts = async () => {
        setLoading(true);
        try {
          let data;
          if (selectedCategory) {
            data = await getProductsByCategoryRequest(selectedCategory, page);
          } else {
            data = await getProductsRequest(page);
          }
          setProducts(data.content);
          setTotalPages(data.totalPages);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      const handleSearch = async (e) => {
        e.preventDefault();
        if (!search.trim()) { fetchProducts(); return; }
        setLoading(true);
        try {
          const data = await searchProductsRequest(search, 0);
          setProducts(data.content);
          setTotalPages(data.totalPages);
          setPage(0);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
        setPage(0);
        setSearch("");
      };

      const formatPrice = (price) =>
        new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(price);

      return (
        <MainLayout>
          <div className="py-10">

            <div className="mb-10">
              <h1 className="text-4xl font-black text-white mb-2">Productos</h1>
              <p className="text-zinc-500">Descubre nuestra colección completa</p>
            </div>

            {/* Buscador */}
            <form onSubmit={handleSearch} className="mb-8 flex gap-3">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 outline-none focus:border-[#FF6B35]/50 transition-all"
              />
              <button type="submit" className="bg-gradient-to-r from-[#FF6B35] to-[#FFB347] hover:opacity-90 transition text-black font-bold px-6 py-4 rounded-2xl">
                Buscar
              </button>
              {search && (
                <button
                  type="button"
                  onClick={() => { setSearch(""); fetchProducts(); }}
                  className="bg-white/5 border border-white/10 hover:border-white/20 transition text-zinc-400 px-6 py-4 rounded-2xl"
                >
                  Limpiar
                </button>
              )}
            </form>

            {/* Categorías */}
            {categories.length > 0 && (
              <div className="flex gap-3 mb-8 flex-wrap">
                <button
                  onClick={() => handleCategoryClick(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    !selectedCategory
                      ? "bg-gradient-to-r from-[#FF6B35] to-[#FFB347] text-black font-bold"
                      : "bg-white/5 border border-white/10 text-zinc-400 hover:border-[#FF6B35]/30 hover:text-[#FF8C42]"
                  }`}
                >
                  Todos
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      selectedCategory === cat.id
                        ? "bg-gradient-to-r from-[#FF6B35] to-[#FFB347] text-black font-bold"
                        : "bg-white/5 border border-white/10 text-zinc-400 hover:border-[#FF6B35]/30 hover:text-[#FF8C42]"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-zinc-600">
                <p className="text-2xl mb-2">No se encontraron productos</p>
                <p className="text-sm">Intenta con otra búsqueda</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="group bg-white/5 border border-white/8 rounded-2xl overflow-hidden cursor-pointer hover:border-[#FF6B35]/30 transition-all duration-300"
                  >
                    <div className="aspect-square bg-white/5 overflow-hidden">
                      {product.images?.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-700">
                          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <p className="text-[#FF8C42] text-xs font-medium mb-1 uppercase tracking-wide">
                        {product.categoryName}
                      </p>
                      <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2 group-hover:text-[#FF8C42] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-zinc-500 text-sm line-clamp-2 mb-3">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-xl">{formatPrice(product.basePrice)}</span>
                        {product.variants?.length > 0 && (
                          <span className="text-zinc-600 text-xs">{product.variants.length} variantes</span>
                        )}
                      </div>
                      {product.reviewCount > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-[#FFB347] text-sm">★</span>
                          <span className="text-zinc-300 text-sm">{product.rating.toFixed(1)}</span>
                          <span className="text-zinc-600 text-xs">({product.reviewCount})</span>
                        </div>
                      )}
                    </div>

                    <div className="px-4 pb-4">
                      <button className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FFB347] hover:opacity-90 transition text-black font-bold py-2.5 rounded-xl text-sm">
                        Ver producto
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-40 hover:border-[#FF6B35]/30 transition"
                >
                  ← Anterior
                </button>
                <span className="px-4 py-2 text-zinc-500 text-sm flex items-center">
                  Página {page + 1} de {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-40 hover:border-[#FF6B35]/30 transition"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </div>
        </MainLayout>
      );
    }

    export default Products;