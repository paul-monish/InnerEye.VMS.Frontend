const API = import.meta.env.VITE_API_BASE_URL || "/api";
export default {
  auth: {
    login: `${API}/auth/login`,
    refresh: `${API}/auth/refresh`,
    revoke: `${API}/auth/revoke`,
    forgotPassword: `${API}/auth/forgot-password`,
    resetPassword: `${API}/auth/reset-password`,
  },
  users: { base: `${API}/user`, byId: (id) => `${API}/user/${id}` },
  vendors: {
    base: `${API}/vendor`,
    register: `${API}/vendor/register`,
    byId: (id) => `${API}/vendor/${id}`,
    documents: (id) => `${API}/vendor/${id}/documents`,
    documentFile: (vendorId, docId) =>
      `${API}/vendor/${vendorId}/documents/${docId}`,
    approve: (id) => `${API}/vendor/${id}/approve`,
    activate: (id) => `${API}/vendor/${id}/activate`,
    export: `${API}/vendor/export`,
  },
};
