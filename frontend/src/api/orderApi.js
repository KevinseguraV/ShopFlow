import api from "./axios";

// Crear orden
export const createOrderRequest = (payload) =>
  api.post("/api/orders", payload)
    .then((res) => res.data);

// Obtener órdenes del usuario
export const getOrdersRequest = () =>
  api.get("/api/orders")
    .then((res) => res.data);

// Obtener detalle de una orden
export const getOrderByIdRequest = (id) =>
  api.get(`/api/orders/${id}`)
    .then((res) => res.data);