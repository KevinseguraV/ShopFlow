import api from "../../api/axios";

export const getAdminProductsRequest = async (
  page = 0,
  size = 20
) => {
  const response = await api.get(
    `/api/catalog/products?page=${page}&size=${size}`
  );

  return response.data;
};

export const deleteProductRequest = async (id) => {
  await api.delete(`/api/catalog/products/${id}`);
};