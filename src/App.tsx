import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/useAuth';
import AppLayout from './components/Layout/AppLayout';
import LoginForm from './components/Auth/LoginForm';
import NewsFeed from './components/NewsFeed/NewsFeed';
import ChatRoom from './components/Chat/ChatRoom';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route
            path="/login"
            element={currentUser ? <Navigate to="/" /> : <LoginForm />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <NewsFeed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatRoom />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
