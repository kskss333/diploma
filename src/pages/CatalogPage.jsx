import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Input, Select, Tag, Typography, Spin, Button, Empty, Progress } from 'antd';
import { SearchOutlined, BookOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchModules, setFilter, resetFilters } from '@/features/catalog/catalogSlice';
import { fetchProgress } from '@/features/progress/progressSlice';

const { Title, Paragraph } = Typography;

const diffLabels = { basic: 'Базовый', advanced: 'Продвинутый' };
const diffColors = { basic: '#16A34A', advanced: '#D97706' };

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
  const getProgress = (id) => { const p = progress.find(pi => pi.module_id === id); return p ? (p.status === 'completed' ? 100 : 50) : null; };

  if (status === 'loading') return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;

  return (
    <div className="fade-in">
      <Title level={2} style={{ fontWeight: 700 }}>Каталог модулей</Title>
      <Card style={{ borderRadius: 12, marginBottom: 24 }} bodyStyle={{ padding: 20 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}><Input prefix={<SearchOutlined />} placeholder="Поиск..." value={filters.search} onChange={e => dispatch(setFilter({ search: e.target.value }))} /></Col>
          <Col xs={24} sm={6} lg={4}><Select placeholder="Раздел" allowClear style={{ width: '100%' }} value={filters.category} onChange={v => dispatch(setFilter({ category: v }))} options={cats.map(c => ({ value: c, label: c }))} /></Col>
          <Col xs={24} sm={6} lg={4}><Select placeholder="Сложность" allowClear style={{ width: '100%' }} value={filters.difficulty} onChange={v => dispatch(setFilter({ difficulty: v }))} options={[{ value: 'basic', label: 'Базовый' }, { value: 'advanced', label: 'Продвинутый' }]} /></Col>
          <Col xs={24} sm={12} lg={4}><Button onClick={() => dispatch(resetFilters())}>Сбросить</Button></Col>
        </Row>
      </Card>
      {filtered.length === 0 ? <Empty /> : (
        <Row gutter={[20, 20]}>
          {filtered.map(m => {
            const p = getProgress(m.id);
            return (
              <Col xs={24} sm={12} lg={8} key={m.id}>
                <Card hoverable onClick={() => nav(`/module/${m.id}`)} style={{ borderRadius: 14, height: '100%' }} bodyStyle={{ padding: 24 }}>
                  <BookOutlined style={{ fontSize: 28, color: '#2563EB', marginBottom: 12 }} />
                  <Tag color={diffColors[m.difficulty]} style={{ float: 'right' }}>{diffLabels[m.difficulty]}</Tag>
                  <Title level={5} style={{ marginTop: 8 }}>{m.title}</Title>
                  <Paragraph ellipsis={{ rows: 2 }} type="secondary">{m.description}</Paragraph>
                  <Tag color="blue">{m.category}</Tag>
                  {p !== null && <Progress percent={p} size="small" style={{ marginTop: 8 }} />}
                  <Button type="primary" block style={{ marginTop: 12, borderRadius: 8 }}>{p ? 'Продолжить' : 'Начать'}</Button>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
}