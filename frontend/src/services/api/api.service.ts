import axios from 'axios';
import { type Question, type Answer, type QuizResult, type UserInfo, type AttemptRecord } from '../../types/quiz.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const quizApi = {
  // Fetch all questions for a quiz
  getQuestions: async (quizId: number): Promise<Question[]> => {
    const response = await axios.get(`${API_BASE_URL}/quiz/${quizId}/questions`);
    return response.data.questions;
  },

  // Submit quiz answers
  submitQuiz: async (
    quizId: number,
    answers: Answer[],
    includeDetails: boolean = false,
    user?: UserInfo
  ): Promise<QuizResult> => {
    const response = await axios.post(
      `${API_BASE_URL}/quiz/${quizId}/submit${includeDetails ? '?details=true' : ''}`,
      user ? { user, answers } : { answers }
    );
    return response.data;
  },

  // Get attempts for a user (optionally by quiz)
  getAttempts: async (email: string, quizId?: number): Promise<AttemptRecord[]> => {
    const params = new URLSearchParams({ email });
    if (quizId) params.append('quizId', String(quizId));
    const response = await axios.get(`${API_BASE_URL}/quiz/attempts?${params.toString()}`);
    return response.data.attempts;
  },

  // List quizzes (optionally by category)
  listQuizzes: async (
    category?: string,
    level?: string
  ): Promise<{ id: number; title: string; description: string; category: string | null; level: string | null }[]> => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (level) params.append('level', level);
    const response = await axios.get(`${API_BASE_URL}/quizzes${params.toString() ? `?${params.toString()}` : ''}`);
    return response.data.quizzes;
  }
};