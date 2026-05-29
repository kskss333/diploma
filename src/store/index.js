import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import progressReducer from '@/features/progress/progressSlice';
import catalogReducer from '@/features/catalog/catalogSlice';
import uiReducer from '@/shared/slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    progress: progressReducer,
    catalog: catalogReducer,
    ui: uiReducer,
  },
});