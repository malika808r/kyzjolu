import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/store';

// Layouts & Auth
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AuthLayout from './components/Auth/AuthLayout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Pages
import Welcome from './pages/Welcome';
import MapView from './pages/MapView';
import Profile from './pages/Profile';
import KyzHub from './pages/KyzHub';
import CommunityRooms from './pages/CommunityRooms';
import Support from './pages/Support';
import NotFound from './pages/NotFound';

// Components
import ChatInterface from './components/ChatInterface';
import EventCreation from './components/EventCreation';

export default function App() {
  const { isInitializing, checkAuth, initAuthListener } = useAppStore();

  useEffect(() => {
    checkAuth();
    const { subscription } = initAuthListener();
    return () => {
      subscription?.unsubscribe();
    };
  }, [checkAuth, initAuthListener]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-[#F8F9FA]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/" element={<Welcome />} />
        
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        
        {/* Редиректы */}
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />
        <Route path="/register" element={<Navigate to="/auth/register" replace />} />

        {/* Защищенная зона */}
        <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="map" replace />} />
          <Route path="profile" element={<Profile />} />
          <Route path="map" element={<MapView />} />
          <Route path="chats" element={<CommunityRooms />} />
          <Route path="chats/:roomId" element={<ChatInterface />} />
          <Route path="hub" element={<KyzHub />} />
          <Route path="create-event" element={<EventCreation />} />
          <Route path="support" element={<Support />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}