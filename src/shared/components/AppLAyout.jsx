import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown, Typography } from 'antd';
import {
  AppstoreOutlined, TrophyOutlined, TeamOutlined,
  UserOutlined, LogoutOutlined, MenuFoldOutlined,
  MenuUnfoldOutlined, SafetyCertificateOutlined,
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

  const handleLogout = async () => { await dispatch(logoutThunk()); nav('/'); };

  const selected = () => {
    const p = loc.pathname;
    if (p.startsWith('/catalog') || p.startsWith('/module')) return '/catalog';
    if (p.startsWith('/progress')) return '/progress';
    if (p.startsWith('/teacher')) return '/teacher';
    if (p.startsWith('/admin')) return '/admin';
    return '/catalog';
  };

  const items = [
    { key: '/catalog', icon: <AppstoreOutlined />, label: 'Каталог' },
    { key: '/progress', icon: <TrophyOutlined />, label: 'Прогресс' },
    ...(user?.role === 'teacher' || user?.role === 'admin' ? [{ key: '/teacher', icon: <TeamOutlined />, label: 'Группы' }] : []),
    ...(user?.role === 'admin' ? [{ key: '/admin', icon: <SafetyCertificateOutlined />, label: 'Админ' }] : []),
  ];

  const userMenu = [
    { key: 'profile', icon: <UserOutlined />, label: 'Профиль', onClick: () => nav('/profile') },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Выйти', onClick: handleLogout },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={sidebarCollapsed} width={260} style={{ background: '#FFF', borderRight: '1px solid #E2E8F0' }}>
        <div onClick={() => nav('/')} style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', padding: sidebarCollapsed ? 0 : '0 20px', borderBottom: '1px solid #E2E8F0', cursor: 'pointer' }}>
          <SafetyCertificateOutlined style={{ fontSize: 24, color: '#2563EB' }} />
          {!sidebarCollapsed && <span style={{ marginLeft: 10, fontWeight: 700, fontSize: 18 }}>CyberEdu</span>}
        </div>
        <Menu mode="inline" selectedKeys={[selected()]} items={items} onClick={({ key }) => nav(key)} style={{ border: 'none', marginTop: 8 }} />
      </Sider>
      <Layout>
        <Header style={{ background: '#FFF', borderBottom: '1px solid #E2E8F0', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Button type="text" icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => dispatch(toggleSidebar())} />
          <Dropdown menu={{ items: userMenu }} placement="bottomRight">
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 10 }}>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#2563EB' }} />
              <Typography.Text strong>{user?.username || 'Гость'}</Typography.Text>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ padding: 24, background: '#F8FAFC' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}