// Demo data layer. Swap these for real fetch() calls when a backend exists.
const wait = (v, ms = 150) => new Promise((res) => setTimeout(() => res(v), ms));
export const api = {
  get: (resource) => wait({ resource }),
  post: (resource, payload) => wait({ resource, payload, ok: true }),
};
export default api;
