import { Router } from 'express';
import { QuizController } from '../controllers/quizcontroller';

const router = Router();

// Quiz routes mounted under /api
router.get('/quiz/:quizId/questions', QuizController.getQuestions);
router.post('/quiz/:quizId/submit', QuizController.submitQuiz);
router.get('/quiz/attempts', QuizController.getAttempts);

export default router;