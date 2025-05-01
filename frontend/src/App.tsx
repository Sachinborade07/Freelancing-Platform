import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/ClientDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import { ProtectedRoute } from './routes/ProtectedRoutes';
import { Layout } from './components/layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      {
        path: 'client',
        element: <ProtectedRoute allowedRoles={['client']} />,
        children: [
          { index: true, element: <ClientDashboard /> },
        ],
      },
      {
        path: 'freelancer',
        element: <ProtectedRoute allowedRoles={['freelancer']} />,
        children: [
          { index: true, element: <FreelancerDashboard /> },
        ],
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}