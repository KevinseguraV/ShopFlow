import Navbar from "../components/common/Navbar";

function MainLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a]">
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