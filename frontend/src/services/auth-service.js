import api from "@/lib/api";
import { API_ROUTES } from "@/constants/api";

export function registerUser(payload) {
  return api.post(API_ROUTES.auth.register, payload);
}

export function loginUser(payload) {
  return api.post(API_ROUTES.auth.login, payload);
}

export function logoutUser() {
  return api.post(API_ROUTES.auth.logout);
}

export function fetchUsers() {
  return api.get(API_ROUTES.auth.users);
}