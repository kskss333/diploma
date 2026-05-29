import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import App from './app/App';
import { store } from './store';
import './app/styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={ruRU} theme={{ token: { colorPrimary: '#2563EB', fontFamily: 'Inter, sans-serif', borderRadius: 8, colorSuccess: '#16A34A', colorError: '#DC2626', colorWarning: '#D97706', colorBgLayout: '#F9FAFB' } }}>
        <App />
      </ConfigProvider>
    </Provider>
  </StrictMode>
);