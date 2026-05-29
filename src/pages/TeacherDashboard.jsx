import { useEffect, useState } from 'react';
import { Typography, Card, Row, Col, Statistic, Button, Modal, Form, Input, Select, message, Tag } from 'antd';
import { TeamOutlined, TrophyOutlined, ClockCircleOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

export default function TeacherDashboard() {
  const [stats, setStats] = useState(null);
  const [groups, setGroups] = useState([]);
  const [show, setShow] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    axios.get('/api/teacher/stats').then(r => setStats(r.data)).catch(() => {});
    axios.get('/api/groups').then(r => setGroups(r.data.groups)).catch(() => {});
  }, []);

  const create = async (v) => {
    try {
      await axios.post('/api/groups', v);
      message.success('Группа создана!');
      setShow(false);
      form.resetFields();
      const r = await axios.get('/api/groups');
      setGroups(r.data.groups);
    } catch { message.error('Ошибка'); }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <Title level={2}><TeamOutlined style={{ marginRight: 10 }} />Дашборд преподавателя</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setShow(true)}>Создать группу</Button>
      </div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}><Card style={{ borderRadius: 12, textAlign: 'center' }}><Statistic title="Обучающихся" value={stats?.totalStudents || 0} prefix={<TeamOutlined />} valueStyle={{ color: '#2563EB' }} /></Card></Col>
        <Col xs={24} sm={8}><Card style={{ borderRadius: 12, textAlign: 'center' }}><Statistic title="Средний прогресс" value={stats?.averageProgress || 0} suffix="%" prefix={<TrophyOutlined />} valueStyle={{ color: '#16A34A' }} /></Card></Col>
        <Col xs={24} sm={8}><Card style={{ borderRadius: 12, textAlign: 'center' }}><Statistic title="Просрочено" value={stats?.overdueTasks || 0} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#DC2626' }} /></Card></Col>
      </Row>
      <Card title="Группы" style={{ borderRadius: 12 }}>
        {groups.map(g => (
          <Card key={g.id} type="inner" title={g.name} extra={<Tag color="blue">{g.default_difficulty}</Tag>} style={{ marginBottom: 12 }}>
            <Text>Код: <Text code>{g.invite_code}</Text></Text>
          </Card>
        ))}
      </Card>
      <Modal title="Создать группу" open={show} onCancel={() => setShow(false)} onOk={() => form.submit()} okText="Создать">
        <Form form={form} layout="vertical" onFinish={create}>
          <Form.Item name="name" label="Название" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="default_difficulty" label="Сложность"><Select options={[{ value: 'basic', label: 'Базовый' }, { value: 'advanced', label: 'Продвинутый' }]} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}