import { useEffect } from 'react';
import { Typography, Card, Row, Col, Progress, Statistic, Empty, Spin } from 'antd';
import { TrophyOutlined, BookOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProgress } from '@/features/progress/progressSlice';
import { fetchModules } from '@/features/catalog/catalogSlice';

const { Title } = Typography;

export default function ProgressPage() {
  const dispatch = useDispatch();
  const { items, status } = useSelector(s => s.progress);
  const { modules } = useSelector(s => s.catalog);

  useEffect(() => { dispatch(fetchProgress()); dispatch(fetchModules()); }, [dispatch]);

  if (status === 'loading') return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;

  const done = items.filter(p => p.status === 'completed').length;
  const active = items.filter(p => p.status === 'in_progress').length;

  return (
    <div className="fade-in">
      <Title level={2}><TrophyOutlined style={{ marginRight: 10, color: '#D97706' }} />Мой прогресс</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={8}><Card style={{ borderRadius: 12, textAlign: 'center' }}><Statistic title="Пройдено" value={done} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#16A34A' }} /></Card></Col>
        <Col xs={24} sm={8}><Card style={{ borderRadius: 12, textAlign: 'center' }}><Statistic title="В процессе" value={active} prefix={<BookOutlined />} valueStyle={{ color: '#2563EB' }} /></Card></Col>
        <Col xs={24} sm={8}><Card style={{ borderRadius: 12, textAlign: 'center' }}><Statistic title="Всего модулей" value={modules.length} suffix={`/${modules.length}`} valueStyle={{ color: '#7C3AED' }} /></Card></Col>
      </Row>
      {items.length === 0 ? <Empty description="Вы ещё не начали ни одного модуля" /> : (
        <Row gutter={[16, 16]}>
          {items.map(p => {
            const mod = modules.find(m => m.id === p.module_id);
            return (
              <Col xs={24} sm={12} lg={8} key={p.id}>
                <Card title={mod?.title || p.module_id} style={{ borderRadius: 12 }}>
                  <Progress percent={p.status === 'completed' ? 100 : 50} status={p.status === 'completed' ? 'success' : 'active'} />
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
}