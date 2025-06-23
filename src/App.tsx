import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import Layout from './layout/layout';
import Dashboard from './pages/modules/Dashboard';
import Modules from './pages/Modules';
import Files from './pages/modules/Files';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<SignInPage onLogin={handleLogin} />} />

        {/* Protected layout routes */}
        <Route
          path="/"
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path='/files' element={<Files />} />
        </Route>

        {/* Standalone protected route without layout (Modules) */}
        <Route
          path="/"
          element={isAuthenticated ? <Modules /> : <Navigate to="/login" />}
          index
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
