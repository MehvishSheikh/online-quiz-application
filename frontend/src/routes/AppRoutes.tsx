import { QuizPage } from '@/components/QuizPage';
import { ResultsPage } from '@/components/ResultsPage';
import { StartPage } from '@/components/StartPage';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* add routers according to my components */}
      <Route path="/" element={<Navigate to="/start" />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/results" element={<ResultsPage/>} />
      <Route path="/start" element={<StartPage/>} />


    </Routes>
  );
};

export default AppRoutes; 