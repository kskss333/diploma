import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LockOutlined } from '@ant-design/icons';

export default function ForbiddenPage() {
  const nav = useNavigate();

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FEF2F2, #FFF5F5, #FEFCE8)',
      padding: 24,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 100, height: 100, borderRadius: 28,
          background: 'linear-gradient(135deg, #DC2626, #EF4444)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 28px',
          boxShadow: '0 16px 40px rgba(220,38,38,0.3)',
        }}>
          <LockOutlined style={{ fontSize: 48, color: '#FFF' }} />
        </div>
        <Result
          status="403"
          title={<span style={{ fontWeight: 800, fontSize: 30, color: '#0F172A' }}>Доступ запрещён</span>}
          subTitle={<span style={{ fontSize: 16, color: '#64748B' }}>У вас недостаточно прав для просмотра этой страницы.</span>}
          extra={
            <Button type="primary" size="large" onClick={() => nav('/catalog')}
              style={{ borderRadius: 14, height: 50, fontWeight: 600, padding: '0 32px', boxShadow: '0 6px 20px rgba(37,99,235,0.3)' }}>
              Вернуться в каталог
            </Button>
          }
        />
      </div>
    </div>
  );
}