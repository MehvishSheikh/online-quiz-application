import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { QuestionCard } from '@/components/QuestionsCards'; 
import { Timer } from '@/components/QuizTimer';
import { ProgressBar } from '@/components/ProgressBar';
import { useTimer } from '@/hooks/useTimer';
import { quizApi } from '@/services/api/api.service'
import { type Question, type Answer, type UserInfo } from '@/types/quiz.types';
import { ChevronLeft, ChevronRight, Send, Loader2 } from 'lucide-react';

export const QuizPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const quizId = Number(params.id || 1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, 'A' | 'B' | 'C' | 'D'>>(new Map());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { minutes, seconds, timeLeft, start } = useTimer(10);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await quizApi.getQuestions(quizId);
        setQuestions(data);
        setLoading(false);
        start();
      } catch (err) {
        setError('Failed to load questions. Please try again.');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [start, quizId]);

  useEffect(() => {
    if (timeLeft === 0 && questions.length > 0) {
      handleSubmit();
    }
  }, [timeLeft, questions.length]);

  const handleSelectOption = (option: 'A' | 'B' | 'C' | 'D') => {
    setAnswers(new Map(answers.set(questions[currentIndex].id, option)));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const submissionAnswers: Answer[] = Array.from(answers.entries()).map(
        ([question_id, selected_option]) => ({
          question_id,
          selected_option,
        })
      );

      const stored = sessionStorage.getItem('quiz_user');
      const user: UserInfo | undefined = stored ? JSON.parse(stored) : undefined;
      const result = await quizApi.submitQuiz(quizId, submissionAnswers, true, user);
      navigate('/results', { state: { result } });
    } catch (err) {
      setError('Failed to submit quiz. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => navigate('/')}>Go Back</Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const answeredCount = answers.size;
  const isWarning = timeLeft < 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Quiz</h1>
          <div className="flex items-center gap-2">
            <Timer minutes={minutes} seconds={seconds} isWarning={isWarning} />
          </div>
        </div>

        <ProgressBar current={currentIndex} total={questions.length} />

        <QuestionCard
          question={currentQuestion}
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          selectedOption={answers.get(currentQuestion.id)}
          onSelectOption={handleSelectOption}
        />

        <div className="flex justify-between items-center gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            {answeredCount} of {questions.length} answered
          </div>

          {isLastQuestion ? (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Quiz
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

