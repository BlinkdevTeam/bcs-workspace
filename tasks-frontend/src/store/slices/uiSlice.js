import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  modalOpen: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    openModal: (state, action) => {
      state.modalOpen = action.payload;
    },
    closeModal: (state) => {
      state.modalOpen = null;
    },
  },
});

export const { setLoading, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;