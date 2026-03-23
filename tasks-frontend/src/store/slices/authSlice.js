import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user:         null,   // { id, employee_code, first_name, last_name, email, avatar_initials, position, status }
  accessToken:  null,   // JWT — lives in memory only, never localStorage
  isLoading:    false,
  error:        null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Called after successful login or silent refresh
    setCredentials(state, action) {
      state.user        = action.payload.employee;
      state.accessToken = action.payload.access_token;
      state.error       = null;
    },
    // Called on logout or auth failure
    clearCredentials(state) {
      state.user        = null;
      state.accessToken = null;
      state.error       = null;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error     = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setCredentials, clearCredentials, setLoading, setError } = authSlice.actions;
export const logout = clearCredentials;

// Selectors
export const selectUser        = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIsAuth      = (state) => !!state.auth.accessToken;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError   = (state) => state.auth.error;

export default authSlice.reducer;