import { Typography, Card, Descriptions, Button, Tag, Popconfirm, message, Avatar } from 'antd';
import { UserOutlined, MailOutlined, SafetyCertificateOutlined, DeleteOutlined, CrownOutlined, TeamOutlined, BookOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const { Title, Text } = Typography;

const roleMap = {
  student: { label: 'Обучающийся', color: '#2563EB', bg: '#EFF6FF', icon: <BookOutlined /> },
  teacher: { label: 'Преподаватель', color: '#16A34A', bg: '#F0FDF4', icon: <TeamOutlined /> },
  admin: { label: 'Администратор', color: '#DC2626', bg: '#FEF2F2', icon: <CrownOutlined /> },
};

export default function ProfilePage() {
  const { user } = useSelector(s => s.auth);
  const { items: progressItems } = useSelector(s => s.progress);

  if (!user) return null;

  const role = roleMap[user.role] || roleMap.student;
  const completedCount = progressItems.filter(p => p.status === 'completed').length;

  return (
    <div className="animate-fade-in" style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ fontWeight: 800, marginBottom: 4, fontSize: 32, letterSpacing: '-0.02em' }}>
          <UserOutlined style={{ marginRight: 12 }} />
          Личный кабинет
        </Title>
        <Text type="secondary" style={{ fontSize: 15 }}>Управление вашими данными и просмотр статистики обучения</Text>
      </div>

      {/* Profile Card */}
      <Card
        style={{
          borderRadius: 24, marginBottom: 24, border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)', overflow: 'hidden',
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Cover */}
        <div style={{
          height: 100,
          background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 40%, #60A5FA 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradientShift 4s ease infinite',
        }} />

        {/* Avatar + Info */}
        <div style={{ textAlign: 'center', marginTop: -44, marginBottom: 8 }}>
          <Avatar
            size={88}
            icon={<UserOutlined />}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#2563EB',
              border: '5px solid #FFFFFF',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            }}
          />
        </div>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ fontWeight: 700, marginBottom: 4 }}>{user.username}</Title>
          <Tag style={{
            borderRadius: 10, fontSize: 13, padding: '6px 16px', fontWeight: 600,
            background: role.bg, color: role.color, border: 'none',
          }}>
            {role.icon} {role.label}
          </Tag>
        </div>

        {/* Mini Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 28, padding: '0 28px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#16A34A' }}>{completedCount}</div>
            <Text style={{ fontSize: 12, color: '#94A3B8' }}>Пройдено</Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#2563EB' }}>{progressItems.length - completedCount}</div>
            <Text style={{ fontSize: 12, color: '#94A3B8' }}>В процессе</Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#D97706' }}>{progressItems.length}</div>
            <Text style={{ fontSize: 12, color: '#94A3B8' }}>Начато</Text>
          </div>
        </div>

        {/* Details */}
        <div style={{ padding: '0 28px 28px', borderTop: '1px solid #E2E8F0', paddingTop: 24 }}>
          <Descriptions
            column={1}
            size="large"
            labelStyle={{ fontWeight: 600, color: '#475569', fontSize: 13 }}
            contentStyle={{ fontSize: 15 }}
          >
            <Descriptions.Item label={<><UserOutlined /> Псевдоним</>}>
              <Text strong>{user.username}</Text>
            </Descriptions.Item>
            <Descriptions.Item label={<><MailOutlined /> Email</>}>
              <Text>{user.email}</Text>
            </Descriptions.Item>
            <Descriptions.Item label={<><SafetyCertificateOutlined /> Роль</>}>
              <Tag style={{ borderRadius: 8, background: role.bg, color: role.color, border: 'none', fontWeight: 600 }}>
                {role.icon} {role.label}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={<><SafetyCertificateOutlined /> ID пользователя</>}>
              <Text code style={{ borderRadius: 6 }}>{user.id}</Text>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card
        title={<Text strong style={{ color: '#DC2626', fontSize: 15 }}>⚠️ Опасная зона</Text>}
        style={{
          borderRadius: 24, border: '1px solid #FECACA', background: '#FFF5F5',
          boxShadow: '0 2px 8px rgba(220,38,38,0.06)',
        }}
        bodyStyle={{ padding: '24px 28px' }}
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: 18, fontSize: 14, lineHeight: 1.6 }}>
          После удаления аккаунта все ваши данные будут безвозвратно уничтожены. Прогресс обучения, баллы и достижения будут потеряны.
        </Text>
        <Popconfirm
          title="Вы уверены, что хотите удалить аккаунт?"
          description="Это действие невозможно отменить."
          onConfirm={() => message.success('Запрос на удаление отправлен (демо-режим)')}
          okText="Да, удалить"
          cancelText="Отмена"
          okButtonProps={{ danger: true, style: { borderRadius: 10 } }}
          cancelButtonProps={{ style: { borderRadius: 10 } }}
        >
          <Button danger icon={<DeleteOutlined />} size="large" style={{ borderRadius: 12, fontWeight: 600 }}>
            Удалить аккаунт
          </Button>
        </Popconfirm>
      </Card>
    </div>
  );
}