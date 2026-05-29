import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown, Typography } from 'antd';
import { AppstoreOutlined, TrophyOutlined, TeamOutlined, UserOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { logoutThunk } from '@/features/auth/authSlice';
import { toggleSidebar } from '@/shared/slices/uiSlice';

const { Sider, Content, Header } = Layout;

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { sidebarCollapsed } = useSelector((state) => state.ui);

  const handleLogout = async () => { await dispatch(logoutThunk()); navigate('/'); };

  const selectedKey = () => {
    const path = location.pathname;
    if (path.startsWith('/catalog') || path.startsWith('/module')) return '/catalog';
    if (path.startsWith('/progress')) return '/progress';
    if (path.startsWith('/teacher')) return '/teacher';
    if (path.startsWith('/admin')) return '/admin';
    return '/catalog';
  };

  const items = [
    { key: '/catalog', icon: <AppstoreOutlined />, label: 'Каталог' },
    { key: '/progress', icon: <TrophyOutlined />, label: 'Прогресс' },
    ...(user?.role === 'teacher' || user?.role === 'admin' ? [{ key: '/teacher', icon: <TeamOutlined />, label: 'Группы' }] : []),
    ...(user?.role === 'admin' ? [{ key: '/admin', icon: <SafetyCertificateOutlined />, label: 'Админ' }] : []),
  ];

  const userMenu = [
    { key: 'profile', icon: <UserOutlined />, label: 'Профиль', onClick: () => navigate('/profile') },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Выйти', onClick: handleLogout },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={sidebarCollapsed} width={260} style={{ background: '#FFF', borderRight: '1px solid #E5E7EB' }}>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', padding: sidebarCollapsed ? 0 : '0 20px', borderBottom: '1px solid #E5E7EB' }}>
          <SafetyCertificateOutlined style={{ fontSize: 24, color: '#2563EB' }} />
          {!sidebarCollapsed && <span style={{ marginLeft: 10, fontWeight: 700, fontSize: 18 }}>CyberEdu</span>}
        </div>
        <Menu mode="inline" selectedKeys={[selectedKey()]} items={items} onClick={({ key }) => navigate(key)} style={{ border: 'none', marginTop: 8 }} />
      </Sider>
      <Layout>
        <Header style={{ background: '#FFF', borderBottom: '1px solid #E5E7EB', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Button type="text" icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => dispatch(toggleSidebar())} />
          <Dropdown menu={{ items: userMenu }} placement="bottomRight">
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 10 }}>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#2563EB' }} />
              <Typography.Text strong>{user?.username || 'Гость'}</Typography.Text>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ padding: 24, background: '#F9FAFB' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}