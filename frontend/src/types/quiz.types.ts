export interface Question {
  id: number;
  question_text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

export interface Answer {
  question_id: number;
  selected_option: 'A' | 'B' | 'C' | 'D';
}

export interface QuizResult {
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  details?: QuizDetail[];
}

export interface QuizDetail {
  question_id: number;
  question_text: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
}