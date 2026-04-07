import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AuthLayout from './components/Auth/AuthLayout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Welcome from './pages/Welcome';
import ErrorBoundary from './components/ErrorBoundary';
import ChatInterface from './components/ChatInterface';
import EventCreation from './components/EventCreation';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Welcome />,
  },
  {
    path: '/app',
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <ProtectedRoute><Feed /></ProtectedRoute>,
      },
      {
        path: 'feed',
        element: <ProtectedRoute><Feed /></ProtectedRoute>,
      },
      {
        path: 'profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
      },
      {
        path: 'chats',
        element: <ProtectedRoute><ChatInterface /></ProtectedRoute>,
      },
      {
        path: 'create-event',
        element: <ProtectedRoute><EventCreation /></ProtectedRoute>,
      },
      {
        path: 'find-companion',
        element: <ProtectedRoute><Feed type="companions" /></ProtectedRoute>,
      },
      {
        path: 'experts',
        element: <Feed type="experts" />,
      },
      {
        path: 'education',
        element: <Feed type="education" />,
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);