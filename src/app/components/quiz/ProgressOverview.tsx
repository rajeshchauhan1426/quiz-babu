import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

interface ProgressOverviewProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  answers: (string | null)[];
  goToQuestion: (index: number) => void;
}

export function ProgressOverview({ totalQuestions, currentQuestionIndex, answers, goToQuestion }: ProgressOverviewProps) {
  return (
    <aside className="w-full md:w-64 lg:w-72 bg-card border-b md:border-b-0 md:border-r p-6 flex-shrink-0">
      <h2 className="text-lg font-semibold mb-4">Questions</h2>
      <ScrollArea className="h-full">
        <div className="grid grid-cols-5 gap-2 pr-4">
          {Array.from({ length: totalQuestions }).map((_, index) => {
            const isAnswered = answers[index] !== null;
            const isActive = index === currentQuestionIndex;

            return (
              <Button
                key={index}
                onClick={() => goToQuestion(index)}
                variant={isActive ? 'default' : isAnswered ? 'secondary' : 'outline'}
                className={cn(
                  "h-12 w-12 rounded-full text-lg font-bold aspect-square",
                  isActive && "ring-2 ring-offset-2 ring-accent",
                )}
                aria-label={`Go to question ${index + 1}`}
              >
                {index + 1}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
