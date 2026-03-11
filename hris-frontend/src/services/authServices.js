import api from "./api"; // Axios base instance

/**
 * Login user
 * @param {string} email
 * @param {string} password
 * @returns {Promise} Axios response
 */
export const loginUser = (email, password) => {
  return api.post("/auth/login", { email, password });
};
