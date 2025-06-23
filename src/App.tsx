import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import SignInPage from './pages/SignInPage';
import Layout from './layout/layout';
import Dashboard from './pages/Dashboard';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const handleLogin = () => {
    setIsAuthenticated(true);
  };
  return (
    <BrowserRouter>
    <Routes>
        {/* Public routes */}
        <Route path="/login" element={<SignInPage onLogin={handleLogin} />} />
        {/* Protected routes */}
        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          {/* Redirect non-existent routes to Dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App