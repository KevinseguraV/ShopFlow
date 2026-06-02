import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

import {
  FaArrowRight,
  FaShoppingBag,
  FaLaptop,
  FaGamepad,
  FaMobileAlt,
  FaHeadphones,
  FaShieldAlt,
  FaTruck,
  FaHeadset,
  FaSearch,
  FaStar,
  FaFire,
} from "react-icons/fa";

import MainLayout from "../layouts/MainLayout";
import { getProductsRequest } from "../api/catalogApi";

// ── Contador animado ──────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const numeric = parseInt(target.replace(/\D/g, ""), 10);
    if (!numeric) { setCount(target); return; }
    let start = 0;
    const duration = 1500;
    const step = Math.ceil(numeric / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= numeric) { setCount(numeric); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {typeof count === "number" ? `${count}${suffix}` : count}
    </span>
  );
}

// ── Formato precio COP ────────────────────────────────────────────────────────
const formatPrice = (price) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);

// ─────────────────────────────────────────────────────────────────────────────
function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Parallax en hero
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Cargar productos destacados desde catalog-service
  useEffect(() => {
    getProductsRequest({ page: 0, size: 4 })
      .then((data) => {
        // Soporta respuesta paginada o array directo
        const list = data.content ?? data ?? [];
        setFeaturedProducts(list.slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setLoadingProducts(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { name: "Laptops",      icon: <FaLaptop />,      color: "from-blue-500/20 to-cyan-500/10",    accent: "text-blue-400",   slug: "Laptops" },
    { name: "Gaming",       icon: <FaGamepad />,     color: "from-purple-500/20 to-pink-500/10",  accent: "text-pink-400",   slug: "Gaming" },
    { name: "Smartphones",  icon: <FaMobileAlt />,   color: "from-cyan-500/20 to-blue-500/10",    accent: "text-cyan-400",   slug: "Smartphones" },
    { name: "Audio",        icon: <FaHeadphones />,  color: "from-orange-500/20 to-yellow-500/10",accent: "text-orange-400", slug: "Audio" },
  ];

  const stats = [
    { title: "500", suffix: "+", subtitle: "Productos" },
    { title: "24",  suffix: "h", subtitle: "Envíos rápidos" },
    { title: "100", suffix: "%", subtitle: "Pagos seguros" },
    { title: "24",  suffix: "/7", subtitle: "Soporte" },
  ];

  const features = [
    { icon: <FaTruck />,    title: "Envíos rápidos",  description: "Entrega rápida y segura de tus productos." },
    { icon: <FaShieldAlt />,title: "Pagos seguros",   description: "Protección completa en cada compra." },
    { icon: <FaHeadset />,  title: "Soporte 24/7",    description: "Atención disponible cuando la necesites." },
  ];

  return (
    <MainLayout>

      {/* ── Glows de fondo ── */}
      <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative overflow-hidden py-28">
        <motion.div style={{ y: heroY, opacity: heroOpacity }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm mb-8"
              >
                <FaShoppingBag />
                Plataforma moderna de E-Commerce
              </motion.div>

              <h1 className="text-6xl lg:text-7xl font-black text-white leading-tight mb-8">
                Compra tecnología de forma
                <span className="text-blue-400"> rápida</span>,{" "}
                <span className="text-cyan-400">moderna</span> y segura
              </h1>

              <p className="text-slate-300 text-xl leading-relaxed mb-10 max-w-2xl">
                Descubre productos increíbles con una experiencia moderna,
                visual y optimizada con arquitectura basada en microservicios.
              </p>

              {/* ── Búsqueda rápida ── */}
              <form onSubmit={handleSearch} className="flex gap-3 mb-8 max-w-lg">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar productos..."
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl pl-10 pr-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/60 transition"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-4 rounded-2xl font-semibold shadow-lg shadow-blue-500/30 flex items-center gap-2 whitespace-nowrap"
                >
                  Buscar
                </button>
              </form>

              <div className="flex flex-wrap gap-5">
                <button
                  onClick={() => navigate("/products")}
                  className="group bg-blue-600 hover:bg-blue-700 transition-all text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl shadow-blue-500/30 flex items-center gap-3"
                >
                  Explorar productos
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate("/products")}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all text-white px-8 py-4 rounded-2xl text-lg font-semibold"
                >
                  Ver catálogo
                </button>
              </div>
            </motion.div>

            {/* RIGHT — cards de categorías animadas */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-52 h-52 bg-cyan-500/20 rounded-full blur-3xl" />
              <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[40px] p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-5">
                  {[
                    { icon: <FaLaptop />, label: "Laptops", sub: "Alto rendimiento", color: "from-blue-500/20 to-cyan-500/10", accent: "text-blue-400", h: "h-44", mt: "" },
                    { icon: <FaGamepad />, label: "Gaming", sub: "Experiencia inmersiva", color: "from-purple-500/20 to-pink-500/10", accent: "text-pink-400", h: "h-56", mt: "mt-10" },
                    { icon: <FaMobileAlt />, label: "Smartphones", sub: "Última generación", color: "from-cyan-500/20 to-blue-500/10", accent: "text-cyan-400", h: "h-56", mt: "-mt-10" },
                    { icon: <FaHeadphones />, label: "Audio", sub: "Sonido envolvente", color: "from-orange-500/20 to-yellow-500/10", accent: "text-orange-400", h: "h-44", mt: "" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.06, rotate: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`bg-gradient-to-br ${item.color} border border-white/10 rounded-3xl p-6 ${item.h} ${item.mt} flex flex-col justify-between cursor-pointer`}
                      onClick={() => navigate(`/products?category=${item.label}`)}
                    >
                      <span className={`text-4xl ${item.accent}`}>{item.icon}</span>
                      <div>
                        <p className="text-white font-bold text-xl">{item.label}</p>
                        <p className="text-slate-400 text-sm">{item.sub}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          STATS con contador animado
      ══════════════════════════════════════════ */}
      <section className="py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.04 }}
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center hover:bg-white/15 hover:border-blue-500/30 transition cursor-default"
            >
              <h2 className="text-4xl font-black text-white mb-2">
                <AnimatedCounter target={stat.title} suffix={stat.suffix} />
              </h2>
              <p className="text-slate-400">{stat.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CATEGORÍAS FUNCIONALES
      ══════════════════════════════════════════ */}
      <section className="py-24">
        <div className="mb-12">
          <p className="text-blue-400 font-medium mb-2">Categorías</p>
          <h2 className="text-4xl font-black text-white">Explora por categoría</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.04, y: -6 }}
              onClick={() => navigate(`/products?category=${category.slug}`)}
              className="group bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/25 rounded-3xl p-8 cursor-pointer overflow-hidden relative"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${category.color}`} />
              <div className="relative z-10">
                <div className={`text-5xl ${category.accent} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                <p className="text-slate-400 mb-4">Descubre productos increíbles</p>
                <span className={`inline-flex items-center gap-1 text-sm ${category.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium`}>
                  Ver todos <FaArrowRight className="text-xs" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PRODUCTOS DESTACADOS (datos reales)
      ══════════════════════════════════════════ */}
      <section className="py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-orange-400 font-medium mb-2 flex items-center gap-2">
              <FaFire /> Destacados
            </p>
            <h2 className="text-4xl font-black text-white">Productos populares</h2>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="hidden md:flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-medium group"
          >
            Ver todos
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-3xl h-72 animate-pulse" />
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            No hay productos disponibles aún.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id ?? product._id ?? index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                onClick={() => navigate(`/products/${product.id ?? product._id}`)}
                className="group bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/25 rounded-3xl overflow-hidden cursor-pointer transition-colors duration-300"
              >
                {/* Imagen */}
                <div className="h-44 bg-white/5 overflow-hidden relative">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <FaShoppingBag className="text-4xl" />
                    </div>
                  )}
                  {/* Badge categoría */}
                  {product.categoryName && (
                    <span className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/10">
                      {product.categoryName}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="text-white font-bold mb-1 truncate group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400 font-bold text-lg">
                      {formatPrice(product.basePrice)}
                    </span>
                    <span className="flex items-center gap-1 text-yellow-400 text-xs">
                      <FaStar /> <span className="text-slate-400">Nuevo</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Ver todos mobile */}
        <div className="mt-8 text-center md:hidden">
          <button
            onClick={() => navigate("/products")}
            className="bg-white/10 border border-white/20 text-white px-8 py-3 rounded-2xl font-medium hover:bg-white/20 transition"
          >
            Ver todos los productos
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════ */}
      <section className="pb-24 pt-12">
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-10">
          <div className="text-center mb-14">
            <p className="text-blue-400 font-medium mb-3">Beneficios</p>
            <h2 className="text-4xl font-black text-white">Todo lo que necesitas</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-xl border border-white/10 hover:border-blue-500/30 rounded-3xl p-8 transition-colors duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-2xl text-blue-400 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </MainLayout>
  );
}

export default Home;