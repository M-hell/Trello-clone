import api from "@/lib/api";
import { API_ROUTES } from "@/constants/api";

export function fetchCards() {
  return api.get(API_ROUTES.cards.list);
}

export function createCard(payload) {
  return api.post(API_ROUTES.cards.create, payload);
}

export function updateCard(cardId, payload) {
  return api.post(API_ROUTES.cards.update(cardId), payload);
}

export function deleteCard(cardId) {
  return api.post(API_ROUTES.cards.delete(cardId));
}

export function copyCard(payload) {
  return api.post(API_ROUTES.cards.copy, payload);
}