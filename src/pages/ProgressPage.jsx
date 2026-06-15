import { useEffect } from 'react';
import { Typography, Card, Row, Col, Progress, Statistic, Empty, Spin } from 'antd';
import { TrophyOutlined, BookOutlined, CheckCircleOutlined, LoadingOutlined, FireOutlined, StarFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProgress } from '@/features/progress/progressSlice';
import { fetchModules } from '@/features/catalog/catalogSlice';

const { Title, Text } = Typography;

export default function ProgressPage() {
  const dispatch = useDispatch();
  const { items, status } = useSelector(s => s.progress);
  const { modules } = useSelector(s => s.catalog);

  useEffect(() => {
    dispatch(fetchProgress());
    dispatch(fetchModules());
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: 140 }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 44, color: '#2563EB' }} spin />} />
        <Text style={{ display: 'block', marginTop: 20, color: '#94A3B8', fontSize: 15 }}>Загрузка прогресса...</Text>
      </div>
    );
  }

  const done = items.filter(p => p.status === 'completed').length;
  const active = items.filter(p => p.status === 'in_progress').length;
  const totalPercent = modules.length > 0 ? Math.round((done / modules.length) * 100) : 0;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ fontWeight: 800, marginBottom: 4, fontSize: 32, letterSpacing: '-0.02em' }}>
          <TrophyOutlined style={{ marginRight: 12, color: '#D97706' }} />
          Мой прогресс
        </Title>
        <Text type="secondary" style={{ fontSize: 15 }}>Отслеживайте свои достижения в изучении кибербезопасности</Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: 40 }} className="stagger-children">
        <Col xs={12} sm={6}>
          <div className="stat-card" style={{ borderRadius: 18, textAlign: 'center', border: '1px solid #E2E8F0', background: '#FFF', padding: '24px 16px' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <CheckCircleOutlined style={{ fontSize: 24, color: '#16A34A' }} />
            </div>
            <Statistic title="Пройдено" value={done} valueStyle={{ color: '#16A34A', fontWeight: 800, fontSize: 30 }} />
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div className="stat-card" style={{ borderRadius: 18, textAlign: 'center', border: '1px solid #E2E8F0', background: '#FFF', padding: '24px 16px' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <FireOutlined style={{ fontSize: 24, color: '#D97706' }} />
            </div>
            <Statistic title="В процессе" value={active} valueStyle={{ color: '#D97706', fontWeight: 800, fontSize: 30 }} />
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div className="stat-card" style={{ borderRadius: 18, textAlign: 'center', border: '1px solid #E2E8F0', background: '#FFF', padding: '24px 16px' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <BookOutlined style={{ fontSize: 24, color: '#2563EB' }} />
            </div>
            <Statistic title="Всего модулей" value={modules.length} valueStyle={{ color: '#2563EB', fontWeight: 800, fontSize: 30 }} />
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div className="stat-card" style={{ borderRadius: 18, textAlign: 'center', border: '1px solid #E2E8F0', background: '#FFF', padding: '24px 16px' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <StarFilled style={{ fontSize: 24, color: '#7C3AED' }} />
            </div>
            <Statistic title="Общий прогресс" value={totalPercent} suffix="%" valueStyle={{ color: '#7C3AED', fontWeight: 800, fontSize: 30 }} />
          </div>
        </Col>
      </Row>

      {/* Overall Progress Bar */}
      <Card style={{ borderRadius: 18, marginBottom: 36, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
        bodyStyle={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text strong style={{ fontSize: 15 }}>Прогресс обучения</Text>
          <Text style={{ fontSize: 15, fontWeight: 700, color: '#2563EB' }}>{totalPercent}%</Text>
        </div>
        <Progress
          percent={totalPercent}
          strokeColor={{ '0%': '#2563EB', '100%': '#16A34A' }}
          trailColor="#E2E8F0"
          size={['100%', 14]}
          style={{ marginBottom: 0 }}
        />
      </Card>

      {/* Module List */}
      <Title level={3} style={{ fontWeight: 700, marginBottom: 20, fontSize: 22 }}>Детализация по модулям</Title>
      {items.length === 0 ? (
        <Empty
          description={<span style={{ color: '#94A3B8' }}>Вы ещё не начали ни одного модуля. Перейдите в каталог и выберите первый!</span>}
          style={{ marginTop: 40 }}
        />
      ) : (
        <Row gutter={[20, 20]} className="stagger-children">
          {items.map(p => {
            const mod = modules.find(m => m.id === p.module_id);
            const percent = p.score || 0;
            const isCompleted = p.status === 'completed';
            return (
              <Col xs={24} sm={12} lg={8} key={p.id}>
                <Card
                  hoverable
                  style={{
                    borderRadius: 18, border: '1px solid #E2E8F0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    transition: 'all 0.3s ease',
                    borderLeft: `4px solid ${isCompleted ? '#16A34A' : '#2563EB'}`,
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  bodyStyle={{ padding: '22px 20px' }}
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong style={{ fontSize: 15, color: '#0F172A' }}>{mod?.title || p.module_id}</Text>
                      {isCompleted && <CheckCircleOutlined style={{ color: '#16A34A', fontSize: 18 }} />}
                    </div>
                  }
                >
                  <Progress
                    percent={percent}
                    status={isCompleted ? 'success' : 'active'}
                    strokeColor={isCompleted ? '#16A34A' : '#2563EB'}
                    trailColor="#E2E8F0"
                    size="default"
                  />
                  <Text type="secondary" style={{ fontSize: 13, display: 'block', marginTop: 10 }}>
                    Статус: {isCompleted ? '✅ Завершён' : '🔄 В процессе'}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 13, display: 'block', marginTop: 4 }}>
                    Пройдено шагов: {p.current_step_index + 1 || 1}
                  </Text>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
}