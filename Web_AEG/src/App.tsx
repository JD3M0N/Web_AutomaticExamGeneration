import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LogIn from './pages/LogIn';
import Admin from './pages/Admin';
import Professor from './pages/Professor';
import Student from './pages/Student';
import Features from './pages/Features'; 
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Página de inicio */}
        <Route path="/" element={<Home />} />

        {/* Página de login */}
        <Route path="/login" element={<LogIn />} />

        {/* Página de funcionalidades */}
        <Route path="/features" element={<Features />} /> {/* Nueva ruta */}

        {/* Rutas protegidas */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/professor"
          element={
            <ProtectedRoute>
              <Professor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <Student />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;