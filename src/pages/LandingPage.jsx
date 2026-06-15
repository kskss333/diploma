import { useNavigate } from 'react-router-dom';
import { Button, Typography, Row, Col, Card, Layout } from 'antd';
import {
  SafetyCertificateOutlined, ThunderboltOutlined, TeamOutlined,
  RocketOutlined, MailOutlined, LockOutlined, UserSwitchOutlined,
  FileProtectOutlined, WifiOutlined, KeyOutlined,
  ArrowRightOutlined, StarFilled, PlayCircleOutlined,
  
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const { Title, Paragraph, Text } = Typography;

const features = [
  { icon: <MailOutlined />, title: 'Защита от фишинга', desc: '12 реалистичных симуляций фишинговых писем', color: '#DC2626', bg: '#FEF2F2' },
  { icon: <LockOutlined />, title: 'Парольная безопасность', desc: 'Оценка стойкости и демонстрация взлома в реальном времени', color: '#2563EB', bg: '#EFF6FF' },
  { icon: <UserSwitchOutlined />, title: 'Социальная инженерия', desc: 'Интерактивные диалоги с мошенниками', color: '#D97706', bg: '#FFFBEB' },
  { icon: <FileProtectOutlined />, title: 'Права доступа', desc: 'Настройка матриц доступа на практике', color: '#16A34A', bg: '#F0FDF4' },
  { icon: <WifiOutlined />, title: 'Безопасный Wi-Fi', desc: 'Риски публичных сетей и способы защиты', color: '#7C3AED', bg: '#F5F3FF' },
  { icon: <KeyOutlined />, title: 'Криптография', desc: 'Базовые принципы шифрования каждый день', color: '#0891B2', bg: '#ECFEFF' },
];

const stats = [
  { icon: <TeamOutlined />, value: '15', label: 'Учеников протестировали платформу' },
  { icon: <StarFilled />, value: '4,7 / 5', label: 'Средняя оценка понятности интерфейса' },
  { icon: <ThunderboltOutlined />, value: '4', label: 'Типа интерактивных тренажёров' },
  { icon: <RocketOutlined />, value: '100%', label: 'Учеников хотят продолжать обучение' },
];

const testimonials = [
  { name: 'Алина, 13 лет', text: 'Очень понравилось! Особенно тренажёр фишинга — теперь я знаю, как отличать настоящие письма от поддельных.' },
  { name: 'Гоша, 15 лет', text: 'Крутая платформа! Социальная инженерия — вообще огонь. Теперь я не попадусь на уловки мошенников.' },
  { name: 'Маргарита, 12 лет', text: 'Всё понятно и интересно. Я прошла весь модуль за один раз и хочу ещё!' },
];

export default function LandingPage() {
  const nav = useNavigate();
  const { isAuthenticated } = useSelector(s => s.auth);
  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(true), []);

  return (
    <Layout style={{ background: '#FFFFFF' }}>
      {/* ===== NAVBAR ===== */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #E2E8F0',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => nav('/')}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #2563EB, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
              <SafetyCertificateOutlined style={{ fontSize: 20, color: '#FFF' }} />
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>CyberEdu</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {isAuthenticated ? (
              <Button type="primary" size="large" icon={<RocketOutlined />} onClick={() => nav('/catalog')} style={{ borderRadius: 10, height: 44, fontWeight: 600 }}>В каталог</Button>
            ) : (
              <>
                <Button size="large" onClick={() => nav('/login')} style={{ borderRadius: 10, height: 44, fontWeight: 500 }}>Войти</Button>
                <Button type="primary" size="large" onClick={() => nav('/register')} style={{ borderRadius: 10, height: 44, fontWeight: 600 }}>Начать обучение</Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ===== HERO ===== */}
      <div className="hero-section" style={{ padding: '80px 24px 40px', position: 'relative' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s ease-out' }}>
            <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', padding: '8px 20px', borderRadius: 50, marginBottom: 24, fontSize: 14, fontWeight: 600, color: '#2563EB' }}>
              🚀 Интерактивная платформа для обучения кибербезопасности
            </div>
            <Title level={1} style={{ fontSize: 54, fontWeight: 900, marginBottom: 20, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
              Научись защищать себя<br />в цифровом мире
            </Title>
            <Paragraph style={{ fontSize: 19, color: '#64748B', maxWidth: 650, margin: '0 auto 36px', lineHeight: 1.7 }}>
              Интерактивные тренажёры, реальные сценарии кибератак и теория в одном месте. Создано специально для школьников и студентов.
            </Paragraph>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button type="primary" size="large" icon={<PlayCircleOutlined />} onClick={() => nav(isAuthenticated ? '/catalog' : '/register')}
                style={{ height: 54, padding: '0 32px', fontSize: 17, borderRadius: 14, fontWeight: 600, boxShadow: '0 6px 24px rgba(37,99,235,0.35)' }}>
                {isAuthenticated ? 'В каталог модулей' : 'Начать бесплатно'}
              </Button>
              <Button size="large" icon={<ArrowRightOutlined />} onClick={() => nav('/login')}
                style={{ height: 54, padding: '0 32px', fontSize: 17, borderRadius: 14, fontWeight: 500 }}>
                Уже есть аккаунт
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 40px' }}>
        <Row gutter={[16, 16]}>
          {stats.map((s, i) => (
            <Col xs={12} sm={6} key={i}>
              <div style={{ background: '#FFF', borderRadius: 18, padding: '24px 16px', textAlign: 'center', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.3s ease', animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both` }}>
                <div style={{ fontSize: 28, color: '#2563EB', marginBottom: 10 }}>{s.icon}</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.4 }}>{s.label}</div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* ===== FEATURES ===== */}
      <div style={{ background: '#F8FAFC', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <Title level={2} style={{ fontWeight: 800, fontSize: 36, marginBottom: 12, color: '#0F172A', letterSpacing: '-0.02em' }}>Чему вы научитесь</Title>
            <Paragraph style={{ fontSize: 17, color: '#64748B', maxWidth: 600, margin: '0 auto' }}>8 модулей, 4 типа тренажёров, реальные сценарии кибератак</Paragraph>
          </div>
          <Row gutter={[24, 24]}>
            {features.map((f, i) => (
              <Col xs={24} sm={12} lg={8} key={i}>
                <Card hoverable style={{ borderRadius: 20, border: '1px solid #E2E8F0', height: '100%', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', transition: 'all 0.3s ease' }}
                  bodyStyle={{ padding: '30px 24px' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: 26, color: f.color }}>
                    {f.icon}
                  </div>
                  <Title level={4} style={{ fontWeight: 700, marginBottom: 8, textAlign: 'center', fontSize: 17 }}>{f.title}</Title>
                  <Paragraph style={{ color: '#64748B', textAlign: 'center', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* ===== TESTIMONIALS ===== */}
      <div style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Title level={2} style={{ fontWeight: 800, fontSize: 34, marginBottom: 12, color: '#0F172A' }}>Что говорят ученики</Title>
            <Paragraph style={{ fontSize: 16, color: '#64748B' }}>Реальные отзывы по результатам тестирования платформы</Paragraph>
          </div>
          <Row gutter={[24, 24]}>
            {testimonials.map((t, i) => (
              <Col xs={24} sm={8} key={i}>
                <div style={{ background: '#FFF', borderRadius: 20, padding: '28px 24px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', height: '100%', position: 'relative' }}>
                  <div style={{ color: '#2563EB', fontSize: 24, marginBottom: 12, opacity: 0.3 }}>❝</div>
                  <Paragraph style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 16 }}>{t.text}</Paragraph>
                  <Text strong style={{ fontSize: 14, color: '#0F172A' }}>{t.name}</Text>
                  <div style={{ marginTop: 4 }}>
                    {[...Array(5)].map((_, j) => <StarFilled key={j} style={{ color: '#F59E0B', fontSize: 12, marginRight: 2 }} />)}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* ===== CTA ===== */}
      <div style={{ background: 'linear-gradient(135deg, #2563EB, #3B82F6)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Title level={2} style={{ fontWeight: 800, fontSize: 34, color: '#FFF', marginBottom: 16 }}>Готовы начать обучение?</Title>
          <Paragraph style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', marginBottom: 32, lineHeight: 1.7 }}>
            Присоединяйтесь к платформе CyberEdu и научитесь защищать себя в интернете уже сегодня.
          </Paragraph>
          <Button size="large" onClick={() => nav(isAuthenticated ? '/catalog' : '/register')}
            style={{ height: 54, padding: '0 36px', fontSize: 17, borderRadius: 14, fontWeight: 600, background: '#FFF', color: '#2563EB', border: 'none', boxShadow: '0 6px 24px rgba(0,0,0,0.15)' }}>
            {isAuthenticated ? 'Перейти к обучению' : 'Зарегистрироваться бесплатно'}
          </Button>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <div style={{ borderTop: '1px solid #E2E8F0', padding: '28px 24px', textAlign: 'center', background: '#F8FAFC' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <SafetyCertificateOutlined style={{ fontSize: 18, color: '#2563EB' }} />
          <span style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>CyberEdu</span>
        </div>
        <Text style={{ color: '#94A3B8', fontSize: 13 }}>© 2025 CyberEdu. Платформа разработана в рамках выпускной квалификационной работы.</Text>
      </div>
    </Layout>
  );
}