import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function ForbiddenPage() {
  const nav = useNavigate();
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Result status="403" title="403" subTitle="Доступ запрещён" extra={<Button type="primary" onClick={() => nav('/catalog')}>В каталог</Button>} />
    </div>
  );
}