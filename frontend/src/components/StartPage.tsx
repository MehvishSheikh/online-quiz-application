import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { quizApi } from '@/services/api/api.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Clock, Trophy } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

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

  // Redirect to home page for better user flow
  useEffect(() => {
    navigate('/home');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-primary animate-pulse" />
        </div>
        <p className="text-muted-foreground">Redirecting to QuizNova...</p>
      </div>
    </div>
  );
};

