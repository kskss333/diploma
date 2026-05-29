import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Spin } from 'antd';
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

const PageLoader = () => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><Spin size="large" /></div>;

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function RoleRoute({ children, roles }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!roles.includes(user?.role)) return <Navigate to="/403" replace />;
  return children;
}

const router = createBrowserRouter([
  { path: '/', element: <Suspense fallback={<PageLoader />}><LandingPage /></Suspense> },
  { path: '/login', element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense> },
  { path: '/register', element: <Suspense fallback={<PageLoader />}><RegisterPage /></Suspense> },
  { path: '/403', element: <Suspense fallback={<PageLoader />}><ForbiddenPage /></Suspense> },
  {
    path: '/',
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      { path: 'catalog', element: <Suspense fallback={<PageLoader />}><CatalogPage /></Suspense> },
      { path: 'module/:moduleId', element: <Suspense fallback={<PageLoader />}><ModulePage /></Suspense> },
      { path: 'progress', element: <Suspense fallback={<PageLoader />}><ProgressPage /></Suspense> },
      { path: 'profile', element: <Suspense fallback={<PageLoader />}><ProfilePage /></Suspense> },
      { path: 'teacher', element: <RoleRoute roles={['teacher','admin']}><Suspense fallback={<PageLoader />}><TeacherDashboard /></Suspense></RoleRoute> },
      { path: 'admin', element: <RoleRoute roles={['admin']}><Suspense fallback={<PageLoader />}><AdminPanel /></Suspense></RoleRoute> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}