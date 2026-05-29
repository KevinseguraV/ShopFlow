import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />

        <Route path="/cart" element={
          <ProtectedRoute>
            <div className="text-white p-10">Carrito — próximamente</div>
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <div className="text-white p-10">Órdenes — próximamente</div>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;