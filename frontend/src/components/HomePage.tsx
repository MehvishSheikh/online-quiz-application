import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Trophy, Sparkles, ShieldCheck } from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('quiz_user');
    if (saved) {
      const u = JSON.parse(saved);
      setUsername(u.username || '');
      setEmail(u.email || '');
    }
  }, []);

  const proceed = () => {
    if (!username.trim() || !email.trim()) {
      setError('Please enter your name and email');
      return;
    }
    setError(null);
    sessionStorage.setItem('quiz_user', JSON.stringify({ username: username.trim(), email: email.trim() }));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-100 dark:from-background dark:to-secondary/30 text-foreground p-6">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-card">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs uppercase tracking-wider">Introducing</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-700 to-indigo-800 bg-clip-text text-transparent">QuizNova</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Master JavaScript, TypeScript, React, and Next with timed, scored assessments and beautiful reviews.</p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border rounded-xl p-5">
            <h3 className="font-semibold mb-2">1. Sign in</h3>
            <p className="text-sm text-muted-foreground mb-4">Use your name and email to track attempts and progress.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <input className="border rounded px-4 py-3" placeholder="Your name" value={username} onChange={(e)=>setUsername(e.target.value)} />
              <input className="border rounded px-4 py-3" placeholder="Email address" value={email} onChange={(e)=>setEmail(e.target.value)} />
            </div>
            {error && <p className="text-destructive text-sm mb-3">{error}</p>}
            <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white" onClick={proceed}>Continue</Button>
          </div>
          <div className="bg-card border rounded-xl p-5">
            <h3 className="font-semibold mb-2">2. Pick your quiz</h3>
            <p className="text-sm text-muted-foreground mb-4">Choose topic and level on your dashboard and start.</p>
            <div className="flex items-center gap-4">
              <BookOpen className="w-10 h-10 text-primary" />
              <div className="text-sm">
                <p>Topics: JS, TS, React, Next</p>
                <p>Levels: Basic, Advanced</p>
              </div>
            </div>
          </div>
          <div className="bg-card border rounded-xl p-5">
            <h3 className="font-semibold mb-2">3. Take the test</h3>
            <p className="text-sm text-muted-foreground mb-4">Timed questions, instant results, review with explanations.</p>
            <div className="flex items-center gap-4">
              <Clock className="w-10 h-10 text-primary" />
              <Trophy className="w-10 h-10 text-primary" />
            </div>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border rounded-xl p-4">
            <h4 className="font-semibold">Detailed reviews</h4>
            <p className="text-sm text-muted-foreground">See correct answers and your choices for each question.</p>
          </div>
          <div className="bg-card border rounded-xl p-4">
            <h4 className="font-semibold">Attempt history</h4>
            <p className="text-sm text-muted-foreground">Track scores over time and compare improvements.</p>
          </div>
          <div className="bg-card border rounded-xl p-4">
            <h4 className="font-semibold">Leaderboards</h4>
            <p className="text-sm text-muted-foreground">Compete with others per quiz and level.</p>
          </div>
          <div className="bg-card border rounded-xl p-4">
            <h4 className="font-semibold">Focus & integrity</h4>
            <p className="text-sm text-muted-foreground flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Fullscreen + tab change warnings.</p>
          </div>
        </div>

        {/* Secondary actions */}
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={()=>navigate('/history')}>View History</Button>
          <Button variant="outline" onClick={()=>navigate('/admin/create')}>Create Quiz</Button>
        </div>
      </div>
    </div>
  );
}


