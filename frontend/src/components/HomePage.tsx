import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Trophy, Sparkles, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

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
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary/10 text-foreground">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 lg:p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">QuizNova</span>
          </div>
          <ThemeToggle />
        </div>

        {/* Hero Section */}
        <div className="text-center py-8 px-4 lg:px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-sm mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Test Your Skills</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3">
            Master <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">Frontend</span> Development
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
            Challenge yourself with comprehensive quizzes on JavaScript, TypeScript, React, and Next.js
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 lg:px-6 pb-8">
          {/* Get Started Card */}
          <div className="order-2 lg:order-1">
            <div className="bg-card border rounded-2xl p-6 lg:p-8 shadow-sm h-full">
              <div className="text-center mb-6">
                <h2 className="text-xl lg:text-2xl font-bold mb-2">Ready to Start?</h2>
                <p className="text-muted-foreground">Enter your details to begin your learning journey</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name</label>
                  <input 
                    className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" 
                    placeholder="Enter your full name" 
                    value={username} 
                    onChange={(e)=>setUsername(e.target.value)} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input 
                    className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" 
                    placeholder="your.email@example.com" 
                    type="email"
                    value={email} 
                    onChange={(e)=>setEmail(e.target.value)} 
                  />
                </div>
                
                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <p className="text-destructive text-sm">{error}</p>
                  </div>
                )}
                
                <Button 
                  className="w-full py-3 text-lg font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-200" 
                  size="lg"
                  onClick={proceed}
                >
                  Start Learning
                  <BookOpen className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="order-1 lg:order-2">
            <div className="mb-6">
              <h2 className="text-xl lg:text-2xl font-bold mb-2">Why Choose QuizNova?</h2>
              <p className="text-muted-foreground">Everything you need to master frontend development</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-card border rounded-xl p-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Comprehensive Topics</h3>
                <p className="text-sm text-muted-foreground">JavaScript, TypeScript, React, and Next.js</p>
              </div>
              
              <div className="bg-card border rounded-xl p-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Timed Challenges</h3>
                <p className="text-sm text-muted-foreground">Test your knowledge under pressure</p>
              </div>
              
              <div className="bg-card border rounded-xl p-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Instant Results</h3>
                <p className="text-sm text-muted-foreground">Get detailed feedback immediately</p>
              </div>
              
              <div className="bg-card border rounded-xl p-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Track Progress</h3>
                <p className="text-sm text-muted-foreground">Monitor your learning journey</p>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary actions */}
        <div className="text-center pb-8 px-4 lg:px-6">
          <p className="text-muted-foreground mb-4">Already have an account?</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={()=>navigate('/history')}>
              View History
            </Button>
            <Button variant="outline" onClick={()=>navigate('/admin/create')}>
              Create Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


