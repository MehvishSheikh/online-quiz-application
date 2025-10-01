export interface Question {
  id: number;
  quiz_id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'A' | 'B' | 'C' | 'D';
}

export interface QuestionResponse {
  id: number;
  question_text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

export interface AnswerSubmission {
  question_id: number;
  selected_option: 'A' | 'B' | 'C' | 'D';
}

export interface QuizSubmission {
  answers: AnswerSubmission[];
}

export interface QuizResult {
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  details?: {
    question_id: number;
    question_text: string;
    user_answer: string;
    correct_answer: string;
    is_correct: boolean;
  }[];
}