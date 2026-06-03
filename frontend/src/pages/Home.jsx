import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

import {
  FaArrowRight, FaShoppingBag, FaLaptop, FaGamepad,
  FaMobileAlt, FaHeadphones, FaShieldAlt, FaTruck,
  FaHeadset, FaSearch, FaStar, FaFire, FaBolt,
} from "react-icons/fa";

import MainLayout from "../layouts/MainLayout";
import { getProductsRequest } from "../api/catalogApi";

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

const formatPrice = (price) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);

function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    getProductsRequest({ page: 0, size: 4 })
      .then((data) => {
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
    { name: "Laptops",     icon: <FaLaptop />,     color: "from-[#FF6B35]/20 to-[#FFB347]/10", accent: "text-[#FF8C42]", slug: "Laptops" },
    { name: "Gaming",      icon: <FaGamepad />,    color: "from-[#cc3300]/20 to-[#FF6B35]/10", accent: "text-[#FF6B35]", slug: "Gaming" },
    { name: "Smartphones", icon: <FaMobileAlt />,  color: "from-[#FFB347]/20 to-[#FF8C42]/10", accent: "text-[#FFB347]", slug: "Smartphones" },
    { name: "Audio",       icon: <FaHeadphones />, color: "from-[#FF6B35]/15 to-[#cc3300]/10", accent: "text-[#FF8C42]", slug: "Audio" },
  ];

  const features = [
    { icon: <FaTruck />,     title: "Envíos rápidos", description: "Entrega rápida y segura a tu puerta." },
    { icon: <FaShieldAlt />, title: "Pagos seguros",  description: "Protección completa en cada compra." },
    { icon: <FaHeadset />,   title: "Soporte 24/7",   description: "Atención disponible cuando la necesites." },
  ];

  const impactStats = [
    { value: "500", suffix: "+", label: "Productos", sub: "disponibles ahora" },
    { value: "10",  suffix: "K+", label: "Clientes",  sub: "satisfechos" },
    { value: "99",  suffix: "%",  label: "Seguridad", sub: "en pagos" },
    { value: "24",  suffix: "/7", label: "Soporte",   sub: "siempre contigo" },
  ];

  return (
    <MainLayout>

      {/* HERO */}
      <section ref={heroRef} className="relative overflow-hidden py-24">
        <motion.div style={{ y: heroY, opacity: heroOpacity }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            {/* LEFT */}
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-[#FF6B35]/10 border border-[#FF6B35]/25 text-[#FF8C42] px-4 py-2 rounded-full text-sm mb-8"
              >
                <FaBolt />
                E-Commerce moderno y confiable
              </motion.div>

              <h1 className="text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6">
                La nueva forma
                <br />
                de{" "}
                <span className="bg-gradient-to-r from-[#FF6B35] to-[#FFB347] bg-clip-text text-transparent">
                  comprar todo
                </span>
              </h1>

              <p className="text-zinc-400 text-lg leading-relaxed mb-10 max-w-xl">
                Miles de productos, las mejores marcas y entregas rápidas.
                Todo lo que necesitas, en un solo lugar.
              </p>

              {/* Búsqueda */}
              <form onSubmit={handleSearch} className="flex gap-3 mb-8 max-w-lg">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="¿Qué estás buscando?"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF6B35]/50 transition"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#FF6B35] to-[#FFB347] hover:opacity-90 transition text-black font-bold px-6 py-4 rounded-2xl shadow-lg shadow-[#FF6B35]/20 whitespace-nowrap"
                >
                  Buscar
                </button>
              </form>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/products")}
                  className="group bg-gradient-to-r from-[#FF6B35] to-[#FFB347] hover:opacity-90 transition text-black font-bold px-8 py-4 rounded-2xl text-lg shadow-xl shadow-[#FF6B35]/20 flex items-center gap-3"
                >
                  Explorar productos
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate("/products")}
                  className="border border-white/10 hover:border-[#FF6B35]/30 hover:text-[#FF8C42] transition text-zinc-400 px-8 py-4 rounded-2xl text-lg font-semibold"
                >
                  Ver catálogo
                </button>
              </div>
            </motion.div>

            {/* RIGHT — Stats de impacto */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:flex flex-col gap-5"
            >
              {/* Fila superior — 2 stats grandes */}
              <div className="grid grid-cols-2 gap-5">
                {impactStats.slice(0, 2).map((stat, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white/5 border border-white/8 rounded-3xl p-8 flex flex-col gap-1"
                  >
                    <span className="text-5xl font-black bg-gradient-to-r from-[#FF6B35] to-[#FFB347] bg-clip-text text-transparent">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </span>
                    <span className="text-white font-bold text-xl">{stat.label}</span>
                    <span className="text-zinc-500 text-sm">{stat.sub}</span>
                  </motion.div>
                ))}
              </div>

              {/* Fila inferior — 2 stats + banner */}
              <div className="grid grid-cols-2 gap-5">
                {impactStats.slice(2, 4).map((stat, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white/5 border border-white/8 rounded-3xl p-8 flex flex-col gap-1"
                  >
                    <span className="text-5xl font-black bg-gradient-to-r from-[#FF6B35] to-[#FFB347] bg-clip-text text-transparent">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </span>
                    <span className="text-white font-bold text-xl">{stat.label}</span>
                    <span className="text-zinc-500 text-sm">{stat.sub}</span>
                  </motion.div>
                ))}
              </div>

              {/* Banner inferior */}
              <div className="bg-gradient-to-r from-[#FF6B35]/15 to-[#FFB347]/10 border border-[#FF6B35]/20 rounded-3xl p-6 flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-lg">Envío gratis</p>
                  <p className="text-zinc-400 text-sm">En compras mayores a $150.000 COP</p>
                </div>
                <FaTruck className="text-[#FF8C42] text-4xl" />
              </div>
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* CATEGORÍAS */}
      <section className="py-20">
        <div className="mb-12">
          <p className="text-[#FF8C42] font-medium mb-2 flex items-center gap-2">
            <FaFire /> Categorías
          </p>
          <h2 className="text-4xl font-black text-white">Explora por categoría</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.04, y: -5 }}
              onClick={() => navigate(`/products?category=${category.slug}`)}
              className="group bg-white/5 border border-white/8 hover:border-[#FF6B35]/30 rounded-3xl p-8 cursor-pointer overflow-hidden relative transition-all duration-300"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${category.color}`} />
              <div className="relative z-10">
                <div className={`text-5xl ${category.accent} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                <p className="text-zinc-500 text-sm mb-4">Descubre los mejores productos</p>
                <span className={`inline-flex items-center gap-1 text-sm ${category.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium`}>
                  Ver todos <FaArrowRight className="text-xs" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-[#FF8C42] font-medium mb-2 flex items-center gap-2">
              <FaFire /> Destacados
            </p>
            <h2 className="text-4xl font-black text-white">Productos populares</h2>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="hidden md:flex items-center gap-2 text-zinc-500 hover:text-[#FF8C42] transition text-sm font-medium group"
          >
            Ver todos
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/8 rounded-3xl h-72 animate-pulse" />
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-16 text-zinc-600">
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
                className="group bg-white/5 border border-white/8 hover:border-[#FF6B35]/25 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300"
              >
                <div className="h-44 bg-white/5 overflow-hidden relative">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                      <FaShoppingBag className="text-4xl" />
                    </div>
                  )}
                  {product.categoryName && (
                    <span className="absolute top-3 left-3 bg-black/70 text-[#FF8C42] text-xs px-3 py-1 rounded-full border border-[#FF6B35]/20">
                      {product.categoryName}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-white font-bold mb-1 truncate group-hover:text-[#FF8C42] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-zinc-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#FF8C42] font-bold text-lg">
                      {formatPrice(product.basePrice)}
                    </span>
                    <span className="flex items-center gap-1 text-[#FFB347] text-xs">
                      <FaStar /> <span className="text-zinc-500">Nuevo</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <button
            onClick={() => navigate("/products")}
            className="border border-white/10 text-white px-8 py-3 rounded-2xl font-medium hover:border-[#FF6B35]/30 transition"
          >
            Ver todos los productos
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="pb-24 pt-12">
        <div className="border border-white/8 rounded-[40px] p-10">
          <div className="text-center mb-14">
            <p className="text-[#FF8C42] font-medium mb-3">¿Por qué ShopFlow?</p>
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
                className="bg-white/5 border border-white/8 hover:border-[#FF6B35]/30 rounded-3xl p-8 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6B35]/20 to-[#FFB347]/10 flex items-center justify-center text-2xl text-[#FF8C42] mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </MainLayout>
  );
}

export default Home;