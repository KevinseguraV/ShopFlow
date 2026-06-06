import api from "./axios";

export const getInventoryByProductRequest = (productId) =>
  api.get(`/api/inventory/${productId}`).then((r) => r.data);

export const getInventoryRequest = () =>
  api.get("/api/inventory").then((r) => r.data);