export const API_ROUTES = {
  auth: {
    register: "/auth/register/",
    login: "/auth/login/",
    logout: "/auth/logout/",
    users: "/auth/users/",
  },
  cards: {
    list: "/cards/",
    create: "/cards/create/",
    copy: "/cards/copy/",
    update: (cardId) => `/cards/${cardId}/update/`,
    delete: (cardId) => `/cards/${cardId}/delete/`,
  },
  tasks: {
    unassigned: "/tasks/",
    all: "/all-tasks/",
    create: "/tasks/create/",
    update: (taskId) => `/tasks/${taskId}/update/`,
    detach: (taskId) => `/tasks/${taskId}/delete/`,
    hardDelete: (taskId) => `/tasks/${taskId}/hard-delete/`,
  },
};