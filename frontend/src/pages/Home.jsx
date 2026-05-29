import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

function Home() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#3b82f620,transparent_40%)]"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-32">
          <div className="max-w-3xl">
            <h1 className="text-7xl font-extrabold text-white leading-tight mb-8">
              El futuro del
              <span className="text-blue-400"> E-Commerce</span>
            </h1>
            <p className="text-slate-300 text-2xl leading-relaxed mb-10">
              Compra productos increíbles con una experiencia moderna,
              rápida y segura impulsada por microservicios.
            </p>
            <div className="flex gap-6">
              <button
                onClick={() => navigate("/products")}
                className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg shadow-blue-500/30"
              >
                Explorar productos
              </button>
              <button
                onClick={() => navigate("/products")}
                className="bg-white/10 border border-white/20 hover:bg-white/20 transition text-white px-8 py-4 rounded-2xl text-lg font-semibold"
              >
                Ver ofertas
              </button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default Home;