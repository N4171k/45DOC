'use client';

import { useState, useEffect } from 'react';
import type { Challenge, ChallengeCompletion } from '@/lib/types';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { BarChart, BrainCircuit, Code, Dumbbell, Star, Shield, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getChallenges } from '@/services/appwrite';
import { differenceInCalendarDays, startOfToday } from 'date-fns';

export default function DashboardPage() {
  const [completions, setCompletions] = useState<Record<string, ChallengeCompletion>>({});
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const savedCompletions = localStorage.getItem('codeStreakCompletions');
    if (savedCompletions) {
      setCompletions(JSON.parse(savedCompletions));
    }

    async function fetchChallenges() {
      try {
        setLoading(true);
        const fetchedChallenges = await getChallenges();
        setChallenges(fetchedChallenges);
      } catch (error) {
        console.error("Failed to load challenges", error);
      } finally {
        setLoading(false);
      }
    }
    fetchChallenges();
  }, []);

  const today = startOfToday();
  const todayChallenge = challenges.find(c => {
    const challengeDate = new Date(c.date);
    return differenceInCalendarDays(today, challengeDate) === 0;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header completions={completions} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Activity Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                 <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  disabled={(d) => d > new Date()}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5 text-red-500" />
                    <span>Hard Questions</span>
                  </div>
                  <span className="font-bold">5</span>
                </div>
                 <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-yellow-500" />
                    <span>Medium Questions</span>
                  </div>
                  <span className="font-bold">12</span>
                </div>
                 <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-green-500" />
                    <span>Easy Questions</span>
                  </div>
                  <span className="font-bold">28</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-blue-500" />
                    <span>Code of Your Choice</span>
                  </div>
                  <span className="font-bold">8</span>
                </div>
              </CardContent>
            </Card>
             {/* <Button asChild variant="outline">
                <Link href="/admin">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Dashboard
                </Link>
             </Button> */}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <Card className="min-h-[400px]">
              <CardHeader>
                <CardTitle className="font-headline text-3xl">Today's Question</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                   <div className="flex justify-center items-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin" />
                   </div>
                ) : todayChallenge ? (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold">{todayChallenge.title}</h3>
                    <p className="text-muted-foreground">{todayChallenge.description}</p>
                    <Button asChild>
                      <Link href={`/day/${todayChallenge.day}/easy`}>
                        Start Challenge
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <p>No challenge for today. Check back tomorrow!</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}