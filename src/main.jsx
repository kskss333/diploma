import './app/styles/global.css';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import App from './app/App';
import { store } from './store';

async function bootstrap() {
  const { worker } = await import('./mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
  console.log('[MSW] Мок-сервер запущен');

  // Восстанавливаем прогресс из localStorage при старте
  try {
    await fetch('/api/progress/restore');
    console.log('[MSW] Прогресс восстановлен из localStorage');
  } catch (e) {
    console.warn('[MSW] Не удалось восстановить прогресс');
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Provider store={store}>
        <ConfigProvider
          locale={ruRU}
          theme={{
            token: {
              colorPrimary: '#2563EB',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              borderRadius: 10,
              colorSuccess: '#16A34A',
              colorError: '#DC2626',
              colorWarning: '#D97706',
              colorBgLayout: '#F9FAFB',
              colorText: '#111827',
              colorTextSecondary: '#6B7280',
              fontSize: 14,
              controlHeight: 40,
            },
            components: {
              Card: {
                borderRadiusLG: 16,
              },
              Button: {
                borderRadius: 12,
                controlHeight: 44,
                fontWeight: 600,
              },
              Input: {
                borderRadius: 12,
                controlHeight: 48,
              },
              Select: {
                borderRadius: 12,
                controlHeight: 44,
              },
              Modal: {
                borderRadiusLG: 20,
              },
              Tag: {
                borderRadiusSM: 8,
              },
            },
          }}
        >
          <App />
        </ConfigProvider>
      </Provider>
    </StrictMode>
  );
}

bootstrap();