import { QuizPage } from '@/components/QuizPage';
import { ResultsPage } from '@/components/ResultsPage';
import { HistoryPage } from '@/components/HistoryPage';
import { LeaderboardPage } from '@/components/LeaderboardPage';
import { AdminCreateQuiz } from '@/components/AdminCreateQuiz';
import { HomePage } from '@/components/HomePage';
import { DashboardPage } from '@/components/DashboardPage';
import { AIAssessmentPage } from '@/components/AIAssessmentPage';
import React from 'react';
import { Routes, Route } from 'react-router-dom';


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* add routers according to my components */}
      <Route path="/" element={<HomePage/>} />
      <Route path="/home" element={<HomePage/>} />
      <Route path="/dashboard" element={<DashboardPage/>} />
      <Route path="/ai-assessment" element={<AIAssessmentPage/>} />
      <Route path="/quiz/:id" element={<QuizPage />} />
      <Route path="/results" element={<ResultsPage/>} />
      <Route path="/history" element={<HistoryPage/>} />
      <Route path="/leaderboard" element={<LeaderboardPage/>} />
      <Route path="/leaderboard/:id" element={<LeaderboardPage/>} />
      <Route path="/admin/create" element={<AdminCreateQuiz/>} />
    </Routes>
  );
};

export default AppRoutes; 