// src/context/apiAuthHelper.js
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

export function logout() {
  window.__AUTH_TOKEN__ = null; // clear in-memory token
  history.push("/login"); // redirect to login
  window.location.reload(); // force re-render
}
