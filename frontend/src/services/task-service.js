import api from "@/lib/api";
import { API_ROUTES } from "@/constants/api";

export function fetchUnassignedTasks() {
  return api.get(API_ROUTES.tasks.unassigned);
}

export function fetchAllTasks() {
  return api.get(API_ROUTES.tasks.all);
}

export function createTask(payload) {
  return api.post(API_ROUTES.tasks.create, payload);
}

export function updateTask(taskId, payload) {
  return api.post(API_ROUTES.tasks.update(taskId), payload);
}

export function detachTask(taskId) {
  return api.post(API_ROUTES.tasks.detach(taskId));
}

export function hardDeleteTask(taskId) {
  return api.post(API_ROUTES.tasks.hardDelete(taskId));
}