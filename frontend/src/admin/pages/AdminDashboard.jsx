import { useEffect, useState } from "react";

import AdminLayout from "../layouts/AdminLayout";

import {
  getProductsRequest,
  getCategoriesRequest,
} from "../../api/catalogApi";

function AdminDashboard() {

  const [productsCount, setProductsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {

      const productsData = await getProductsRequest(0, 1);

      setProductsCount(productsData.totalElements);

      const categoriesData = await getCategoriesRequest();

      setCategoriesCount(categoriesData.length);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AdminLayout>

      <h1 className="text-4xl font-black text-white mb-8">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
          <p className="text-zinc-500">
            Productos
          </p>

          <h2 className="text-4xl font-black text-white mt-2">
            {productsCount}
          </h2>
        </div>

        <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
          <p className="text-zinc-500">
            Categorías
          </p>

          <h2 className="text-4xl font-black text-white mt-2">
            {categoriesCount}
          </h2>
        </div>

        <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
          <p className="text-zinc-500">
            Órdenes
          </p>

          <h2 className="text-4xl font-black text-white mt-2">
            0
          </h2>
        </div>

      </div>

    </AdminLayout>
  );
}

export default AdminDashboard;