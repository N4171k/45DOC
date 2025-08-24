'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ExternalLink, Loader2 } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChallengeSubmission } from '@/components/challenge-submission';
import { notFound, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getChallenges } from '@/services/appwrite';
import type { Challenge, Question } from '@/lib/types';

export default function ChallengePage() {
  const params = useParams<{ day: string; difficulty: 'easy' | 'medium' | 'hard' }>();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChallengeData() {
      try {
        setLoading(true);
        const allChallenges = await getChallenges();
        const dayNumber = parseInt(params.day, 10);
        const currentChallenge = allChallenges.find((c) => c.day === dayNumber);

        if (currentChallenge) {
          const currentQuestion = currentChallenge.questions.find(q => q.difficulty === params.difficulty);
          if (currentQuestion) {
            setChallenge(currentChallenge);
            setQuestion(currentQuestion);
          } else {
            notFound();
          }
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Failed to fetch challenge data", error);
        notFound();
      } finally {
        setLoading(false);
      }
    }
    fetchChallengeData();
  }, [params.day, params.difficulty]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!challenge || !question) {
    notFound();
  }

  const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
  const currentDifficultyIndex = difficulties.indexOf(params.difficulty);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <Button asChild variant="ghost">
          <Link href="/dashboard">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
               <CardTitle className="font-headline text-3xl">Day {challenge.day}</CardTitle>
               <div className="flex items-center gap-2">
                {currentDifficultyIndex > 0 && (
                  <Link href={`/day/${challenge.day}/${difficulties[currentDifficultyIndex - 1]}`} className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Link>
                )}
                <span className="capitalize text-lg font-medium w-24 text-center">{question.difficulty}</span>
                {currentDifficultyIndex < difficulties.length - 1 && (
                  <Link href={`/day/${challenge.day}/${difficulties[currentDifficultyIndex + 1]}`} className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
               </div>
            </div>
            <CardDescription className="text-xl pt-2 font-semibold">{question.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">{question.description}</p>
            <Button asChild>
              <a href={question.link} target="_blank" rel="noopener noreferrer">
                View on {new URL(question.link).hostname.replace('www.','')}
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        <ChallengeSubmission challengeId={challenge.$id!} question={question} />
      </div>
    </div>
  );
}