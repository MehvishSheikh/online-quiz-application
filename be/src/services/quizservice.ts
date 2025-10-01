import { db } from '../config/db'
import { Question, QuestionResponse, QuizSubmission, QuizResult, UserInfo, AttemptRecord } from '../models/quizmodel';

/**
 * Quiz domain logic: data access + scoring.
 */
export class QuizService {
  /** Upsert user by email; returns user id. */
  static upsertUser(user: UserInfo): Promise<number> {
    return new Promise((resolve, reject) => {
      const findSql = 'SELECT id FROM users WHERE email = ?';
      db.get(findSql, [user.email], (findErr, row: { id: number } | undefined) => {
        if (findErr) {
          reject(findErr);
          return;
        }
        if (row && typeof row.id === 'number') {
          // Update username if changed
          const updateSql = 'UPDATE users SET username = ? WHERE id = ?';
          db.run(updateSql, [user.username, row.id], (updErr) => {
            if (updErr) {
              reject(updErr);
              return;
            }
            resolve(row.id);
          });
          return;
        }
        const insertSql = 'INSERT INTO users (username, email) VALUES (?, ?)';
        db.run(insertSql, [user.username, user.email], function (insErr) {
          if (insErr) {
            reject(insErr);
            return;
          }
          resolve(this.lastID);
        });
      });
    });
  }
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

  /** Record an attempt for a user+quiz. Returns attempt id. */
  static recordAttempt(userId: number, quizId: number, result: QuizResult): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO attempts (user_id, quiz_id, total_questions, correct_answers, score_percentage)
                   VALUES (?, ?, ?, ?, ?)`;
      db.run(
        sql,
        [userId, quizId, result.total_questions, result.correct_answers, result.score_percentage],
        function (err) {
          if (err) {
            reject(err);
            return;
          }
          resolve(this.lastID);
        }
      );
    });
  }

  /** Fetch attempts for a given user and quiz. */
  static getAttempts(userEmail: string, quizId?: number): Promise<AttemptRecord[]> {
    return new Promise((resolve, reject) => {
      const sqlBase = `
        SELECT a.id, a.user_id, a.quiz_id, a.total_questions, a.correct_answers, a.score_percentage, a.created_at
        FROM attempts a
        JOIN users u ON u.id = a.user_id
        WHERE u.email = ?
      `;
      const params: any[] = [userEmail];
      const sql = quizId ? sqlBase + ' AND a.quiz_id = ? ORDER BY a.created_at DESC' : sqlBase + ' ORDER BY a.created_at DESC';
      if (quizId) params.push(quizId);
      db.all(sql, params, (err, rows: AttemptRecord[]) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows || []);
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