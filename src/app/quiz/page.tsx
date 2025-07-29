import { QuizClient } from '@/app/components/quiz/QuizClient';
import type { Question } from '@/lib/types';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';

async function getQuestions(): Promise<Question[]> {
  try {
    const response = await fetch('https://opentdb.com/api.php?amount=15', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    const data = await response.json();
    if (data.response_code !== 0) {
    
      console.error('API returned an error code:', data.response_code);
      throw new Error(`API returned error code: ${data.response_code}`);
    }
    return data.results;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
}

export default async function QuizPage() {
  const questions = await getQuestions();

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h1 className="text-2xl font-bold text-destructive">Failed to Load Quiz</h1>
        <p className="mt-2 text-muted-foreground">There was an issue fetching questions from the server. Please try again later.</p>
        <Button asChild className="mt-6">
          <Link href="/">
            Return to Home
          </Link>
        </Button>
      </div>
    );
  }

  return <QuizClient questions={questions} />;
}
