import Navbar from "../../components/common/Navbar";
import AdminSidebar from "../components/AdminSidebar";

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      <Navbar />

      <div className="flex">

        <AdminSidebar />

        <main className="flex-1 p-8">
          {children}
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;