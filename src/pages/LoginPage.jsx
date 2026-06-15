import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Card, message } from 'antd';
import { MailOutlined, LockOutlined, SafetyCertificateOutlined, ArrowRightOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
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
    if (isLocked) {
      message.warning(`Слишком много попыток. Подождите ${Math.ceil((lock - Date.now()) / 1000)} сек.`);
      return;
    }
    const r = await dispatch(loginThunk({ email: v.email, password: v.password }));
    if (r.meta.requestStatus === 'rejected') {
      const n = tries + 1; setTries(n);
      if (n > 3) setLock(Date.now() + Math.min(2 ** (n - 3) * 1000, 300000));
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 25%, #EEF2FF 50%, #FAFEFF 100%)',
      padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      <div style={{ position: 'absolute', top: -120, right: -80, width: 400, height: 400, background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -100, left: -60, width: 350, height: 350, background: 'radial-gradient(circle, rgba(22,163,74,0.05) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <Card
        style={{
          width: '100%', maxWidth: 460, borderRadius: 24,
          boxShadow: '0 25px 60px rgba(37,99,235,0.08), 0 8px 20px rgba(0,0,0,0.04)',
          border: '1px solid #E2E8F0', position: 'relative', zIndex: 1,
        }}
        bodyStyle={{ padding: '44px 36px' }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 10px 30px rgba(37,99,235,0.3)',
          }}>
            <SafetyCertificateOutlined style={{ fontSize: 36, color: '#FFFFFF' }} />
          </div>
          <Title level={2} style={{ fontWeight: 800, marginBottom: 6, fontSize: 28, letterSpacing: '-0.02em' }}>
            С возвращением!
          </Title>
          <Text type="secondary" style={{ fontSize: 15 }}>Войдите в свой аккаунт CyberEdu</Text>
        </div>

        {/* Form */}
        <Form layout="vertical" onFinish={submit} size="large" requiredMark={false}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Некорректный формат email' },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#94A3B8' }} />}
              placeholder="Электронная почта"
              style={{ borderRadius: 14, height: 52, fontSize: 15 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Введите пароль' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#94A3B8' }} />}
              placeholder="Пароль"
              iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              style={{ borderRadius: 14, height: 52, fontSize: 15 }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={status === 'loading'}
              block
              disabled={isLocked}
              icon={<ArrowRightOutlined />}
              style={{
                height: 54, borderRadius: 14, fontSize: 16, fontWeight: 600,
                boxShadow: '0 6px 24px rgba(37,99,235,0.35)',
                letterSpacing: '0.01em',
              }}
            >
              Войти в аккаунт
            </Button>
          </Form.Item>
        </Form>

        {/* Links */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link to="/register" style={{ fontSize: 14, fontWeight: 500, color: '#2563EB' }}>
            Нет аккаунта? Зарегистрироваться
          </Link>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
          <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Демо-доступ</Text>
          <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
        </div>

        {/* Demo credentials */}
        <div style={{
          padding: 20, borderRadius: 16,
          background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)',
          border: '1px solid #BBF7D0',
        }}>
          <Text strong style={{ color: '#16A34A', fontSize: 13, display: 'block', marginBottom: 10 }}>
            🔑 Данные для входа:
          </Text>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#374151', lineHeight: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Ученик:</span>
              <span>student@test.ru / password</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Учитель:</span>
              <span>teacher@test.ru / password</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Админ:</span>
              <span>admin@test.ru / password</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}