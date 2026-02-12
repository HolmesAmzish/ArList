import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TodoPage } from './pages/TodoPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

import { AuthProvider, useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth(); // 这里的状态是实时的
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
};

function App() {
  return (
      <AuthProvider> {/* 必须包裹在外面 */}
        <ThemeProvider>
          <Router>
            <Routes>
              <Route path="/" element={<ProtectedRoute><TodoPage /></ProtectedRoute>} />
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            </Routes>
          </Router>
        </ThemeProvider>
      </AuthProvider>
  );
}

export default App;
