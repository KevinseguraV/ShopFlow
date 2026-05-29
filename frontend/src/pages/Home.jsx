
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
} from "react-icons/fa";

import MainLayout from "../layouts/MainLayout";

function Home() {
  const navigate = useNavigate();

  const categories = [
    {
      name: "Laptops",
      icon: <FaLaptop />,
    },
    {
      name: "Gaming",
      icon: <FaGamepad />,
    },
    {
      name: "Smartphones",
      icon: <FaMobileAlt />,
    },
    {
      name: "Audio",
      icon: <FaHeadphones />,
    },
  ];

  const stats = [
    {
      title: "+500",
      subtitle: "Productos",
    },
    {
      title: "24h",
      subtitle: "Envíos rápidos",
    },
    {
      title: "100%",
      subtitle: "Pagos seguros",
    },
    {
      title: "24/7",
      subtitle: "Soporte",
    },
  ];

  const features = [
    {
      icon: <FaTruck />,
      title: "Envíos rápidos",
      description: "Entrega rápida y segura de tus productos.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Pagos seguros",
      description: "Protección completa en cada compra.",
    },
    {
      icon: <FaHeadset />,
      title: "Soporte 24/7",
      description: "Atención disponible cuando la necesites.",
    },
  ];

  return (
    <MainLayout>

      {/* Glow Background */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HERO */}
      <section className="relative overflow-hidden py-28">

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >

            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm mb-8">
              <FaShoppingBag />
              Plataforma moderna de E-Commerce
            </div>

            <h1 className="text-6xl lg:text-7xl font-black text-white leading-tight mb-8">
              Compra tecnología de forma
              <span className="text-blue-400"> rápida</span>,
              <span className="text-cyan-400"> moderna</span> y segura
            </h1>

            <p className="text-slate-300 text-xl leading-relaxed mb-10 max-w-2xl">
              Descubre productos increíbles con una experiencia moderna,
              visual y optimizada con arquitectura basada en microservicios.
            </p>

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

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >

            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />

            <div className="absolute bottom-0 right-0 w-52 h-52 bg-cyan-500/20 rounded-full blur-3xl" />

            <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[40px] p-8 shadow-2xl">

              <div className="grid grid-cols-2 gap-5">

                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-white/10 rounded-3xl p-6 h-44 flex flex-col justify-between hover:scale-105 transition">
                  <FaLaptop className="text-4xl text-blue-400" />
                  <div>
                    <p className="text-white font-bold text-xl">Laptops</p>
                    <p className="text-slate-400 text-sm">
                      Alto rendimiento
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-white/10 rounded-3xl p-6 h-56 flex flex-col justify-between mt-10 hover:scale-105 transition">
                  <FaGamepad className="text-4xl text-pink-400" />
                  <div>
                    <p className="text-white font-bold text-xl">Gaming</p>
                    <p className="text-slate-400 text-sm">
                      Experiencia inmersiva
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-white/10 rounded-3xl p-6 h-56 flex flex-col justify-between -mt-10 hover:scale-105 transition">
                  <FaMobileAlt className="text-4xl text-cyan-400" />
                  <div>
                    <p className="text-white font-bold text-xl">
                      Smartphones
                    </p>
                    <p className="text-slate-400 text-sm">
                      Última generación
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/10 border border-white/10 rounded-3xl p-6 h-44 flex flex-col justify-between hover:scale-105 transition">
                  <FaHeadphones className="text-4xl text-orange-400" />
                  <div>
                    <p className="text-white font-bold text-xl">Audio</p>
                    <p className="text-slate-400 text-sm">
                      Sonido envolvente
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </section>

      {/* STATS */}
      <section className="py-12">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center hover:bg-white/15 transition"
            >
              <h2 className="text-4xl font-black text-white mb-2">
                {stat.title}
              </h2>

              <p className="text-slate-400">
                {stat.subtitle}
              </p>
            </motion.div>
          ))}

        </div>

      </section>

      {/* CATEGORIES */}
      <section className="py-24">

        <div className="mb-12">
          <p className="text-blue-400 font-medium mb-2">
            Categorías
          </p>

          <h2 className="text-4xl font-black text-white">
            Explora por categoría
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {categories.map((category, index) => (
            <motion.div
              key={index}
              whileHover={{
                scale: 1.04,
                y: -5,
              }}
              className="group bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 cursor-pointer overflow-hidden relative"
            >

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-blue-500/10 to-cyan-500/10" />

              <div className="relative z-10">
                <div className="text-5xl text-blue-400 mb-6">
                  {category.icon}
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  {category.name}
                </h3>

                <p className="text-slate-400">
                  Descubre productos increíbles
                </p>
              </div>

            </motion.div>
          ))}

        </div>

      </section>

      {/* FEATURES */}
      <section className="pb-24">

        <div className="bg-white/5 border border-white/10 rounded-[40px] p-10">

          <div className="text-center mb-14">
            <p className="text-blue-400 font-medium mb-3">
              Beneficios
            </p>

            <h2 className="text-4xl font-black text-white">
              Todo lo que necesitas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
              >

                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-2xl text-blue-400 mb-6">
                  {feature.icon}
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h3>

                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>

              </motion.div>
            ))}

          </div>

        </div>

      </section>

    </MainLayout>
  );
}

export default Home;

