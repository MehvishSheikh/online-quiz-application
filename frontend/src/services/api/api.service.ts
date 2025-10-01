import axios from 'axios';
import { type Question, type Answer, type QuizResult } from '../../types/quiz.types';

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
    includeDetails: boolean = false
  ): Promise<QuizResult> => {
    const response = await axios.post(
      `${API_BASE_URL}/quiz/${quizId}/submit${includeDetails ? '?details=true' : ''}`,
      { answers }
    );
    return response.data;
  },
};