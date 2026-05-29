import { Typography, Card, Descriptions, Button, Tag, Popconfirm, message } from 'antd';
import { UserOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const { Title } = Typography;

export default function ProfilePage() {
  const { user } = useSelector(s => s.auth);
  if (!user) return null;

  return (
    <div className="fade-in" style={{ maxWidth: 600 }}>
      <Title level={2}><UserOutlined style={{ marginRight: 10 }} />Личный кабинет</Title>
      <Card style={{ borderRadius: 14, marginBottom: 20 }}>
        <Descriptions column={1} size="large">
          <Descriptions.Item label="Псевдоним">{user.username}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Роль">
            <Tag color="blue">{user.role === 'student' ? 'Обучающийся' : user.role === 'teacher' ? 'Преподаватель' : 'Администратор'}</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="Опасная зона" style={{ borderRadius: 14, border: '1px solid #FECACA' }}>
        <Popconfirm title="Вы уверены?" onConfirm={() => message.success('Запрос отправлен (демо)')}>
          <Button danger icon={<DeleteOutlined />}>Удалить аккаунт</Button>
        </Popconfirm>
      </Card>
    </div>
  );
}