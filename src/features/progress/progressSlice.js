import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/shared/api/apiClient';

export const fetchProgress = createAsyncThunk('progress/fetch', async () => {
  const r = await apiClient.get('/progress');
  return r.data.progress;
});

export const saveProgress = createAsyncThunk('progress/save', async (data) => {
  await apiClient.post('/progress', data);
  return data;
});

const slice = createSlice({
  name: 'progress',
  initialState: { items: [], status: 'idle' },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProgress.fulfilled, (s, a) => { s.items = a.payload; s.status = 'succeeded'; })
      .addCase(saveProgress.fulfilled, (s, a) => {
        const idx = s.items.findIndex(p => p.module_id === a.payload.module_id);
        if (idx >= 0) s.items[idx] = { ...s.items[idx], ...a.payload };
        else s.items.push(a.payload);
      });
  },
});

export default slice.reducer;