"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Question } from '@/lib/types';
import { QuestionCard } from './QuestionCard';
import { ProgressOverview } from './ProgressOverview';
import { Timer } from './Timer';
import { Button } from '../ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface QuizClientProps {
  questions: Question[];
}

interface ProcessedQuestion extends Question {
    shuffledAnswers: string[];
}

function decodeHtml(html: string) {
    if (typeof document === 'undefined') return html;
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

export function QuizClient({ questions: rawQuestions }: QuizClientProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(Array(rawQuestions.length).fill(null));
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [processedQuestions, setProcessedQuestions] = useState<ProcessedQuestion[]>([]);

  useEffect(() => {
    const processed = rawQuestions.map(q => ({
      ...q,
      question: decodeHtml(q.question),
      correct_answer: decodeHtml(q.correct_answer),
      incorrect_answers: q.incorrect_answers.map(a => decodeHtml(a)),
      shuffledAnswers: [...q.incorrect_answers.map(a => decodeHtml(a)), decodeHtml(q.correct_answer)]
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value),
    }));
    setProcessedQuestions(processed);
  }, [rawQuestions]);
  
  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < rawQuestions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < rawQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = useCallback(() => {
    const results = processedQuestions.map((q, index) => ({
      question: q.question,
      userAnswer: answers[index],
      correctAnswer: q.correct_answer,
      isCorrect: answers[index] === q.correct_answer,
      allAnswers: q.shuffledAnswers,
    }));
    localStorage.setItem('quizResults', JSON.stringify(results));
    router.push('/report');
  }, [answers, processedQuestions, router]);

  const confirmSubmit = () => {
    setShowSubmitDialog(true);
  };

  if (processedQuestions.length === 0) {
    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            <aside className="w-full md:w-64 lg:w-72 bg-card border-r p-6 hidden md:flex flex-col flex-shrink-0">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 15 }).map((_, i) => <Skeleton key={i} className="h-12 w-12 rounded-full" />)}
                </div>
            </aside>
            <main className="flex-1 flex flex-col p-4 md:p-8 lg:p-12">
                <header className="flex justify-between items-center mb-6">
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-10 w-24" />
                </header>
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-3xl space-y-8">
                        <Skeleton className="h-8 w-full" />
                        <div className="space-y-4">
                            <Skeleton className="h-16 w-full rounded-lg" />
                            <Skeleton className="h-16 w-full rounded-lg" />
                            <Skeleton className="h-16 w-full rounded-lg" />
                            <Skeleton className="h-16 w-full rounded-lg" />
                        </div>
                    </div>
                </div>
                <footer className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex gap-4">
                        <Skeleton className="h-10 w-28 rounded-md" />
                        <Skeleton className="h-10 w-24 rounded-md" />
                    </div>
                    <Skeleton className="h-6 w-48 rounded-md" />
                    <Skeleton className="h-12 w-36 rounded-md" />
                </footer>
            </main>
        </div>
    );
  }

  const currentQuestion = processedQuestions[currentQuestionIndex];
  const answeredCount = answers.filter(a => a !== null).length;

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <ProgressOverview
        totalQuestions={rawQuestions.length}
        currentQuestionIndex={currentQuestionIndex}
        answers={answers}
        goToQuestion={goToQuestion}
      />
      
      <main className="flex-1 flex flex-col p-4 md:p-8 lg:p-12">
        <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-primary font-headline">QuizBabu</h1>
            <Timer duration={30 * 60} onTimeUp={handleSubmit} />
        </header>

        <div className="flex-1 flex items-center justify-center">
            <QuestionCard
                question={currentQuestion.question}
                answers={currentQuestion.shuffledAnswers}
                selectedAnswer={answers[currentQuestionIndex]}
                onAnswerSelect={handleAnswerSelect}
                questionNumber={currentQuestionIndex + 1}
            />
        </div>

        <footer className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-4">
                <Button onClick={handlePrev} disabled={currentQuestionIndex === 0} variant="outline">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button onClick={handleNext} disabled={currentQuestionIndex === rawQuestions.length - 1} variant="outline">
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
            <div className="text-sm text-muted-foreground">
                {answeredCount} of {rawQuestions.length} questions answered
            </div>
            <Button onClick={confirmSubmit} className="bg-accent text-accent-foreground hover:bg-accent/90">
                <CheckCircle className="mr-2 h-4 w-4" /> Submit Quiz
            </Button>
        </footer>
      </main>

      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
            <AlertDialogDescription>
              Any unanswered questions will be marked as incorrect. You cannot change your answers after submitting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-accent text-accent-foreground hover:bg-accent/90">Submit</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
