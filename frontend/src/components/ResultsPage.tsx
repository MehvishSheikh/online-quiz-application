// ==================== src/pages/ResultsPage.tsx ====================
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { quizApi } from '@/services/api/api.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type QuizResult } from '@/types/quiz.types';
import { Trophy, CheckCircle2, XCircle, Home } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result as QuizResult;
  const quizId = location.state?.quizId as number | undefined;

  if (!result) {
    navigate('/');
    return null;
  }

  const scoreColor = 
    result.score_percentage >= 80 ? 'text-green-600' :
    result.score_percentage >= 60 ? 'text-yellow-600' :
    'text-red-600';

  const getMessage = () => {
    if (result.score_percentage >= 80) return 'Excellent Work! 🎉';
    if (result.score_percentage >= 60) return 'Good Job! 👍';
    return 'Keep Practicing! 💪';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Trophy className={`w-16 h-16 ${scoreColor}`} />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">{getMessage()}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div>
                <p className="text-6xl font-bold mb-2 ${scoreColor}">
                  {result.score_percentage}%
                </p>
                <Progress value={result.score_percentage} className="h-3" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-3xl font-bold text-green-600">
                    {result.correct_answers}
                  </p>
                  <p className="text-sm text-green-700">Correct</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-3xl font-bold text-red-600">
                    {result.total_questions - result.correct_answers}
                  </p>
                  <p className="text-sm text-red-700">Incorrect</p>
                </div>
              </div>
            </div>

            {result.details && result.details.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">Review Your Answers</h3>
                {result.details.map((detail, index) => (
                  <Card key={detail.question_id} className={detail.is_correct ? 'border-green-200' : 'border-red-200'}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        {detail.is_correct ? (
                          <CheckCircle2 className="w-6 h-6 text-green" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red" />
                        )}
                        <CardTitle className="text-lg font-semibold">
                          Question {index + 1}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{detail.question_text}</p>
                      <p className="text-sm mt-2">
                        <span className="font-semibold">Your Answer:</span>{' '}
                        {detail.user_answer}
                      </p>
                      <p className="text-sm mt-2">
                        <span className="font-semibold">Correct Answer:</span>{' '}
                        {detail.correct_answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <div className="flex justify-center gap-2">
          <Button variant="outline" onClick={() => navigate('/')}> 
            <Home className="w-4 h-4 mr-2" /> Back to Home
          </Button>
          {quizId && (
            <Button onClick={() => navigate(`/leaderboard/${quizId}`)}>
              View Leaderboard
            </Button>
          )}
          <Button onClick={() => navigate('/history')}>
            View History
          </Button>
        </div>
      </div>
    </div>
  );
};