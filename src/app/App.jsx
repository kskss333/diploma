import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import AppLayout from '@/shared/components/AppLayout';

const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const CatalogPage = lazy(() => import('@/pages/CatalogPage'));
const ModulePage = lazy(() => import('@/pages/ModulePage'));
const ProgressPage = lazy(() => import('@/pages/ProgressPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const TeacherDashboard = lazy(() => import('@/pages/TeacherDashboard'));
const AdminPanel = lazy(() => import('@/pages/AdminPanel'));
const ForbiddenPage = lazy(() => import('@/pages/ForbiddenPage'));

const Loader = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
    alignItems: 'center', height: '60vh', gap: 16,
  }}>
    <Spin indicator={<LoadingOutlined style={{ fontSize: 36, color: '#2563EB' }} spin />} />
    <span style={{ color: '#9CA3AF', fontSize: 14 }}>Загрузка...</span>
  </div>
);

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector(s => s.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function RoleRoute({ children, roles }) {
  const { user, isAuthenticated } = useSelector(s => s.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return roles.includes(user?.role) ? children : <Navigate to="/403" replace />;
}

const router = createBrowserRouter([
  { path: '/', element: <Suspense fallback={<Loader />}><LandingPage /></Suspense> },
  { path: '/login', element: <Suspense fallback={<Loader />}><LoginPage /></Suspense> },
  { path: '/register', element: <Suspense fallback={<Loader />}><RegisterPage /></Suspense> },
  { path: '/403', element: <Suspense fallback={<Loader />}><ForbiddenPage /></Suspense> },
  {
    path: '/',
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      { path: 'catalog', element: <Suspense fallback={<Loader />}><CatalogPage /></Suspense> },
      { path: 'module/:moduleId', element: <Suspense fallback={<Loader />}><ModulePage /></Suspense> },
      { path: 'progress', element: <Suspense fallback={<Loader />}><ProgressPage /></Suspense> },
      { path: 'profile', element: <Suspense fallback={<Loader />}><ProfilePage /></Suspense> },
      { path: 'teacher', element: <RoleRoute roles={['teacher', 'admin']}><Suspense fallback={<Loader />}><TeacherDashboard /></Suspense></RoleRoute> },
      { path: 'admin', element: <RoleRoute roles={['admin']}><Suspense fallback={<Loader />}><AdminPanel /></Suspense></RoleRoute> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}