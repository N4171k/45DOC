import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import type { Challenge } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ChallengeCardProps {
  challenge: Challenge;
  isCompleted: boolean;
}

export function ChallengeCard({ challenge, isCompleted }: ChallengeCardProps) {
  return (
    <Link href={`/challenge/${challenge.day}`} className="block group">
      <Card className={cn(
        "h-full flex flex-col transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:border-primary/50",
        isCompleted ? "bg-green-500/10 border-green-500/30" : "bg-card"
      )}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <Badge variant={isCompleted ? "default" : "secondary"} className={cn(
              isCompleted && "bg-green-500/80 border-green-700 text-primary-foreground"
            )}>
              Day {challenge.day}
            </Badge>
            {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
          </div>
          <CardTitle className="font-headline pt-2">{challenge.title}</CardTitle>
          <CardDescription className="line-clamp-2 h-[40px]">{challenge.description}</CardDescription>
        </CardHeader>
        <CardFooter className="mt-auto">
          <div className="flex justify-end w-full items-center">
             <span className="text-sm text-primary group-hover:underline">
              {isCompleted ? 'View Solution' : 'Start Challenge'}
             </span>
             <ArrowRight className="h-4 w-4 ml-1 text-primary transition-transform group-hover:translate-x-1" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
