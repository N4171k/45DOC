
'use client';
import React, { useMemo } from 'react';
import { Flame } from 'lucide-react';
import type { ChallengeCompletion } from '@/lib/types';
import { differenceInCalendarDays } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

export function Header({ completions }: { completions: Record<string, ChallengeCompletion> }) {
  const { streak } = useMemo(() => {
    if (Object.keys(completions).length === 0) {
      return { streak: 0 };
    }

    const dates = Object.values(completions)
      .map(c => new Date(c.completedAt))
      .sort((a, b) => b.getTime() - a.getTime());
    
    let currentStreak = 0;
    if (dates.length > 0) {
      const today = new Date();
      const diffFromToday = differenceInCalendarDays(today, dates[0]);
      if (diffFromToday <= 1) {
        currentStreak = 1;
        for (let i = 0; i < dates.length - 1; i++) {
          const diff = differenceInCalendarDays(dates[i], dates[i+1]);
          if (diff === 1) {
            currentStreak++;
          } else if (diff > 1) {
            break;
          }
        }
      }
    }

    return { streak: currentStreak };
  }, [completions]);
  
  const [pop, setPop] = React.useState(false);
  const prevStreak = React.useRef(streak);
  
  React.useEffect(() => {
    if (streak > prevStreak.current) {
      setPop(true);
      const timer = setTimeout(() => setPop(false), 300); // duration of animation
      return () => clearTimeout(timer);
    }
    prevStreak.current = streak;
  }, [streak]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center space-x-4">
           <h1 className="text-2xl font-bold font-headline text-foreground">CodeStreak</h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Current Streak</span>
            <div className="flex items-center gap-1 text-orange-500 font-bold text-lg">
              <span>{streak}</span>
              <Flame className={`h-5 w-5 ${pop ? 'animate-streak-pop' : ''}`} />
            </div>
          </div>
          <Link href="/profile">
            <Avatar className="cursor-pointer">
              <AvatarImage src="https://placehold.co/40x40.png" alt="User profile" data-ai-hint="user avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}
