import Navbar from "../components/common/Navbar";

function MainLayout({ children }) {

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b]">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#3b82f620,transparent_40%)]"></div>

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