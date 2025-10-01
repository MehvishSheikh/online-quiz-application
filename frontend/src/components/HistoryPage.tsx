import { useEffect, useMemo, useState } from 'react';
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
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('quiz_user');
    const user = stored ? JSON.parse(stored) as { email: string; username?: string } : null;
    if (user?.email) {
      setEmail(user.email);
      setUsername(user.username || '');
      quizApi.getAttempts(user.email)
        .then(setAttempts)
        .catch(() => setError('Failed to load history.'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const groupedByQuiz = useMemo(() => {
    const map = new Map<number, AttemptRecord[]>();
    for (const a of attempts) {
      if (!map.has(a.quiz_id)) map.set(a.quiz_id, []);
      map.get(a.quiz_id)!.push(a);
    }
    return Array.from(map.entries()).sort(([a],[b]) => a - b);
  }, [attempts]);

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
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Your Quiz History</CardTitle>
              <div className="flex items-center gap-2">
                <input
                  className="hidden md:block w-64 px-3 py-2 border rounded-md focus:outline-none"
                  placeholder="Enter email to view history"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    if (!email.trim()) {
                      setError('Please enter an email');
                      return;
                    }
                    setError(null);
                    setLoading(true);
                    quizApi.getAttempts(email.trim())
                      .then(setAttempts)
                      .catch(() => setError('Failed to load history.'))
                      .finally(() => setLoading(false));
                  }}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!email && (
              <p className="text-muted-foreground">Enter your email above to view your history.</p>
            )}
            {email && attempts.length === 0 && (
              <p className="text-muted-foreground">No attempts yet for {email}.</p>
            )}
            {email && attempts.length > 0 && (
              <div className="space-y-6">
                {groupedByQuiz.map(([quizId, items]) => (
                  <div key={quizId}>
                    <h3 className="font-semibold mb-2">Quiz #{quizId}</h3>
                    <div className="space-y-2">
                      {items.map((a) => (
                        <div key={a.id} className="flex justify-between items-center bg-white rounded-md border p-3">
                          <div>
                            <p className="text-sm text-muted-foreground">{new Date(a.created_at).toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{a.score_percentage}%</p>
                            <p className="text-sm text-muted-foreground">{a.correct_answers}/{a.total_questions} correct</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {username && email ? (<span>Signed in as <span className="font-medium">{username}</span> ({email})</span>) : null}
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => navigate('/start')}>Back to Start</Button>
            <Button onClick={() => navigate('/quiz')}>Take Quiz</Button>
          </div>
        </div>
      </div>
    </div>
  );
};


