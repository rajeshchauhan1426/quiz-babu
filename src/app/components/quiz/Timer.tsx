"use client";

import { useState, useEffect } from 'react';
import { Timer as TimerIcon } from 'lucide-react';
import { Card } from '../ui/card';

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
}

export function Timer({ duration, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const isLowTime = timeLeft <= 60;

  return (
    <Card className={`flex items-center gap-2 px-4 py-2 transition-colors ${isLowTime ? 'bg-destructive text-destructive-foreground' : ''}`}>
      <TimerIcon className="h-5 w-5" />
      <span className="font-mono text-lg font-semibold">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </Card>
  );
}
