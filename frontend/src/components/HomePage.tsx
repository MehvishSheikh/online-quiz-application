import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Trophy, Sparkles, ShieldCheck, Brain, Zap, Cpu, Bot } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
// Home page intentionally does not use AIPageShell per request

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
    <div className="min-h-screen ai-gradient-bg text-foreground">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 lg:p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg ai-button-gradient flex items-center justify-center shadow-lg ai-pulse">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold ai-text-gradient">QuizNova AI</span>
          </div>
          <ThemeToggle />
        </div>

        {/* Hero Section */}
        <div className="text-center py-8 px-4 lg:px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm mb-4 ai-card-glow">
            <Brain className="w-4 h-4 text-primary ai-pulse" />
            <span className="text-sm font-medium">AI-Powered Learning</span>
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3">
            Master <span className="ai-text-gradient">Any Technology</span> with AI
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
            Experience the future of learning with AI-generated quizzes, personalized assessments, and intelligent feedback on any topic you choose
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 lg:px-6 pb-8">
          {/* Get Started Card */}
          <div className="order-2 lg:order-1">
            <div className="bg-card border ai-rounded-2xl p-6 lg:p-8 shadow-sm h-full ai-card-glow">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Bot className="w-6 h-6 text-primary ai-float" />
                  <h2 className="text-xl lg:text-2xl font-bold">Ready for AI Learning?</h2>
                  <Cpu className="w-6 h-6 text-primary ai-float" />
                </div>
                <p className="text-muted-foreground">Enter your details to begin your AI-powered learning journey</p>
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
                  className="w-full py-3 text-lg font-medium ai-button-gradient text-white shadow-lg hover:shadow-xl transition-all duration-200" 
                  size="lg"
                  onClick={proceed}
                >
                  Start AI Learning
                  <Brain className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="order-1 lg:order-2">
             <div className="mb-6">
               <h2 className="text-xl lg:text-2xl font-bold mb-2 ai-text-gradient">Why Choose QuizNova AI?</h2>
               <p className="text-muted-foreground">Everything you need to master any technology with AI</p>
             </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-card border ai-rounded-xl p-4 ai-card-glow hover:scale-105 transition-transform">
                <div className="w-10 h-10 ai-button-gradient ai-rounded-lg flex items-center justify-center mb-3">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold mb-2">AI-Generated Quizzes</h3>
                <p className="text-sm text-muted-foreground">Personalized questions created by advanced AI</p>
              </div>
              
              <div className="bg-card border ai-rounded-xl p-4 ai-card-glow hover:scale-105 transition-transform">
                <div className="w-10 h-10 ai-button-gradient ai-rounded-lg flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Smart Assessment</h3>
                <p className="text-sm text-muted-foreground">AI adapts difficulty based on your performance</p>
              </div>
              
              <div className="bg-card border ai-rounded-xl p-4 ai-card-glow hover:scale-105 transition-transform">
                <div className="w-10 h-10 ai-button-gradient ai-rounded-lg flex items-center justify-center mb-3">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Intelligent Feedback</h3>
                <p className="text-sm text-muted-foreground">AI-powered explanations and learning paths</p>
              </div>
              
              <div className="bg-card border ai-rounded-xl p-4 ai-card-glow hover:scale-105 transition-transform">
                <div className="w-10 h-10 ai-button-gradient ai-rounded-lg flex items-center justify-center mb-3">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Adaptive Learning</h3>
                <p className="text-sm text-muted-foreground">AI tracks and optimizes your learning journey</p>
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


