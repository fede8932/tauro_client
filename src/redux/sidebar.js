import { createSlice } from '@reduxjs/toolkit';

function isPosMode() {
  return window.location.search.includes('pos=true');
}

function loadSidebarState() {
  if (isPosMode()) return false;
  try {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  } catch {
    return true;
  }
}

const initialState = {
  isOpen: loadSidebarState(),
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen;
      if (isPosMode()) return;
      try {
        localStorage.setItem('sidebarOpen', JSON.stringify(state.isOpen));
      } catch { /* ignore */ }
    },
  },
});

export const { toggleSidebar } = sidebarSlice.actions;

export default sidebarSlice.reducer;
