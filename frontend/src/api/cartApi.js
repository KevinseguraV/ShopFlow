import api from "./axios";

// GET /api/cart — obtiene el carrito del usuario autenticado
export const getCartRequest = () =>
  api.get("/api/cart").then((res) => res.data);

// POST /api/cart/items — agrega un producto al carrito
export const addItemRequest = (productId, quantity, variantId = null, productName, slug, unitPrice) =>
  api
    .post("/api/cart/items", {
      productId,
      productName,
      slug,
      unitPrice,
      quantity,
    })
    .then((res) => res.data);

// PUT /api/cart/items/:productId — actualiza cantidad de un ítem
export const updateItemRequest = (productId, quantity) =>
  api
    .put(`/api/cart/items/${productId}`, { quantity })
    .then((res) => res.data);

// DELETE /api/cart/items/:productId — elimina un ítem del carrito
export const removeItemRequest = (productId) =>
  api.delete(`/api/cart/items/${productId}`).then((res) => res.data);

// DELETE /api/cart — vacía el carrito completo
export const clearCartRequest = () =>
  api.delete("/api/cart").then((res) => res.data);