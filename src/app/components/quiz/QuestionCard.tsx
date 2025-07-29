import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  questionNumber: number;
  question: string;
  answers: string[];
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
}

export function QuestionCard({ questionNumber, question, answers, selectedAnswer, onAnswerSelect }: QuestionCardProps) {
  return (
    <Card className="w-full max-w-3xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl leading-snug">
          <span className="text-primary mr-2">Q{questionNumber}.</span>
          {question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAnswer ?? undefined}
          onValueChange={onAnswerSelect}
          className="space-y-4"
        >
          {answers.map((answer, index) => (
            <Label
              key={index}
              htmlFor={`q${questionNumber}-a${index}`}
              className={cn(
                "flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-all",
                "hover:bg-accent/20",
                selectedAnswer === answer ? "bg-accent/30 border-accent ring-2 ring-accent" : "bg-card"
              )}
            >
              <RadioGroupItem value={answer} id={`q${questionNumber}-a${index}`} />
              <span className="text-base md:text-lg">{answer}</span>
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
