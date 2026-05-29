import api from "./axios";

export const loginRequest = async (data) => {

  const response = await api.post(
    "/api/auth/login",
    data
  );

  return response.data;
};

export const registerRequest = async (data) => {

  const response = await api.post(
    "/api/auth/register",
    data
  );

  return response.data;
};

export const meRequest = async () => {

  const response = await api.get(
    "/api/auth/me"
  );

  return response.data;
};