import { Navigate, type RouteObject } from 'react-router-dom';
import DashboardPage from '@/pages/DashboardPage';
import WorkflowPage from '@/pages/WorkflowPage';
import ComingSoonPage from '@/pages/ComingSoonPage';

export const routes: RouteObject[] = [
  { index: true, element: <Navigate to="/dashboard" replace /> },
  { path: 'dashboard', element: <DashboardPage /> },
  { path: 'workflow', element: <WorkflowPage /> },
  { path: 'knowledge', element: <ComingSoonPage /> },
  { path: 'integrations', element: <ComingSoonPage /> },
  { path: 'analytics', element: <ComingSoonPage /> },
  { path: 'tool', element: <ComingSoonPage /> },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
];
