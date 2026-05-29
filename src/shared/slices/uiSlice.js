import { createSlice } from '@reduxjs/toolkit';
const slice = createSlice({
  name: 'ui',
  initialState: { sidebarCollapsed: false, globalLoading: false, notifications: [] },
  reducers: {
    toggleSidebar: s => { s.sidebarCollapsed = !s.sidebarCollapsed; },
    setGlobalLoading: (s, a) => { s.globalLoading = a.payload; },
    addNotification: (s, a) => { s.notifications.push({ id: Date.now(), ...a.payload }); },
    removeNotification: (s, a) => { s.notifications = s.notifications.filter(n => n.id !== a.payload); },
  },
});
export const { toggleSidebar, setGlobalLoading, addNotification, removeNotification } = slice.actions;
export default slice.reducer;