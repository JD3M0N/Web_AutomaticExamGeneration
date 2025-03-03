import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LogIn from './pages/LogIn';
import Admin from './pages/Admin';
import Professor from './pages/Professor';
import Student from './pages/Student';
import Features from './pages/Features';
import Statistics from './pages/Statistics';
import ExamsPage from './pages/ExamsPage';
import CompareExamsPage from './pages/CompareExamsPage';
import ProfessorReviewsPage from './pages/ProfessorReviewsPage';
import UnusedQuestionsPage from './pages/UnusedQuestionsPage';
import MostUsedQuestionsPage from './pages/MostUsedQuestionsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div id="root">
        <Routes>
          {/* Página de inicio */}
          <Route path="/" element={<Home />} />

          {/* Página de login */}
          <Route path="/login" element={<LogIn />} />

          {/* Página de funcionalidades */}
          <Route path="/features" element={<Features />} />

          <Route path="/statistics" element={<Statistics />} />

          <Route path="/exams/:assignmentId" element={<ExamsPage />} />

          <Route path="/compare-exams" element={<CompareExamsPage />} />

          <Route path="/professor-reviews" element={<ProfessorReviewsPage />} />

          <Route path="/unused-questions" element={<UnusedQuestionsPage />} />

          <Route path="/most-used-questions/:assignmentId" element={<MostUsedQuestionsPage />} />

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
      </div>
    </Router>
  );
}

export default App;