import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Card, Checkbox, message } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, ArrowRightOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { registerThunk } from '@/features/auth/authSlice';

const { Title, Text } = Typography;

export default function RegisterPage() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = async (v) => {
    setLoading(true);
    const r = await dispatch(registerThunk({
      email: v.email,
      username: v.username,
      password: v.password,
    }));
    setLoading(false);
    if (r.meta.requestStatus === 'fulfilled') {
      message.success('🎉 Регистрация прошла успешно! Теперь вы можете войти.');
      nav('/login');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 25%, #EFF6FF 50%, #FAFEFF 100%)',
      padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      <div style={{ position: 'absolute', top: -100, left: -80, width: 380, height: 380, background: 'radial-gradient(circle, rgba(22,163,74,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -120, right: -60, width: 350, height: 350, background: 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <Card
        style={{
          width: '100%', maxWidth: 500, borderRadius: 24,
          boxShadow: '0 25px 60px rgba(22,163,74,0.08), 0 8px 20px rgba(0,0,0,0.04)',
          border: '1px solid #E2E8F0', position: 'relative', zIndex: 1,
        }}
        bodyStyle={{ padding: '44px 36px' }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'linear-gradient(135deg, #16A34A, #22C55E)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 10px 30px rgba(22,163,74,0.3)',
          }}>
            <SafetyCertificateOutlined style={{ fontSize: 36, color: '#FFFFFF' }} />
          </div>
          <Title level={2} style={{ fontWeight: 800, marginBottom: 6, fontSize: 28, letterSpacing: '-0.02em' }}>
            Регистрация
          </Title>
          <Text type="secondary" style={{ fontSize: 15 }}>
            Создайте аккаунт и начните обучение кибербезопасности
          </Text>
        </div>

        {/* Form */}
        <Form layout="vertical" onFinish={submit} size="large" requiredMark={false}>
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Придумайте псевдоним' },
              { min: 3, message: 'Минимум 3 символа' },
              { max: 32, message: 'Максимум 32 символа' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#94A3B8' }} />}
              placeholder="Псевдоним"
              style={{ borderRadius: 14, height: 52, fontSize: 15 }}
            />
          </Form.Item>

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
            rules={[
              { required: true, message: 'Придумайте пароль' },
              { min: 8, message: 'Минимум 8 символов' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)|(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])|(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9])|(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9])/,
                message: 'Символы минимум трёх классов (A-Z, a-z, 0-9, спецсимволы)',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#94A3B8' }} />}
              placeholder="Пароль"
              style={{ borderRadius: 14, height: 52, fontSize: 15 }}
            />
          </Form.Item>

          <Form.Item
            name="consent"
            valuePropName="checked"
            rules={[
              { validator: (_, v) => v ? Promise.resolve() : Promise.reject('Необходимо согласие на обработку данных') },
            ]}
            style={{ marginBottom: 16 }}
          >
            <Checkbox style={{ fontSize: 13 }}>
              Я согласен на обработку персональных данных в соответствии с{' '}
              <a href="#" onClick={e => { e.preventDefault(); message.info('Политика конфиденциальности (демо-режим)'); }}>
                политикой конфиденциальности
              </a>
            </Checkbox>
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              icon={<ArrowRightOutlined />}
              style={{
                height: 54, borderRadius: 14, fontSize: 16, fontWeight: 600,
                boxShadow: '0 6px 24px rgba(22,163,74,0.35)',
                letterSpacing: '0.01em',
                background: 'linear-gradient(135deg, #16A34A, #22C55E)',
              }}
            >
              Зарегистрироваться
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Link to="/login" style={{ fontSize: 14, fontWeight: 500, color: '#2563EB' }}>
            Уже есть аккаунт? Войти
          </Link>
        </div>
      </Card>
    </div>
  );
}