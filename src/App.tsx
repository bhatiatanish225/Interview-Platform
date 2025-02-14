import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Instructions from './pages/Instructions';
import Interview from './pages/Interview';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/instructions"
            element={
              <PrivateRoute>
                <Instructions />
              </PrivateRoute>
            }
          />
          <Route
            path="/interview"
            element={
              <PrivateRoute>
                <Interview />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;