import { Request, Response } from 'express';
import { QuizService } from '../services/quizservice';
import { QuizSubmission } from '../models/quizmodel';

export class QuizController {
  // GET /api/quiz/:quizId/questions
  static async getQuestions(req: Request, res: Response) {
    try {
      const quizId = parseInt(req.params.quizId);

      if (isNaN(quizId)) {
        res.status(400).json({ error: 'Invalid quiz ID' });
        return;
      }

      const exists = await QuizService.quizExists(quizId);
      if (!exists) {
        res.status(404).json({ error: 'Quiz not found' });
        return;
      }

      const questions = await QuizService.getQuestions(quizId);
      res.json({ questions });
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({ error: 'Failed to fetch questions' });
    }
  }

  // POST /api/quiz/:quizId/submit
  static async submitQuiz(req: Request, res: Response) {
    try {
      const quizId = parseInt(req.params.quizId);
      const submission: QuizSubmission = req.body;
      const includeDetails = req.query.details === 'true';

      if (isNaN(quizId)) {
        res.status(400).json({ error: 'Invalid quiz ID' });
        return;
      }

      if (!submission.answers || !Array.isArray(submission.answers)) {
        res.status(400).json({ error: 'Invalid submission format' });
        return;
      }

      // Validate each answer
      for (const answer of submission.answers) {
        if (!answer.question_id || !answer.selected_option) {
          res.status(400).json({ error: 'Each answer must have question_id and selected_option' });
          return;
        }
        if (!['A', 'B', 'C', 'D'].includes(answer.selected_option)) {
          res.status(400).json({ error: 'Invalid option selected' });
          return;
        }
      }

      const result = await QuizService.calculateScore(quizId, submission, includeDetails);
      res.json(result);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      res.status(500).json({ error: 'Failed to calculate score' });
    }
  }
}