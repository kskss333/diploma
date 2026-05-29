import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Card, message } from 'antd';
import { MailOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk } from '@/features/auth/authSlice';

const { Title, Text } = Typography;

export default function LoginPage() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { status, error, isAuthenticated } = useSelector(s => s.auth);
  const [tries, setTries] = useState(0);
  const [lock, setLock] = useState(null);

  const isLocked = lock ? new Date().getTime() < lock : false;

  useEffect(() => { if (isAuthenticated) nav('/catalog', { replace: true }); }, [isAuthenticated, nav]);
  useEffect(() => { if (error) message.error(error); }, [error]);

  const submit = async (v) => {
    if (isLocked) { message.warning(`Ждите ${Math.ceil((lock - Date.now()) / 1000)}с`); return; }
    const r = await dispatch(loginThunk({ email: v.email, password: v.password }));
    if (r.meta.requestStatus === 'rejected') {
      const n = tries + 1; setTries(n);
      if (n > 3) setLock(Date.now() + Math.min(2 ** (n - 3) * 1000, 300000));
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB' }}>
      <Card style={{ width: 440, borderRadius: 16 }} bodyStyle={{ padding: '40px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <SafetyCertificateOutlined style={{ fontSize: 48, color: '#2563EB' }} />
          <Title level={3} style={{ marginTop: 12 }}>Вход</Title>
        </div>
        <Form onFinish={submit} layout="vertical" size="large">
          <Form.Item name="email" rules={[{ required: true, type: 'email' }]}><Input prefix={<MailOutlined />} placeholder="Email" /></Form.Item>
          <Form.Item name="password" rules={[{ required: true }]}><Input.Password prefix={<LockOutlined />} placeholder="Пароль" /></Form.Item>
          <Button type="primary" htmlType="submit" loading={status === 'loading'} block disabled={isLocked} style={{ height: 48, borderRadius: 10 }}>Войти</Button>
        </Form>
        <div style={{ textAlign: 'center', marginTop: 16 }}><Link to="/register">Регистрация</Link></div>
        <div style={{ marginTop: 24, padding: 16, background: '#F0FDF4', borderRadius: 10, fontSize: 13 }}>
          <Text strong style={{ color: '#16A34A' }}>Демо:</Text><br />
          student@test.ru / password<br />teacher@test.ru / password
        </div>
      </Card>
    </div>
  );
}