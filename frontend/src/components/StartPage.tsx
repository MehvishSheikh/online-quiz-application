import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { quizApi } from '@/services/api/api.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Clock, Trophy } from 'lucide-react';

export const StartPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('javascript');
  const [level, setLevel] = useState<string>('basic');
  const [quizzes, setQuizzes] = useState<{ id: number; title: string; description: string; category: string | null }[]>([]);

  useEffect(() => {
    quizApi.listQuizzes(category, level)
      .then(setQuizzes)
      .catch(() => setQuizzes([]));
  }, [category, level]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <BookOpen className="w-12 h-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold">JavaScript Quiz</CardTitle>
          <CardDescription className="text-lg mt-2">
            Test your knowledge of JavaScript fundamentals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col items-center p-4 bg-secondary rounded-lg">
              <BookOpen className="w-8 h-8 text-primary mb-2" />
              <p className="text-sm font-semibold">5 Questions</p>
              <p className="text-xs text-muted-foreground">Multiple choice</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-secondary rounded-lg">
              <Clock className="w-8 h-8 text-primary mb-2" />
              <p className="text-sm font-semibold">10 Minutes</p>
              <p className="text-xs text-muted-foreground">Time limit</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-secondary rounded-lg">
              <Trophy className="w-8 h-8 text-primary mb-2" />
              <p className="text-sm font-semibold">Score & Review</p>
              <p className="text-xs text-muted-foreground">Instant results</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Read each question carefully</li>
              <li>Select one answer per question</li>
              <li>Navigate using Next/Previous buttons</li>
              <li>Submit when you're ready</li>
              <li>You can review your answers before submitting</li>
            </ul>
          </div>

          <Button 
            variant="outline"
            className="w-full"
            onClick={() => navigate('/history')}
          >
            View History
          </Button>

          <div className="space-y-3">
            <div>
              <h4 className="font-semibold mb-2">Choose a topic</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['javascript','typescript','react','next'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-3 py-2 rounded-md border text-sm ${category===c? 'bg-primary text-white border-primary':'bg-white text-black hover:bg-secondary'}`}
                  >{c[0].toUpperCase()+c.slice(1)}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Select level</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['basic','advanced'].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`px-3 py-2 rounded-md border text-sm ${level===l? 'bg-primary text-white border-primary':'bg-white text-black hover:bg-secondary'}`}
                  >{l[0].toUpperCase()+l.slice(1)}</button>
                ))}
              </div>
            </div>
            {quizzes.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Available quizzes</h4>
                <div className="grid gap-2">
                  {quizzes.slice(0,1).map(q => (
                    <div key={q.id} className="flex items-center justify-between border rounded-md bg-white p-3">
                      <div>
                        <p className="font-medium">{q.title}</p>
                        <p className="text-sm text-muted-foreground">{q.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button 
              size="lg" 
              className="w-full text-lg"
              onClick={() => {
                if (!username.trim() || !email.trim()) {
                  setError('Please enter your name and email');
                  return;
                }
                setError(null);
                sessionStorage.setItem('quiz_user', JSON.stringify({ username: username.trim(), email: email.trim() }));
                // Start the selected topic+level quiz (first match)
                const id = quizzes[0]?.id ?? 1;
                navigate(`/quiz/${id}`);
              }}
            >
              Start Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

