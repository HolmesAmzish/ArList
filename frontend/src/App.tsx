import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TodoPage } from './pages/TodoPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true })

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<TodoPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
