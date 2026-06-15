import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown, Typography} from 'antd';
import {
  AppstoreOutlined, TrophyOutlined, TeamOutlined,
  UserOutlined, LogoutOutlined, MenuFoldOutlined,
  MenuUnfoldOutlined, SafetyCertificateOutlined,CrownOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { logoutThunk } from '@/features/auth/authSlice';
import { toggleSidebar } from '@/shared/slices/uiSlice';

const { Sider, Content, Header } = Layout;

export default function AppLayout() {
  const nav = useNavigate();
  const loc = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { sidebarCollapsed } = useSelector(s => s.ui);
  const { items: progressItems } = useSelector(s => s.progress);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    nav('/');
  };

  const selected = () => {
    const p = loc.pathname;
    if (p.startsWith('/catalog') || p.startsWith('/module')) return '/catalog';
    if (p.startsWith('/progress')) return '/progress';
    if (p.startsWith('/teacher')) return '/teacher';
    if (p.startsWith('/admin')) return '/admin';
    if (p.startsWith('/profile')) return '/profile';
    return '/catalog';
  };

  const completedCount = progressItems.filter(p => p.status === 'completed').length;

  const menuItems = [
    {
      key: '/catalog',
      icon: <AppstoreOutlined />,
      label: (
        <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Каталог
        </span>
      ),
    },
    {
      key: '/progress',
      icon: <TrophyOutlined />,
      label: (
        <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Мой прогресс
          {completedCount > 0 && (
            <span style={{
              background: 'linear-gradient(135deg, #16A34A, #22C55E)',
              color: '#FFF', fontSize: 11, fontWeight: 700,
              padding: '2px 8px', borderRadius: 10, marginLeft: 8,
            }}>
              {completedCount}
            </span>
          )}
        </span>
      ),
    },
    ...(user?.role === 'teacher' || user?.role === 'admin' ? [{
      key: '/teacher',
      icon: <TeamOutlined />,
      label: 'Группы',
    }] : []),
    ...(user?.role === 'admin' ? [{
      key: '/admin',
      icon: <CrownOutlined />,
      label: 'Администрирование',
    }] : []),
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: (
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{user?.username || 'Пользователь'}</div>
          <div style={{ fontSize: 12, color: '#94A3B8' }}>
            {user?.role === 'student' ? 'Обучающийся' : user?.role === 'teacher' ? 'Преподаватель' : 'Администратор'}
          </div>
        </div>
      ),
      onClick: () => nav('/profile'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Выйти из аккаунта',
      onClick: handleLogout,
    },
  ];

  const roleBadge = {
    student: { color: '#2563EB', bg: '#EFF6FF', label: 'Ученик' },
    teacher: { color: '#16A34A', bg: '#F0FDF4', label: 'Учитель' },
    admin: { color: '#DC2626', bg: '#FEF2F2', label: 'Админ' },
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
        width={260}
        style={{
          background: '#FFFFFF',
          borderRight: '1px solid #E2E8F0',
          boxShadow: '2px 0 12px rgba(0,0,0,0.02)',
        }}
      >
        {/* Logo */}
        <div
          onClick={() => nav('/')}
          style={{
            height: 64, display: 'flex', alignItems: 'center',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            padding: sidebarCollapsed ? 0 : '0 20px',
            borderBottom: '1px solid #E2E8F0',
            cursor: 'pointer',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(37,99,235,0.25)',
          }}>
            <SafetyCertificateOutlined style={{ fontSize: 18, color: '#FFF' }} />
          </div>
          {!sidebarCollapsed && (
            <span style={{ marginLeft: 10, fontWeight: 700, fontSize: 18, color: '#0F172A', letterSpacing: '-0.02em' }}>
              CyberEdu
            </span>
          )}
        </div>

        {/* User info in sidebar */}
        {!sidebarCollapsed && (
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar
                size={36}
                icon={<UserOutlined />}
                style={{ backgroundColor: roleBadge[user?.role]?.bg, color: roleBadge[user?.role]?.color }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.username || 'Пользователь'}
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6,
                  background: roleBadge[user?.role]?.bg, color: roleBadge[user?.role]?.color,
                }}>
                  {roleBadge[user?.role]?.label}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Menu */}
        <Menu
          mode="inline"
          selectedKeys={[selected()]}
          items={menuItems}
          onClick={({ key }) => nav(key)}
          style={{
            border: 'none', marginTop: 8, padding: '0 8px',
            background: 'transparent',
          }}
        />
      </Sider>

      <Layout>
        <Header style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}>
          <Button
            type="text"
            icon={sidebarCollapsed ? <MenuUnfoldOutlined style={{ fontSize: 20 }} /> : <MenuFoldOutlined style={{ fontSize: 20 }} />}
            onClick={() => dispatch(toggleSidebar())}
            style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
              <div style={{
                display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 10,
                padding: '6px 14px', borderRadius: 12,
                transition: 'all 0.2s ease',
                border: '1px solid transparent',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
              >
                <Avatar
                  size={34}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: roleBadge[user?.role]?.bg, color: roleBadge[user?.role]?.color }}
                />
                <div style={{ textAlign: 'left' }}>
                  <Typography.Text strong style={{ fontSize: 13, color: '#0F172A' }}>
                    {user?.username || 'Пользователь'}
                  </Typography.Text>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content style={{ margin: 0, padding: 24, background: '#F8FAFC', minHeight: 'calc(100vh - 64px)' }}>
          <div className="page-enter">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}