import { createContext, useContext } from "react";

// Create the AuthContext
export const AuthContext = createContext(null);

// Custom hook to use AuthContext
export function useAuth() {
  return useContext(AuthContext);
}