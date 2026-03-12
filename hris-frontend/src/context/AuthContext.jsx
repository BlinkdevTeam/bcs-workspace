import { createContext, useContext } from "react";

// Create the context
export const AuthContext = createContext(null);

// Hook to access auth context
export const useAuth = () => useContext(AuthContext);