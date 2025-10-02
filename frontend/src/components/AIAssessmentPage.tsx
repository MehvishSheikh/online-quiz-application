import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Brain, BookOpen, Clock, Target, Sparkles, Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

interface AssessmentConfig {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
}

export const AIAssessmentPage = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<AssessmentConfig>({
    topic: '',
    difficulty: 'medium',
    questionCount: 10
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const topics = [
    'JavaScript Fundamentals',
    'React Development',
    'TypeScript',
    'Node.js',
    'CSS & HTML',
    'Web APIs',
    'Data Structures',
    'Algorithms',
    'Database Design',
    'System Design'
  ];

  const difficultyLevels = [
    { 
      value: 'easy', 
      label: 'Easy', 
      description: 'Basic concepts and fundamentals',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    { 
      value: 'medium', 
      label: 'Medium', 
      description: 'Intermediate knowledge required',
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
      borderColor: 'border-yellow-200 dark:border-yellow-800'
    },
    { 
      value: 'hard', 
      label: 'Hard', 
      description: 'Advanced concepts and problem-solving',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-950',
      borderColor: 'border-red-200 dark:border-red-800'
    }
  ];

  const questionCounts = [5, 10, 15, 20, 25, 30];

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!config.topic.trim()) {
      newErrors.topic = 'Please select or enter a topic';
    }

    if (config.questionCount < 5 || config.questionCount > 50) {
      newErrors.questionCount = 'Question count must be between 5 and 50';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateQuiz = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);
    
    try {
      // Call API to generate quiz
      const response = await fetch('http://localhost:3001/api/ai-assessment/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: config.topic,
          difficulty: config.difficulty,
          questionCount: config.questionCount
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate quiz');
      }

      const data = await response.json();
      
      // Navigate to the quiz page with the generated quiz ID
      navigate(`/quiz/${data.quizId}`);
    } catch (error) {
      console.error('Error generating quiz:', error);
      setErrors({ general: error instanceof Error ? error.message : 'Failed to generate quiz. Please try again.' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary/10">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
                AI Assessment
              </span>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <BookOpen className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Create Your Assessment</h2>
              </div>

              {/* Topic Selection */}
              <div className="space-y-4 mb-8">
                <label className="block text-base font-medium">
                  What topic would you like to be assessed on?
                </label>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Type your topic or choose from suggestions below"
                    value={config.topic}
                    onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                    className={`w-full px-4 py-4 text-lg border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                      errors.topic ? 'border-red-500' : 'border-input'
                    }`}
                  />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {topics.slice(0, 8).map((topic) => (
                      <button
                        key={topic}
                        onClick={() => setConfig({ ...config, topic })}
                        className={`px-4 py-3 text-sm rounded-lg border transition-colors hover:bg-primary hover:text-primary-foreground ${
                          config.topic === topic
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-input hover:border-primary'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                  {errors.topic && (
                    <p className="text-sm text-red-500">{errors.topic}</p>
                  )}
                </div>
              </div>

              {/* Difficulty Level */}
              <div className="space-y-4 mb-8">
                <label className="block text-base font-medium">
                  Choose difficulty level
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {difficultyLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setConfig({ ...config, difficulty: level.value as 'easy' | 'medium' | 'hard' })}
                      className={`p-6 text-center border rounded-xl transition-all hover:scale-105 ${
                        config.difficulty === level.value
                          ? `${level.bgColor} ${level.borderColor} ${level.color}`
                          : 'bg-card border-input hover:border-primary'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Target className="w-6 h-6" />
                        <span className="font-semibold text-lg">{level.label}</span>
                        <p className="text-xs opacity-80">{level.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Count */}
              <div className="space-y-4 mb-8">
                <label className="block text-base font-medium">
                  How many questions?
                </label>
                <div className="space-y-4">
                  <div className="grid grid-cols-6 gap-3">
                    {questionCounts.map((count) => (
                      <button
                        key={count}
                        onClick={() => setConfig({ ...config, questionCount: count })}
                        className={`px-4 py-3 rounded-lg border transition-colors text-center ${
                          config.questionCount === count
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-input hover:border-primary hover:bg-primary/10'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Custom:</span>
                    <input
                      type="number"
                      min="5"
                      max="50"
                      value={config.questionCount}
                      onChange={(e) => setConfig({ ...config, questionCount: parseInt(e.target.value) || 10 })}
                      className="w-24 px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">(5-50)</span>
                  </div>
                  {errors.questionCount && (
                    <p className="text-sm text-red-500">{errors.questionCount}</p>
                  )}
                </div>
              </div>

              {/* Generate Button */}
              <div className="space-y-4">
                {errors.general && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <p className="text-destructive text-sm">{errors.general}</p>
                  </div>
                )}
                
                <Button
                  onClick={handleGenerateQuiz}
                  disabled={isGenerating}
                  className="w-full py-4 text-lg font-medium bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  size="lg"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Generating Assessment...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5" />
                      <span>Generate AI Assessment</span>
                      <Sparkles className="w-5 h-5" />
                    </div>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Summary Panel */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Summary</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Topic:</span>
                  <span className="font-medium text-right max-w-32 truncate" title={config.topic}>
                    {config.topic || 'Not selected'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Level:</span>
                  <span className={`font-medium capitalize ${
                    difficultyLevels.find(l => l.value === config.difficulty)?.color || ''
                  }`}>
                    {config.difficulty}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Questions:</span>
                  <span className="font-medium">{config.questionCount}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">~{Math.ceil(config.questionCount * 1.5)} min</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
