import { useNavigate } from 'react-router-dom';
import { Button, Typography, Row, Col, Card, Layout } from 'antd';
import { SafetyCertificateOutlined, ThunderboltOutlined, TeamOutlined, RocketOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const { Title, Paragraph } = Typography;

export default function LandingPage() {
  const nav = useNavigate();
  const auth = useSelector(s => s.auth);
  return (
    <Layout style={{ background: '#FFF' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 80 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <SafetyCertificateOutlined style={{ fontSize: 28, color: '#2563EB' }} />
            <span style={{ fontSize: 22, fontWeight: 700 }}>CyberEdu</span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {auth.isAuthenticated ? (
              <Button type="primary" size="large" onClick={() => nav('/catalog')}>К обучению</Button>
            ) : (
              <>
                <Button size="large" onClick={() => nav('/login')}>Войти</Button>
                <Button type="primary" size="large" onClick={() => nav('/register')}>Начать</Button>
              </>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'center', paddingBottom: 60 }}>
          <Title level={1} style={{ fontSize: 48, fontWeight: 800 }}>Научись защищать себя в цифровом мире</Title>
          <Paragraph style={{ fontSize: 18, color: '#6B7280', maxWidth: 700, margin: '0 auto 32px' }}>
            Интерактивная платформа для изучения основ информационной безопасности.
          </Paragraph>
          <Button type="primary" size="large" onClick={() => nav(auth.isAuthenticated ? '/catalog' : '/register')} style={{ height: 52, padding: '0 40px', fontSize: 17, borderRadius: 12 }}>
            {auth.isAuthenticated ? 'В каталог' : 'Начать бесплатно'}
          </Button>
        </div>
        <Row gutter={[24, 24]}>
          {[
            { icon: <SafetyCertificateOutlined style={{ fontSize: 36, color: '#2563EB' }} />, title: 'Безопасная среда', desc: 'Изолированные браузерные симуляции' },
            { icon: <ThunderboltOutlined style={{ fontSize: 36, color: '#16A34A' }} />, title: 'Тренажёры', desc: 'Фишинг, пароли, соц. инженерия, права доступа' },
            { icon: <TeamOutlined style={{ fontSize: 36, color: '#D97706' }} />, title: 'Преподавателям', desc: 'Группы, назначения, мониторинг' },
            { icon: <RocketOutlined style={{ fontSize: 36, color: '#7C3AED' }} />, title: 'Геймификация', desc: 'Баллы, достижения, рейтинги' },
          ].map((f, i) => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <Card hoverable style={{ borderRadius: 16, textAlign: 'center', height: '100%' }}>
                <div style={{ marginBottom: 16 }}>{f.icon}</div>
                <Title level={4}>{f.title}</Title>
                <Paragraph type="secondary">{f.desc}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Layout>
  );
}