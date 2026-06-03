import api from "./axios";

/* ===========================
   PRODUCTOS
=========================== */

export const getProductsRequest = async (
  page = 0,
  size = 12,
  sort = "createdAt"
) => {
  const response = await api.get(
    `/api/catalog/products?page=${page}&size=${size}&sort=${sort}`
  );

  return response.data;
};

export const getProductByIdRequest = async (id) => {
  const response = await api.get(`/api/catalog/products/${id}`);
  return response.data;
};

export const searchProductsRequest = async (
  query,
  page = 0,
  size = 12
) => {
  const response = await api.get(
    `/api/catalog/products/search?query=${query}&page=${page}&size=${size}`
  );

  return response.data;
};

export const getProductsByCategoryRequest = async (
  categoryId,
  page = 0,
  size = 12
) => {
  const response = await api.get(
    `/api/catalog/products/category/${categoryId}?page=${page}&size=${size}`
  );

  return response.data;
};

/* ===========================
   ADMIN PRODUCTOS
=========================== */

export const createProductRequest = async (data) => {
  const response = await api.post(
    "/api/catalog/products",
    data
  );

  return response.data;
};

export const updateProductRequest = async (id, data) => {
  const response = await api.put(
    `/api/catalog/products/${id}`,
    data
  );

  return response.data;
};

export const deleteProductRequest = async (id) => {
  const response = await api.delete(
    `/api/catalog/products/${id}`
  );

  return response.data;
};

/* ===========================
   CATEGORIAS
=========================== */

export const getCategoriesRequest = async () => {
  const response = await api.get(
    "/api/catalog/categories"
  );

  return response.data;
};

export const createCategoryRequest = async (data) => {
  const response = await api.post(
    "/api/catalog/categories",
    data
  );

  return response.data;
};