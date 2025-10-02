// ==================== src/components/quiz/QuestionCard.tsx ====================
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Question } from '@/types/quiz.types';
import { CheckCircle2 } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedOption?: 'A' | 'B' | 'C' | 'D';
  onSelectOption: (option: 'A' | 'B' | 'C' | 'D') => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOption,
  onSelectOption,
}) => {
  const options: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl leading-relaxed mb-4">
          {question.question_text}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose the best answer from the options below
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {options.map((option) => {
            const isSelected = selectedOption === option;
            return (
              <button
                key={option}
                onClick={() => onSelectOption(option)}
                className={`w-full p-4 rounded-xl border text-left transition-all hover:scale-[1.02] ${
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                    : 'bg-card hover:bg-accent border-border hover:border-accent-foreground/20'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isSelected 
                      ? 'border-primary-foreground bg-primary-foreground/20' 
                      : 'border-muted-foreground/30'
                  }`}>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-bold">{option}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className={`text-base leading-relaxed ${
                      isSelected ? 'font-medium' : ''
                    }`}>
                      {question.options[option]}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        {selectedOption && (
          <div className="mt-6 p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Answer selected. You can change your selection or continue to the next question.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};