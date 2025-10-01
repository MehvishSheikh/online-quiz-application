import { Router } from 'express';
import { QuizController } from '../controllers/quizcontroller';

const router = Router();

router.get('/quiz/:quizId/questions', QuizController.getQuestions);
router.post('/quiz/:quizId/submit', QuizController.submitQuiz);

export default router;