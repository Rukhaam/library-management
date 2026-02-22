import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
  name: "popup",
  initialState: {
    settingPopup: false,
    addBookPopup: false,
    readBookPopup: false,
    recordBookPopup: false,
    returnBookPopup: false,
    addNewAdminPopup: false,
  },
  reducers: {
    // Toggles for each specific popup
    toggleSettingPopup: (state) => {
      state.settingPopup = !state.settingPopup;
    },
    toggleAddBookPopup: (state) => {
      state.addBookPopup = !state.addBookPopup;
    },
    toggleReadBookPopup: (state) => {
      state.readBookPopup = !state.readBookPopup;
    },
    toggleRecordBookPopup: (state) => {
      state.recordBookPopup = !state.recordBookPopup;
    },
    toggleReturnBookPopup: (state) => {
      state.returnBookPopup = !state.returnBookPopup;
    },
    toggleAddNewAdminPopup: (state) => {
      state.addNewAdminPopup = !state.addNewAdminPopup;
    },
    
    // Utility to easily close everything at once (e.g., on page navigation)
    closeAllPopups: (state) => {
      state.settingPopup = false;
      state.addBookPopup = false;
      state.readBookPopup = false;
      state.recordBookPopup = false;
      state.returnBookPopup = false;
      state.addNewAdminPopup = false;
    },
  },
});

// Export all the toggle actions so your components can dispatch them
export const {
  toggleSettingPopup,
  toggleAddBookPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
  toggleReturnBookPopup,
  toggleAddNewAdminPopup,
  closeAllPopups,
} = popupSlice.actions;

// Export the reducer to add to the main store
export default popupSlice.reducer;