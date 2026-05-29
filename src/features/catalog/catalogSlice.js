import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/shared/api/apiClient';

export const fetchModules = createAsyncThunk('catalog/fetch', async () => {
  const r = await apiClient.get('/modules');
  return r.data.modules;
});

const slice = createSlice({
  name: 'catalog',
  initialState: { modules: [], status: 'idle', filters: { category: null, difficulty: null, search: '' } },
  reducers: {
    setFilter(state, action) { state.filters = { ...state.filters, ...action.payload }; },
    resetFilters(state) { state.filters = { category: null, difficulty: null, search: '' }; },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchModules.pending, s => { s.status = 'loading'; })
      .addCase(fetchModules.fulfilled, (s, a) => { s.status = 'succeeded'; s.modules = a.payload; });
  },
});

export const { setFilter, resetFilters } = slice.actions;
export default slice.reducer;