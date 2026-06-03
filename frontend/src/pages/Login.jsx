import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginRequest } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";
import logo from "../assets/shopflow-logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginRequest({ email, password });
      login(data.accessToken, { id: data.userId, email: data.email, role: data.role });
      navigate("/");
    } catch (err) {
      setError("Email o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-center py-20">
        <div className="w-full max-w-md">
          <form
            onSubmit={handleLogin}
            className="bg-white/5 border border-white/10 rounded-3xl p-10"
          >
            {/* Logo */}
            <div className="flex flex-col items-center mb-10">
              <img src={logo} alt="ShopFlow" className="h-30 w-auto object-contain mb-4" />
              <p className="text-zinc-400 text-lg">Bienvenido nuevamente</p>
            </div>

            {error && (
              <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div className="mb-5">
              <label className="block text-zinc-300 mb-2 font-medium text-sm">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="ejemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 outline-none focus:border-[#FF6B35]/50 transition-all"
              />
            </div>

            <div className="mb-8">
              <label className="block text-zinc-300 mb-2 font-medium text-sm">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 outline-none focus:border-[#FF6B35]/50 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FFB347] hover:opacity-90 disabled:opacity-50 transition text-black font-bold py-4 rounded-2xl shadow-lg shadow-[#FF6B35]/20"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>

            <p className="text-center text-zinc-500 mt-6 text-sm">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="text-[#FF8C42] hover:text-[#FFB347] transition">
                Regístrate
              </Link>
            </p>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default Login;