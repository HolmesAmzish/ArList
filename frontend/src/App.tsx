import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TodoPage } from './pages/TodoPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { CallbackPage } from './pages/CallbackPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppAuthProvider, useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
};

function App() {
  return (
      <AppAuthProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              <Route path="/" element={<ProtectedRoute><TodoPage /></ProtectedRoute>} />
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
              <Route path="/callback" element={<CallbackPage />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </AppAuthProvider>
  );
}

export default App;
