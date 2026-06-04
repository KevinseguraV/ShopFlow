import api from "../../api/axios";

// Productos
export const getAdminProductsRequest = (page = 0, size = 20) =>
  api.get(`/api/catalog/products?page=${page}&size=${size}`).then((r) => r.data);

export const createProductRequest = (payload) =>
  api.post("/api/catalog/products", payload).then((r) => r.data);

export const deleteProductRequest = (id) =>
  api.delete(`/api/catalog/products/${id}`);

// Categorías
export const getCategoriesRequest = () =>
  api.get("/api/catalog/categories").then((r) => r.data);

export const createCategoryRequest = (payload) =>
  api.post("/api/catalog/categories", payload).then((r) => r.data);

export const deleteCategoryRequest = (id) =>
  api.delete(`/api/catalog/categories/${id}`);

// Inventario
export const getInventoryRequest = () =>
  api.get("/api/inventory").then((r) => r.data);

export const getInventoryByProductRequest = (productId) =>
  api.get(`/api/inventory/${productId}`).then((r) => r.data);

export const createInventoryRequest = (payload) =>
  api.post("/api/inventory", payload).then((r) => r.data);

// Órdenes admin
export const getAdminOrdersRequest = (page = 0, size = 20) =>
  api.get(`/api/orders/admin?page=${page}&size=${size}`).then((r) => r.data);