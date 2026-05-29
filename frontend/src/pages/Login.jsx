import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginRequest } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";

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
      login(data.accessToken, {
        id: data.userId,
        email: data.email,
        role: data.role,
      });
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
        <div className="relative w-full max-w-md">
          <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />

          <form
            onSubmit={handleLogin}
            className="relative z-10 w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl"
          >
            <div className="text-center mb-10">
              <h1 className="text-5xl font-bold text-white mb-3">ShopFlow</h1>
              <p className="text-slate-300 text-lg">Bienvenido nuevamente</p>
            </div>

            {error && (
              <div className="mb-5 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-sm text-center">
                {error}
              </div>
            )}

            <div className="mb-5">
              <label className="block text-slate-200 mb-2 font-medium">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="ejemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/40 transition-all"
              />
            </div>

            <div className="mb-8">
              <label className="block text-slate-200 mb-2 font-medium">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/40 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all duration-300 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-blue-500/30"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>

            <p className="text-center text-slate-400 mt-6 text-sm">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="text-blue-400 hover:text-blue-300">
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