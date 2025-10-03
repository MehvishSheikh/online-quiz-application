import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { quizApi } from '@/services/api/api.service';
import { ThemeToggle } from '@/components/theme-toggle';
import { BookOpen, Trophy, History, Plus, Play, User, ArrowRight, Brain, Sparkles } from 'lucide-react';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('javascript');
  const [level, setLevel] = useState('basic');
  const [quizzes, setQuizzes] = useState<Array<{ id: number; title: string; description: string; category: string | null; level: string | null }>>([]);

  const [user, setUser] = useState<{username: string, email: string} | null>(null);

  useEffect(() => {
    quizApi.listQuizzes(category, level).then(setQuizzes).catch(()=>setQuizzes([]));
    
    // Get user info
    const stored = sessionStorage.getItem('quiz_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, [category, level]);

  const start = () => {
    const id = quizzes[0]?.id;
    if (id) navigate(`/quiz/${id}`);
  }

  return (
    <div className="min-h-screen ai-gradient-bg text-foreground">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-border/50 bg-card/50 backdrop-blur-sm ai-card-glow">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg ai-button-gradient flex items-center justify-center shadow-lg ai-pulse">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight ai-text-gradient">QuizNova AI</h1>
          </div>
          <div className="flex items-center gap-3">
            <nav className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={()=>navigate('/home')}>
                Home
              </Button>
              <Button variant="ghost" size="sm" onClick={()=>navigate('/history')}>
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
              <Button variant="ghost" size="sm" onClick={()=>navigate('/admin/create')}>
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            </nav>
            <ThemeToggle />
          </div>
        </div>

        {/* Welcome Section */}
        {user && (
          <div className="p-4 lg:p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Welcome back, {user.username}!</h2>
                <p className="text-muted-foreground text-sm">Ready for your next challenge?</p>
              </div>
            </div>
          </div>
        )}

        {/* AI Assessment Banner */}
        <div className="p-4 lg:p-6 border-b">
          <div className="ai-card-glow border border-primary/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg ai-button-gradient flex items-center justify-center shadow-lg ai-pulse">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2 ai-text-gradient">
                    AI Assessment
                    <Sparkles className="w-5 h-5 text-primary ai-pulse" />
                  </h3>
                  <p className="text-muted-foreground">Create personalized quizzes on any topic with AI</p>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/ai-assessment')}
                className="ai-button-gradient text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Try AI Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 lg:p-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
            {/* Quiz Selection */}
            <div className="xl:col-span-3 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Choose Your Challenge</h3>
                
                {/* Topic Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">Select Topic</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: 'javascript', label: 'JavaScript', icon: '🟨', gradient: 'from-yellow-400 to-orange-500' },
                      { key: 'typescript', label: 'TypeScript', icon: '🔷', gradient: 'from-blue-500 to-indigo-600' },
                      { key: 'react', label: 'React', icon: '⚛️', gradient: 'from-cyan-400 to-blue-500' },
                      { key: 'next', label: 'Next.js', icon: '▲', gradient: 'from-gray-900 to-gray-700' }
                    ].map(topic => (
                      <button
                        key={topic.key}
                        onClick={()=>setCategory(topic.key)}
                        className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                          category === topic.key 
                            ? `bg-gradient-to-br ${topic.gradient} text-white border-transparent shadow-lg` 
                            : 'bg-gradient-to-br from-card to-card/80 hover:from-accent hover:to-accent/80 hover:scale-102 border-border shadow-sm hover:shadow-md'
                        }`}
                      >
                        <div className="text-2xl mb-2">{topic.icon}</div>
                        <div className="font-medium">{topic.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">Select Difficulty</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'basic', label: 'Basic', desc: 'Fundamental concepts', icon: '🌱', gradient: 'from-green-400 to-emerald-500' },
                      { key: 'advanced', label: 'Advanced', desc: 'Complex scenarios', icon: '🚀', gradient: 'from-purple-500 to-pink-500' }
                    ].map(lvl => (
                      <button
                        key={lvl.key}
                        onClick={()=>setLevel(lvl.key)}
                        className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                          level === lvl.key 
                            ? `bg-gradient-to-br ${lvl.gradient} text-white border-transparent shadow-lg` 
                            : 'bg-gradient-to-br from-card to-card/80 hover:from-accent hover:to-accent/80 hover:scale-102 border-border shadow-sm hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{lvl.icon}</span>
                          <div>
                            <div className="font-medium">{lvl.label}</div>
                            <div className={`text-xs ${level === lvl.key ? 'text-white/80' : 'text-muted-foreground'}`}>
                              {lvl.desc}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Available Quiz */}
                <div className="bg-card border rounded-xl p-6 ai-card-glow">
                  <h4 className="font-semibold mb-4">Ready to Start?</h4>
                  {quizzes[0] ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/30 rounded-lg ai-card-glow">
                        <h5 className="font-medium mb-1">{quizzes[0].title}</h5>
                        <p className="text-sm text-muted-foreground mb-3">{quizzes[0].description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            Multiple Choice
                          </span>
                          <span className="flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            Instant Results
                          </span>
                        </div>
                      </div>
                      <Button 
                        size="lg" 
                        onClick={start}
                        className="w-full ai-button-gradient text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Quiz Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                      <p className="text-muted-foreground">No quiz available for this combination.</p>
                      <p className="text-sm text-muted-foreground mt-1">Try a different topic or level.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-card border rounded-xl p-6 ai-card-glow">
                <h4 className="font-semibold mb-4">Quick Actions</h4>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-primary/20 hover:bg-primary/10 hover:border-primary/40" 
                    onClick={()=>navigate('/ai-assessment')}
                  >
                    <Brain className="w-4 h-4 mr-3 text-primary" />
                    AI Assessment
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={()=>navigate('/history')}>
                    <History className="w-4 h-4 mr-3" />
                    View History
                  </Button>
                  {quizzes[0] && (
                    <Button variant="outline" className="w-full justify-start" onClick={()=>navigate(`/leaderboard/${quizzes[0].id}`)}>
                      <Trophy className="w-4 h-4 mr-3" />
                      Leaderboard
                    </Button>
                  )}
                  <Button variant="outline" className="w-full justify-start" onClick={()=>navigate('/admin/create')}>
                    <Plus className="w-4 h-4 mr-3" />
                    Create Quiz
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


