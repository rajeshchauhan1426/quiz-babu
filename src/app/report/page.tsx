"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { CheckCircle2, XCircle, BarChart, ChevronLeft } from "lucide-react";
import type { QuizResult } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/components/ui/chart"
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer } from "recharts";

export default function ReportPage() {
  const [results, setResults] = useState<QuizResult[] | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedResults = localStorage.getItem('quizResults');
    const storedEmail = localStorage.getItem('quizWhizEmail');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
    if(storedEmail){
        setEmail(storedEmail);
    }
  }, []);

  const handleTryAgain = () => {
    localStorage.removeItem('quizResults');
    localStorage.removeItem('quizWhizEmail');
    router.push('/');
  };

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h1 className="text-2xl font-bold">No results found.</h1>
        <p className="text-muted-foreground mt-2">Complete a quiz to see your report.</p>
        <Button onClick={() => router.push('/')} className="mt-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
      </div>
    );
  }

  const score = results.filter(r => r.isCorrect).length;
  const total = results.length;
  const scorePercentage = Math.round((score / total) * 100);

  const chartData = [
    { name: 'Correct', value: score, fill: 'var(--color-correct)' },
    { name: 'Incorrect', value: total - score, fill: 'var(--color-incorrect)' },
  ];
  
  const chartConfig = {
    value: {
      label: 'Questions',
    },
    correct: {
      label: 'Correct',
      color: 'hsl(var(--primary))',
    },
    incorrect: {
      label: 'Incorrect',
      color: 'hsl(var(--destructive))',
    },
  }

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary font-headline">Quiz Report</h1>
          <p className="text-lg text-muted-foreground mt-2">Here&apos;s how you did, {email || 'Quiz Taker'}!</p>
        </header>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-6 w-6 text-accent" />
              <span>Your Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center">
              <p className="text-6xl font-bold text-primary">{scorePercentage}%</p>
              <p className="text-xl text-muted-foreground mt-2">
                You answered <span className="font-semibold text-foreground">{score}</span> out of <span className="font-semibold text-foreground">{total}</span> questions correctly.
              </p>
            </div>
            <div className="w-full md:w-1/2 h-40">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer>
                  <RechartsBarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dot" hideLabel />}
                    />
                    <Bar dataKey="value" layout="vertical" radius={5} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Detailed Review</h2>
          {results.map((result, index) => (
            <Card key={index} className={cn("border-l-4", result.isCorrect ? "border-green-500" : "border-destructive")}>
              <CardHeader>
                <CardTitle className="text-lg">Q{index + 1}. {result.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="font-semibold w-32 shrink-0">Your Answer:</div>
                  <div className={cn("flex items-center gap-2", !result.isCorrect && "text-destructive")}>
                    {result.userAnswer ? (
                      <>
                        {!result.isCorrect && <XCircle className="h-5 w-5" />}
                        <span>{result.userAnswer}</span>
                      </>
                    ) : (
                      <span className="italic text-muted-foreground">Not Answered</span>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="font-semibold w-32 shrink-0">Correct Answer:</div>
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-500">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>{result.correctAnswer}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button onClick={handleTryAgain} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            Try Another Quiz
          </Button>
        </div>
      </div>
    </main>
  );
}
