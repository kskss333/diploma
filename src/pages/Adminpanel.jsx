import { useEffect, useState } from 'react';
import { Typography, Table, Tag, Button, Space, message, Spin, Card, Input } from 'antd';
import {
  SafetyCertificateOutlined, SearchOutlined, ReloadOutlined,
  LoadingOutlined, UserOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

const roleColors = { student: '#2563EB', teacher: '#16A34A', admin: '#DC2626' };
const roleBgs = { student: '#EFF6FF', teacher: '#F0FDF4', admin: '#FEF2F2' };
const roleLabels = { student: 'Ученик', teacher: 'Учитель', admin: 'Админ' };

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const r = await axios.get('/api/admin/users');
      setUsers(r.data.users);
    } catch { message.error('Ошибка загрузки пользователей'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: 'Пользователь',
      key: 'user',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: roleBgs[record.role], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserOutlined style={{ color: roleColors[record.role], fontSize: 16 }} />
          </div>
          <div>
            <Text strong style={{ fontSize: 14, color: '#0F172A' }}>{record.username}</Text>
            <br />
            <Text style={{ fontSize: 12, color: '#94A3B8' }}>{record.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
      width: 130,
      render: role => (
        <Tag style={{ borderRadius: 10, fontWeight: 600, fontSize: 12, padding: '4px 14px', background: roleBgs[role], color: roleColors[role], border: 'none' }}>
          {roleLabels[role] || role}
        </Tag>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 130,
      render: active => active
        ? <Tag style={{ borderRadius: 10, fontWeight: 600, fontSize: 12, background: '#F0FDF4', color: '#16A34A', border: 'none' }}>✅ Активен</Tag>
        : <Tag style={{ borderRadius: 10, fontWeight: 600, fontSize: 12, background: '#FEF2F2', color: '#DC2626', border: 'none' }}>🚫 Заблокирован</Tag>,
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 200,
      render: () => (
        <Space>
          <Button size="small" style={{ borderRadius: 10, fontWeight: 500 }}>Блокировать</Button>
          <Button size="small" danger style={{ borderRadius: 10, fontWeight: 500 }}>Удалить</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={2} style={{ fontWeight: 800, marginBottom: 4, fontSize: 32, letterSpacing: '-0.02em' }}>
            <SafetyCertificateOutlined style={{ marginRight: 12 }} />
            Панель администратора
          </Title>
          <Text type="secondary" style={{ fontSize: 15 }}>Управление пользователями платформы</Text>
        </div>
        <Button icon={<ReloadOutlined />} onClick={load} size="large" style={{ borderRadius: 14, fontWeight: 500 }}>
          Обновить список
        </Button>
      </div>

      <Card style={{ borderRadius: 20, border: '1px solid #E2E8F0', marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
        bodyStyle={{ padding: '18px 24px' }}>
        <Input
          prefix={<SearchOutlined style={{ color: '#94A3B8' }} />}
          placeholder="Поиск по имени или email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="large"
          style={{ borderRadius: 14, maxWidth: 420 }}
        />
      </Card>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 100 }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 40, color: '#2563EB' }} spin />} />
        </div>
      ) : (
        <Card style={{ borderRadius: 20, border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
          bodyStyle={{ padding: 0 }}>
          <Table
            columns={columns}
            dataSource={filtered}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: false, style: { padding: '0 24px' } }}
          />
        </Card>
      )}
    </div>
  );
}