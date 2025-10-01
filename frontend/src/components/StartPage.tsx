import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Clock, Trophy } from 'lucide-react';

export const StartPage = () => {
  const navigate = useNavigate();

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
            size="lg" 
            className="w-full text-lg"
            onClick={() => navigate('/quiz')}
          >
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

