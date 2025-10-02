import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { quizApi } from '@/services/api/api.service';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export const LeaderboardPage = () => {
  const { id } = useParams();
  const quizId = Number(id);
  const navigate = useNavigate();
  const [rows, setRows] = useState<Array<{ rank: number; username: string; email: string; score_percentage: number; correct_answers: number; total_questions: number; created_at: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    quizApi.getLeaderboard(quizId)
      .then(setRows)
      .catch(() => setError('Failed to load leaderboard'))
      .finally(() => setLoading(false));
  }, [quizId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center">{error}</div>;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 py-8">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Leaderboard</h1>
          <ThemeToggle />
        </div>
        <div className="bg-white dark:bg-card border rounded-md">
          <div className="grid grid-cols-6 px-4 py-2 text-sm font-semibold border-b">
            <div>Rank</div>
            <div className="col-span-2">User</div>
            <div>Score</div>
            <div>Correct</div>
            <div>Date</div>
          </div>
          {rows.map(r => (
            <div key={`${r.email}-${r.created_at}`} className="grid grid-cols-6 px-4 py-2 border-b last:border-b-0">
              <div>#{r.rank}</div>
              <div className="col-span-2">{r.username} <span className="text-xs text-muted-foreground">({r.email})</span></div>
              <div className="font-semibold">{r.score_percentage}%</div>
              <div>{r.correct_answers}/{r.total_questions}</div>
              <div className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    </div>
  );
}


