import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Card, Checkbox, message } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { registerThunk } from '@/features/auth/authSlice';

const { Title } = Typography;

export default function RegisterPage() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = async (v) => {
    setLoading(true);
    const r = await dispatch(registerThunk({ email: v.email, username: v.username, password: v.password }));
    setLoading(false);
    if (r.meta.requestStatus === 'fulfilled') { message.success('Успех! Проверьте email.'); nav('/login'); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB' }}>
      <Card style={{ width: 480, borderRadius: 16 }} bodyStyle={{ padding: '40px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}><Title level={3}>Регистрация</Title></div>
        <Form onFinish={submit} layout="vertical" size="large">
          <Form.Item name="username" rules={[{ required: true, min: 3 }]}><Input prefix={<UserOutlined />} placeholder="Псевдоним" /></Form.Item>
          <Form.Item name="email" rules={[{ required: true, type: 'email' }]}><Input prefix={<MailOutlined />} placeholder="Email" /></Form.Item>
          <Form.Item name="password" rules={[{ required: true, min: 8 }]}><Input.Password prefix={<LockOutlined />} placeholder="Пароль" /></Form.Item>
          <Form.Item name="consent" valuePropName="checked" rules={[{ validator: (_, v) => v ? Promise.resolve() : Promise.reject('Нужно согласие') }]}>
            <Checkbox>Согласен на обработку данных</Checkbox>
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block style={{ height: 48, borderRadius: 10 }}>Зарегистрироваться</Button>
        </Form>
        <div style={{ textAlign: 'center', marginTop: 16 }}><Link to="/login">Войти</Link></div>
      </Card>
    </div>
  );
}