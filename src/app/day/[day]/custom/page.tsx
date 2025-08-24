'use client';

import { useState, useTransition } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import type { ChallengeCompletion } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Github, Sparkles, Loader2, CircleCheck, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const formSchema = z.object({
  problem: z.string().min(10, { message: "Problem description must be at least 10 characters." }),
  code: z.string().min(10, { message: "Code must be at least 10 characters." }),
  language: z.string({ required_error: "Please select a language." }),
  githubLink: z.string().url().optional().or(z.literal('')),
});

const languages = ["JavaScript", "Python", "TypeScript", "Java", "Go", "Rust", "C++", "C#"];

export default function CustomChallengePage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const params = useParams();
  const day = params.day as string;
  const [completion, setCompletion] = useState<ChallengeCompletion | null>(null);
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      problem: "",
      code: "",
      language: undefined,
      githubLink: "",
    },
  });
  
  const completionKey = `day-${day}-custom`;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user?.email) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit a solution.",
        variant: "destructive",
      });
      return;
    }

    startTransition(() => {
        const newCompletion: ChallengeCompletion = {
          userEmail: user.email,
          challengeId: `day-${day}-custom`,
          questionTitle: values.problem.substring(0, 50) + '...', // Truncate problem for title
          difficulty: 'easy', // Custom challenges don't have a fixed difficulty
          completedAt: new Date().toISOString(),
          ...values,
        };
        setCompletion(newCompletion);
        
        const savedCompletions = JSON.parse(localStorage.getItem('codeStreakCompletions') || '{}');
        savedCompletions[completionKey] = newCompletion;
        localStorage.setItem('codeStreakCompletions', JSON.stringify(savedCompletions));

        toast({
          title: "Challenge Completed!",
          description: "Your solution has been saved.",
        });
    });
  };

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

       {completion ? (
        <Card className="bg-gradient-to-br from-card to-secondary max-w-2xl mx-auto">
           <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="font-headline flex items-center gap-2 text-2xl">
                <CircleCheck className="text-green-500" />
                Solution Submitted!
              </CardTitle>
            </div>
            <CardDescription>
              Your submission for 'Code of Your Choice' has been saved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="font-semibold">Problem</h3>
              <p className="text-sm text-muted-foreground p-4 bg-muted rounded-md">{completion.questionTitle}</p>
            </div>
            <div className="space-y-4 mt-4">
              <h3 className="font-semibold">Your Solution</h3>
              <pre className="font-code bg-muted p-4 rounded-md overflow-x-auto text-sm">{completion.code}</pre>
            </div>
            <Button onClick={() => setCompletion(null)} className="w-full mt-6">
              Submit a New Solution
            </Button>
          </CardContent>
        </Card>
      ) : (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Day {day}: Code of Your Choice</CardTitle>
          <CardDescription>Define your own problem and submit your solution.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                  control={form.control}
                  name="problem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Problem Question</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the problem you are solving..." {...field} className="min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Code</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Your code here..." {...field} className="font-code min-h-[200px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languages.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <FormField
                  control={form.control}
                  name="githubLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub Link (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="https://github.com/..." {...field} className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Submit Solution
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      )}
    </div>
  );
}