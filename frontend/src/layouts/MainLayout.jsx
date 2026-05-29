
import Navbar from "../components/common/Navbar";

function MainLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b]">

      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:80px_80px]" />

      {/* Gradient top */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#3b82f620,transparent_40%)]" />

      {/* Blur effects */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl" />

      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative z-10">

        <Navbar />

        <main className="max-w-7xl mx-auto px-6">
          {children}
        </main>

      </div>

    </div>
  );
}

export default MainLayout;

