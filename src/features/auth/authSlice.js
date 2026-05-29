import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/shared/api/apiClient';

export const loginThunk = createAsyncThunk('auth/login', async (creds, { rejectWithValue }) => {
  try { const r = await apiClient.post('/auth/login', creds); return r.data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Ошибка'); }
});
export const registerThunk = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try { const r = await apiClient.post('/auth/register', data); return r.data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Ошибка'); }
});
export const logoutThunk = createAsyncThunk('auth/logout', async () => { await apiClient.post('/auth/logout'); });

const slice = createSlice({
  name: 'auth',
  initialState: { user: null, status: 'idle', error: null, isAuthenticated: false },
  reducers: {
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, s => { s.status = 'loading'; s.error = null; })
      .addCase(loginThunk.fulfilled, (s, a) => { s.status = 'succeeded'; s.user = a.payload.user; s.isAuthenticated = true; if (a.payload.csrfToken) sessionStorage.setItem('csrf_token', a.payload.csrfToken); })
      .addCase(loginThunk.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; })
      .addCase(logoutThunk.fulfilled, s => { s.user = null; s.isAuthenticated = false; s.status = 'idle'; sessionStorage.removeItem('csrf_token'); });
  },
});

export const { clearError } = slice.actions;
export default slice.reducer;