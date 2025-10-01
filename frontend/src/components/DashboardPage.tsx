import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { quizApi } from '@/services/api/api.service';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('javascript');
  const [level, setLevel] = useState('basic');
  const [quizzes, setQuizzes] = useState<Array<{ id: number; title: string; description: string; category: string | null; level: string | null }>>([]);

  useEffect(() => {
    quizApi.listQuizzes(category, level).then(setQuizzes).catch(()=>setQuizzes([]));
  }, [category, level]);

  const start = () => {
    const id = quizzes[0]?.id;
    if (id) navigate(`/quiz/${id}`);
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-card border rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Choose a topic</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['javascript','typescript','react','next'].map(c => (
                  <button key={c} onClick={()=>setCategory(c)} className={`px-3 py-2 rounded-md border text-sm ${category===c? 'bg-primary text-white border-primary':'bg-white dark:bg-secondary hover:bg-secondary'}`}>{c[0].toUpperCase()+c.slice(1)}</button>
                ))}
              </div>
            </div>
            <div className="bg-card border rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Select level</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['basic','advanced'].map(l => (
                  <button key={l} onClick={()=>setLevel(l)} className={`px-3 py-2 rounded-md border text-sm ${level===l? 'bg-primary text-white border-primary':'bg-white dark:bg-secondary hover:bg-secondary'}`}>{l[0].toUpperCase()+l.slice(1)}</button>
                ))}
              </div>
            </div>
            <div className="bg-card border rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Available quiz</h2>
              {quizzes[0] ? (
                <div className="flex items-center justify-between border rounded-md bg-white dark:bg-secondary p-3">
                  <div>
                    <p className="font-medium">{quizzes[0].title}</p>
                    <p className="text-sm text-muted-foreground">{quizzes[0].description}</p>
                  </div>
                  <Button size="lg" onClick={start}>Start</Button>
                </div>
              ) : (
                <p className="text-muted-foreground">No quiz available for this combination.</p>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-card border rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
              <div className="grid gap-2">
                <Button variant="outline" onClick={()=>navigate('/history')}>View History</Button>
                {quizzes[0] && <Button variant="outline" onClick={()=>navigate(`/leaderboard/${quizzes[0].id}`)}>View Leaderboard</Button>}
                <Button variant="outline" onClick={()=>navigate('/admin/create')}>Create Quiz</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


