'use client';

import { useState, useEffect, useTransition } from 'react';
import type { ChallengeCompletion, Question } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Github, Sparkles, Loader2, CircleCheck, Star } from 'lucide-react';
import Link from 'next/link';
import { saveSubmission } from '@/services/appwrite';
import { useAuth } from '@/hooks/useAuth';

const formSchema = z.object({
  code: z.string().min(10, { message: "Code must be at least 10 characters." }),
  language: z.string({ required_error: "Please select a language." }),
  githubLink: z.string().url().optional().or(z.literal('')),
});

const languages = ["JavaScript", "Python", "TypeScript", "Java", "Go", "Rust", "C++", "C#"];

interface ChallengeSubmissionProps {
  challengeId: string;
  question: Question;
}

export function ChallengeSubmission({ challengeId, question }: ChallengeSubmissionProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [completion, setCompletion] = useState<ChallengeCompletion | null>(null);
  const { user } = useAuth();
  const completionKey = `${challengeId}-${question.difficulty}`;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      language: undefined,
      githubLink: "",
    },
  });

  useEffect(() => {
    const savedCompletions = localStorage.getItem('codeStreakCompletions');
    if (savedCompletions) {
      const completions = JSON.parse(savedCompletions);
      if (completions[completionKey]) {
        const saved: ChallengeCompletion = completions[completionKey];
        setCompletion(saved);
        form.reset({
          code: saved.code,
          language: saved.language,
          githubLink: saved.githubLink,
        });
      } else {
        setCompletion(null);
        form.reset({ code: "", language: undefined, githubLink: "" });
      }
    } else {
       setCompletion(null);
       form.reset({ code: "", language: undefined, githubLink: "" });
    }
  }, [completionKey, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user?.email) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit a solution.",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      const newCompletion: Omit<ChallengeCompletion, '$id'> = {
        userEmail: user.email,
        challengeId: challengeId,
        questionTitle: question.title,
        difficulty: question.difficulty,
        completedAt: new Date().toISOString(),
        ...values,
      };
      
      try {
        await saveSubmission(newCompletion);
        
        const completionForState: ChallengeCompletion = { ...newCompletion, $id: Date.now().toString() };
        setCompletion(completionForState);
        
        const savedCompletions = JSON.parse(localStorage.getItem('codeStreakCompletions') || '{}');
        savedCompletions[completionKey] = completionForState;
        localStorage.setItem('codeStreakCompletions', JSON.stringify(savedCompletions));

        toast({
          title: "Challenge Completed!",
          description: "Your solution has been saved.",
        });
      } catch (error) {
         toast({
          title: "Submission Failed",
          description: "There was an error saving your solution.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div>
      {completion ? (
        <Card className="bg-gradient-to-br from-card to-secondary">
           <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="font-headline flex items-center gap-2 text-2xl">
                <CircleCheck className="text-green-500" />
                Solution Submitted!
              </CardTitle>
            </div>
            <CardDescription>
              Your submission for '{completion.questionTitle}' has been saved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="font-code bg-muted p-4 rounded-md overflow-x-auto text-sm mb-6">{completion.code}</pre>
            <Button onClick={() => setCompletion(null)} className="w-full mt-6">
              Submit a New Solution
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Submit Your Solution</CardTitle>
            <CardDescription>Paste your code and select the language.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Solution</FormLabel>
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
                <div className="flex items-center gap-4">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/day/${challengeId}/custom`}>
                      <Star className="mr-2 h-4 w-4" />
                      Code of my choice
                    </Link>
                  </Button>
                  <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Submit
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}