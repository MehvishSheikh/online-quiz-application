import { db } from '../config/db'
import { Question, QuestionResponse, QuizSubmission, QuizResult } from '../models/quizmodel';

/**
 * Quiz domain logic: data access + scoring.
 */
export class QuizService {
  /** Fetch questions for a quiz (no correct answers). */
  static getQuestions(quizId: number): Promise<QuestionResponse[]> {
    return new Promise((resolve, reject) => {
      const query = `SELECT id, question_text, option_a, option_b, option_c, option_d 
                     FROM questions WHERE quiz_id = ?`;
      
      db.all(query, [quizId], (err, rows: any[]) => {
        if (err) {
          reject(err);
          return;
        }

        const questions: QuestionResponse[] = rows.map((row) => ({
          id: row.id,
          question_text: row.question_text,
          options: {
            A: row.option_a,
            B: row.option_b,
            C: row.option_c,
            D: row.option_d,
          },
        }));

        resolve(questions);
      });
    });
  }

  /** Score a submission and optionally include per-question details. */
  static calculateScore(quizId: number, submission: QuizSubmission, includeDetails: boolean = false): Promise<QuizResult> {
    return new Promise((resolve, reject) => {
      const query = `SELECT id, question_text, option_a, option_b, option_c, option_d, correct_option 
                     FROM questions WHERE quiz_id = ?`;
      
      db.all(query, [quizId], (err, rows: Question[]) => {
        if (err) {
          reject(err);
          return;
        }

        if (rows.length === 0) {
          reject(new Error('No questions found for this quiz'));
          return;
        }

        let correctCount = 0;
        const details = [];

        // Quick lookup for user answers
        const answerMap = new Map(
          submission.answers.map((a) => [a.question_id, a.selected_option])
        );

        for (const question of rows) {
          const userAnswer = answerMap.get(question.id);
          const isCorrect = userAnswer === question.correct_option;

          if (isCorrect) {
            correctCount++;
          }

          if (includeDetails) {
            const optionKey = `option_${question.correct_option.toLowerCase()}` as keyof Question;
            const userOptionKey = userAnswer ? `option_${userAnswer.toLowerCase()}` as keyof Question : null;

            details.push({
              question_id: question.id,
              question_text: question.question_text,
              user_answer: userAnswer && userOptionKey ? String(question[userOptionKey]) : 'Not answered',
              correct_answer: String(question[optionKey]),
              is_correct: isCorrect,
            });
          }
        }

        const result: QuizResult = {
          total_questions: rows.length,
          correct_answers: correctCount,
          score_percentage: Math.round((correctCount / rows.length) * 100),
        };

        if (includeDetails) {
          result.details = details;
        }

        resolve(result);
      });
    });
  }

  /** Check if a quiz exists by ID. */
  static quizExists(quizId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.get('SELECT id FROM quizzes WHERE id = ?', [quizId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(!!row);
      });
    });
  }
}