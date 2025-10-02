import { Router } from 'express';
import { QuizController } from '../controllers/quizcontroller';

const router = Router();

// Quiz routes mounted under /api
router.get('/quiz/:quizId/questions', QuizController.getQuestions);
router.post('/quiz/:quizId/submit', QuizController.submitQuiz);
router.get('/quiz/attempts', QuizController.getAttempts);
router.get('/quizzes', QuizController.listQuizzes);
router.get('/quiz/:quizId/leaderboard', QuizController.getLeaderboard);
router.post('/quizzes', QuizController.createQuiz);
router.post('/quizzes/:quizId/questions', QuizController.addQuestion);
router.post('/ai-assessment/generate', QuizController.generateAIAssessment);

export default router;