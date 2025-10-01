import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizApi } from '@/services/api/api.service';
import { type AttemptRecord } from '@/types/quiz.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const HistoryPage = () => {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('quiz_user');
    const user = stored ? JSON.parse(stored) as { email: string } : null;
    if (!user?.email) {
      setError('Please enter your details first.');
      setLoading(false);
      return;
    }
    quizApi.getAttempts(user.email)
      .then(setAttempts)
      .catch(() => setError('Failed to load history.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => navigate('/start')}>Go to Start</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Quiz History</CardTitle>
          </CardHeader>
          <CardContent>
            {attempts.length === 0 ? (
              <p className="text-muted-foreground">No attempts yet. Take your first quiz!</p>
            ) : (
              <div className="space-y-3">
                {attempts.map((a) => (
                  <div key={a.id} className="flex justify-between items-center bg-white rounded-md border p-3">
                    <div>
                      <p className="font-medium">Quiz #{a.quiz_id}</p>
                      <p className="text-sm text-muted-foreground">{new Date(a.created_at).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{a.score_percentage}%</p>
                      <p className="text-sm text-muted-foreground">{a.correct_answers}/{a.total_questions} correct</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <div className="flex justify-center">
          <Button onClick={() => navigate('/start')}>Back to Start</Button>
        </div>
      </div>
    </div>
  );
};


