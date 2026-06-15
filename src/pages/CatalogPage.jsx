import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Input, Select, Tag, Typography, Spin, Button, Empty, Progress } from 'antd';
import {
  SearchOutlined, BookOutlined, ClockCircleOutlined,
  ThunderboltOutlined, LoadingOutlined, TrophyOutlined,
  MailOutlined, LockOutlined, TeamOutlined, SafetyCertificateOutlined,
  WifiOutlined, StarFilled, FireOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchModules, setFilter, resetFilters } from '@/features/catalog/catalogSlice';
import { fetchProgress } from '@/features/progress/progressSlice';

const { Title, Paragraph, Text } = Typography;

const diffLabels = { basic: 'Базовый', advanced: 'Продвинутый' };
const diffColors = { basic: '#16A34A', advanced: '#D97706' };
const diffGradients = {
  basic: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
  advanced: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
};

const iconMap = {
  mail: <MailOutlined style={{ fontSize: 28, color: '#DC2626' }} />,
  lock: <LockOutlined style={{ fontSize: 28, color: '#2563EB' }} />,
  team: <TeamOutlined style={{ fontSize: 28, color: '#D97706' }} />,
  safety: <SafetyCertificateOutlined style={{ fontSize: 28, color: '#16A34A' }} />,
  shield: <SafetyCertificateOutlined style={{ fontSize: 28, color: '#7C3AED' }} />,
  wifi: <WifiOutlined style={{ fontSize: 28, color: '#0891B2' }} />,
};

const categoryColors = {
  'Киберугрозы': { color: '#DC2626', bg: '#FEF2F2' },
  'Защита данных': { color: '#2563EB', bg: '#EFF6FF' },
  'Цифровая гигиена': { color: '#16A34A', bg: '#F0FDF4' },
  'Криптография': { color: '#7C3AED', bg: '#F5F3FF' },
  'Сетевая безопасность': { color: '#0891B2', bg: '#ECFEFF' },
};

export default function CatalogPage() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { modules, status, filters } = useSelector(s => s.catalog);
  const { items: progress } = useSelector(s => s.progress);

  useEffect(() => { dispatch(fetchModules()); dispatch(fetchProgress()); }, [dispatch]);

  const filtered = useMemo(() => {
    let r = [...modules];
    if (filters.category) r = r.filter(m => m.category === filters.category);
    if (filters.difficulty) r = r.filter(m => m.difficulty === filters.difficulty);
    if (filters.search) { const s = filters.search.toLowerCase(); r = r.filter(m => m.title.toLowerCase().includes(s) || m.description.toLowerCase().includes(s)); }
    return r;
  }, [modules, filters]);

  const cats = useMemo(() => [...new Set(modules.map(m => m.category))], [modules]);

  const getProg = (id) => {
    const p = progress.find(pi => pi.module_id === id);
    if (!p) return null;
    return p.score || 0;
  };

  const completedCount = progress.filter(p => p.status === 'completed').length;
  const inProgressCount = progress.filter(p => p.status === 'in_progress').length;

  if (status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: 140 }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 44, color: '#2563EB' }} spin />} />
        <Text style={{ display: 'block', marginTop: 20, color: '#94A3B8', fontSize: 15 }}>Загрузка каталога модулей...</Text>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ fontWeight: 800, marginBottom: 4, fontSize: 32, letterSpacing: '-0.02em' }}>
          <BookOutlined style={{ marginRight: 12, color: '#2563EB' }} />
          Каталог модулей
        </Title>
        <Text type="secondary" style={{ fontSize: 15 }}>
          Выберите тему и начните обучение. {modules.length} модулей доступно.
          {completedCount > 0 && <span style={{ color: '#16A34A', fontWeight: 600 }}> · Пройдено: {completedCount}</span>}
          {inProgressCount > 0 && <span style={{ color: '#2563EB', fontWeight: 600 }}> · В процессе: {inProgressCount}</span>}
        </Text>
      </div>

      {/* Stats mini cards */}
      {progress.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginBottom: 28 }}>
          <Col xs={12} sm={6}>
            <div style={{ background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)', borderRadius: 16, padding: '20px', border: '1px solid #BBF7D0' }}>
              <TrophyOutlined style={{ fontSize: 24, color: '#16A34A', marginBottom: 8 }} />
              <div style={{ fontSize: 28, fontWeight: 800, color: '#16A34A' }}>{completedCount}</div>
              <div style={{ fontSize: 13, color: '#166534' }}>Пройдено</div>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', borderRadius: 16, padding: '20px', border: '1px solid #BFDBFE' }}>
              <FireOutlined style={{ fontSize: 24, color: '#2563EB', marginBottom: 8 }} />
              <div style={{ fontSize: 28, fontWeight: 800, color: '#2563EB' }}>{inProgressCount}</div>
              <div style={{ fontSize: 13, color: '#1E40AF' }}>В процессе</div>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)', borderRadius: 16, padding: '20px', border: '1px solid #C4B5FD' }}>
              <BookOutlined style={{ fontSize: 24, color: '#7C3AED', marginBottom: 8 }} />
              <div style={{ fontSize: 28, fontWeight: 800, color: '#7C3AED' }}>{modules.length}</div>
              <div style={{ fontSize: 13, color: '#5B21B6' }}>Всего модулей</div>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', borderRadius: 16, padding: '20px', border: '1px solid #FDE68A' }}>
              <StarFilled style={{ fontSize: 24, color: '#D97706', marginBottom: 8 }} />
              <div style={{ fontSize: 28, fontWeight: 800, color: '#D97706' }}>{modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0}%</div>
              <div style={{ fontSize: 13, color: '#92400E' }}>Общий прогресс</div>
            </div>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <div style={{
        background: '#FFF', borderRadius: 18, padding: '20px 24px', marginBottom: 28,
        border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} lg={6}>
            <Input
              prefix={<SearchOutlined style={{ color: '#94A3B8' }} />}
              placeholder="Поиск модулей..."
              value={filters.search}
              onChange={e => dispatch(setFilter({ search: e.target.value }))}
              style={{ borderRadius: 12, height: 46 }}
              size="large"
            />
          </Col>
          <Col xs={24} sm={6} lg={4}>
            <Select
              placeholder="Раздел"
              allowClear
              size="large"
              style={{ width: '100%' }}
              value={filters.category}
              onChange={v => dispatch(setFilter({ category: v }))}
              options={cats.map(c => ({ value: c, label: c }))}
            />
          </Col>
          <Col xs={24} sm={6} lg={4}>
            <Select
              placeholder="Сложность"
              allowClear
              size="large"
              style={{ width: '100%' }}
              value={filters.difficulty}
              onChange={v => dispatch(setFilter({ difficulty: v }))}
              options={[
                { value: 'basic', label: '🔹 Базовый' },
                { value: 'advanced', label: '🔸 Продвинутый' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Button size="large" onClick={() => dispatch(resetFilters())} style={{ borderRadius: 12, fontWeight: 500 }}>
              Сбросить фильтры
            </Button>
          </Col>
        </Row>
      </div>

      {/* Module Grid */}
      {filtered.length === 0 ? (
        <Empty description={<span style={{ color: '#94A3B8' }}>Модули не найдены. Попробуйте изменить фильтры.</span>} style={{ marginTop: 80 }} />
      ) : (
        <Row gutter={[24, 24]} className="stagger-children">
          {filtered.map((mod) => {
            const prog = getProg(mod.id);
            const catStyle = categoryColors[mod.category] || { color: '#6B7280', bg: '#F9FAFB' };
            return (
              <Col xs={24} sm={12} lg={8} key={mod.id}>
                <Card
                  hoverable
                  onClick={() => nav(`/module/${mod.id}`)}
                  style={{
                    borderRadius: 20, border: '1px solid #E2E8F0', height: '100%', overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)', cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)'; }}
                  bodyStyle={{ padding: '28px 24px 24px' }}
                >
                  {/* Top row: icon + difficulty badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 16, background: catStyle.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {iconMap[mod.icon] || <BookOutlined style={{ fontSize: 26, color: '#2563EB' }} />}
                    </div>
                    <Tag style={{
                      borderRadius: 10, margin: 0, fontWeight: 600, fontSize: 12, padding: '4px 12px',
                      background: diffGradients[mod.difficulty], color: diffColors[mod.difficulty], border: 'none',
                    }}>
                      {diffLabels[mod.difficulty]}
                    </Tag>
                  </div>

                  {/* Title + Description */}
                  <Title level={4} style={{ fontWeight: 700, marginBottom: 8, fontSize: 18, color: '#0F172A' }}>{mod.title}</Title>
                  <Paragraph ellipsis={{ rows: 2 }} style={{ color: '#64748B', marginBottom: 16, fontSize: 14, lineHeight: 1.6 }}>
                    {mod.description}
                  </Paragraph>

                  {/* Tags row */}
                  <div style={{ marginBottom: 18, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Tag style={{ borderRadius: 8, background: catStyle.bg, color: catStyle.color, border: 'none', fontWeight: 500, fontSize: 12 }}>
                      {mod.category}
                    </Tag>
                    {mod.duration && (
                      <Tag icon={<ClockCircleOutlined />} style={{ borderRadius: 8, fontWeight: 500, fontSize: 12 }}>
                        {mod.duration}
                      </Tag>
                    )}
                  </div>

                  {/* Progress bar */}
                  {prog !== null && (
                    <div style={{ marginBottom: 16 }}>
                      <Progress
                        percent={prog}
                        size="small"
                        strokeColor={prog === 100 ? '#16A34A' : '#2563EB'}
                        trailColor="#E2E8F0"
                        format={() => `${prog}%`}
                        style={{ marginBottom: 4 }}
                      />
                    </div>
                  )}

                  {/* Action button */}
                  <Button
                    type={prog !== null && prog > 0 ? 'default' : 'primary'}
                    block
                    icon={<ThunderboltOutlined />}
                    size="large"
                    style={{
                      borderRadius: 12, fontWeight: 600, fontSize: 15, height: 46,
                      ...(prog !== null && prog > 0 ? { borderColor: '#2563EB', color: '#2563EB' } : {}),
                    }}
                  >
                    {prog !== null && prog === 100 ? '🔄 Пройти заново' :
                     prog !== null && prog > 0 ? '▶ Продолжить' :
                     '🚀 Начать модуль'}
                  </Button>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
}