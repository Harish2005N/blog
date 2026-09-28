import api from "./index.js";

export const register = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");
export const getAllUsers = () => api.get("/auth/users");
export const promoteUser = (id) => api.patch(`/auth/users/${id}/role`);

export default { register, login, getMe, getAllUsers, promoteUser };
