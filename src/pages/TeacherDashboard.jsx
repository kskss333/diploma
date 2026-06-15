import { useEffect, useState } from 'react';
import { Typography, Card, Row, Col, Statistic, Button, Modal, Form, Input, Select, message, Tag, Spin, Empty } from 'antd';
import {
  TeamOutlined, TrophyOutlined, ClockCircleOutlined, PlusOutlined,
  LoadingOutlined, CopyOutlined 
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

export default function TeacherDashboard() {
  const [stats, setStats] = useState(null);
  const [groups, setGroups] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    const load = async () => {
      try {
        const [s, g] = await Promise.all([axios.get('/api/teacher/stats'), axios.get('/api/groups')]);
        setStats(s.data);
        setGroups(g.data.groups);
      } catch { message.error('Ошибка загрузки данных'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const create = async (v) => {
    try {
      await axios.post('/api/groups', v);
      message.success('Группа успешно создана!');
      setShow(false); form.resetFields();
      const r = await axios.get('/api/groups');
      setGroups(r.data.groups);
    } catch { message.error('Ошибка создания группы'); }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    message.success('Код приглашения скопирован!');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 140 }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 44, color: '#2563EB' }} spin />} />
        <Text style={{ display: 'block', marginTop: 20, color: '#94A3B8', fontSize: 15 }}>Загрузка дашборда...</Text>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={2} style={{ fontWeight: 800, marginBottom: 4, fontSize: 32, letterSpacing: '-0.02em' }}>
            <TeamOutlined style={{ marginRight: 12 }} />
            Дашборд преподавателя
          </Title>
          <Text type="secondary" style={{ fontSize: 15 }}>Управление учебными группами и отслеживание прогресса учеников</Text>
        </div>
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setShow(true)}
          style={{ borderRadius: 14, height: 50, fontWeight: 600, boxShadow: '0 6px 20px rgba(37,99,235,0.3)', fontSize: 15 }}>
          Создать группу
        </Button>
      </div>

      {/* Stats */}
      <Row gutter={[20, 20]} style={{ marginBottom: 40 }} className="stagger-children">
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 20, border: '1px solid #E2E8F0', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
            bodyStyle={{ padding: '28px 20px' }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <TeamOutlined style={{ fontSize: 26, color: '#2563EB' }} />
            </div>
            <Statistic title="Всего учеников" value={stats?.totalStudents || 0} valueStyle={{ color: '#2563EB', fontWeight: 800, fontSize: 34 }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 20, border: '1px solid #E2E8F0', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
            bodyStyle={{ padding: '28px 20px' }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <TrophyOutlined style={{ fontSize: 26, color: '#16A34A' }} />
            </div>
            <Statistic title="Средний прогресс" value={stats?.averageProgress || 0} suffix="%" valueStyle={{ color: '#16A34A', fontWeight: 800, fontSize: 34 }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 20, border: '1px solid #E2E8F0', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
            bodyStyle={{ padding: '28px 20px' }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, #FEF2F2, #FEE2E2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <ClockCircleOutlined style={{ fontSize: 26, color: '#DC2626' }} />
            </div>
            <Statistic title="Просроченные задания" value={stats?.overdueTasks || 0} valueStyle={{ color: '#DC2626', fontWeight: 800, fontSize: 34 }} />
          </Card>
        </Col>
      </Row>

      {/* Groups */}
      <Title level={3} style={{ fontWeight: 700, marginBottom: 20, fontSize: 22 }}>Учебные группы</Title>

      {groups.length === 0 ? (
        <Card style={{ borderRadius: 20, border: '1px solid #E2E8F0', textAlign: 'center', padding: 40 }}>
          <Empty description={<span style={{ color: '#94A3B8' }}>У вас пока нет учебных групп. Создайте первую группу, чтобы начать обучение!</span>} />
        </Card>
      ) : (
        <Row gutter={[20, 20]} className="stagger-children">
          {groups.map(g => (
            <Col xs={24} sm={12} lg={8} key={g.id}>
              <Card
                hoverable
                style={{
                  borderRadius: 20, border: '1px solid #E2E8F0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)', height: '100%',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                bodyStyle={{ padding: '24px' }}
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong style={{ fontSize: 16, color: '#0F172A' }}>{g.name}</Text>
                    <Tag style={{
                      borderRadius: 10, margin: 0, fontWeight: 600, fontSize: 12,
                      background: g.default_difficulty === 'advanced' ? '#FFFBEB' : '#F0FDF4',
                      color: g.default_difficulty === 'advanced' ? '#D97706' : '#16A34A',
                      border: 'none',
                    }}>
                      {g.default_difficulty === 'advanced' ? 'Продвинутый' : 'Базовый'}
                    </Tag>
                  </div>
                }
              >
                <Text type="secondary" style={{ display: 'block', marginBottom: 14, fontSize: 13 }}>Код приглашения для учеников:</Text>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: '#F8FAFC', padding: '14px 16px', borderRadius: 14,
                  border: '1px solid #E2E8F0',
                }}>
                  <Text code style={{ fontSize: 18, fontWeight: 700, letterSpacing: 1, color: '#0F172A' }}>
                    {g.invite_code}
                  </Text>
                  <Button
                    type="primary"
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => copyCode(g.invite_code)}
                    style={{ borderRadius: 10, fontWeight: 600 }}
                  >
                    Копировать
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Create Group Modal */}
      <Modal
        title={<Text strong style={{ fontSize: 20 }}>Создание учебной группы</Text>}
        open={show}
        onCancel={() => setShow(false)}
        onOk={() => form.submit()}
        okText="Создать группу"
        cancelText="Отмена"
        okButtonProps={{ style: { borderRadius: 12, fontWeight: 600, boxShadow: '0 4px 14px rgba(37,99,235,0.25)' } }}
        cancelButtonProps={{ style: { borderRadius: 12 } }}
      >
        <Form form={form} layout="vertical" onFinish={create} requiredMark={false} style={{ marginTop: 12 }}>
          <Form.Item name="name" label="Название группы" rules={[{ required: true, message: 'Введите название группы' }]}>
            <Input placeholder="Например: 10А класс" size="large" style={{ borderRadius: 12 }} />
          </Form.Item>
          <Form.Item name="default_difficulty" label="Уровень сложности по умолчанию" initialValue="basic">
            <Select size="large" style={{ borderRadius: 12 }} options={[
              { value: 'basic', label: '🔹 Базовый — для начинающих' },
              { value: 'advanced', label: '🔸 Продвинутый — для подготовленных' },
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}