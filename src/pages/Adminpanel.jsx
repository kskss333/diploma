import { useEffect, useState } from 'react';
import { Typography, Table, Tag, Button, message } from 'antd';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

export default function AdminPanel() {
  const [users, setUsers] = useState([]);

  useEffect(() => { axios.get('/api/admin/users').then(r => setUsers(r.data.users)).catch(() => message.error('Ошибка')); }, []);

  const cols = [
    { title: 'Псевдоним', dataIndex: 'username' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Роль', dataIndex: 'role', render: r => <Tag color={r === 'admin' ? 'red' : r === 'teacher' ? 'green' : 'blue'}>{r}</Tag> },
    { title: 'Статус', dataIndex: 'is_active', render: a => a ? <Tag color="green">Активен</Tag> : <Tag color="red">Заблокирован</Tag> },
    { title: 'Действия', render: () => <><Button size="small" style={{ marginRight: 8 }}>Блок</Button><Button size="small" danger>Удалить</Button></> },
  ];

  return (
    <div className="fade-in">
      <Title level={2}><SafetyCertificateOutlined style={{ marginRight: 10 }} />Панель администратора</Title>
      <Table columns={cols} dataSource={users} rowKey="id" pagination={false} style={{ background: '#FFF', borderRadius: 12 }} />
    </div>
  );
}