export interface Question {
    type: 'multiple' | 'boolean';
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
  }
  
  export interface ApiResponse {
    response_code: number;
    results: Question[];
  }
  
  export interface QuizResult {
    question: string;
    userAnswer: string | null;
    correctAnswer: string;
    isCorrect: boolean;
    allAnswers: string[];
  }
  