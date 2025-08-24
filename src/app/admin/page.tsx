'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, Shield, Plus } from "lucide-react";
import { getSubmissions, addChallenge } from '@/services/appwrite';
import type { ChallengeCompletion, Challenge } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const challengeFormSchema = z.object({
  day: z.string().transform(val => parseInt(val, 10)).pipe(z.number().min(1, { message: 'Day must be a number greater than 0.' })),
  date: z.string().min(1, { message: 'Date is required.' }),
  title: z.string().min(1, { message: 'Title is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  questions: z.array(z.object({
    difficulty: z.enum(['easy', 'medium', 'hard']),
    title: z.string().min(1, { message: 'Question title is required.' }),
    description: z.string().min(1, { message: 'Question description is required.' }),
    link: z.string().url({ message: 'Must be a valid URL.' }),
  })).min(1, { message: 'At least one question is required.' }),
});

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<ChallengeCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Use userProfile to check for admin status
  const { userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof challengeFormSchema>>({
    resolver: zodResolver(challengeFormSchema),
    defaultValues: {
      day: 0,
      date: new Date().toISOString().split('T')[0],
      title: '',
      description: '',
      questions: [],
    },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    // Check userProfile for the isAdmin flag
    if (!authLoading && (!userProfile || !userProfile.isAdmin)) {
      router.push('/admin/login'); // Redirect unauthorized users
    }
  }, [userProfile, authLoading, router]);

  useEffect(() => {
    async function fetchSubmissions() {
      if (userProfile?.isAdmin) {
        try {
          const fetchedSubmissions = await getSubmissions();
          setSubmissions(fetchedSubmissions);
          setError(null);
        } catch (err) {
          setError("Failed to fetch submissions.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchSubmissions();
  }, [userProfile]);

  const onAddChallengeSubmit = async (values: z.infer<typeof challengeFormSchema>) => {
    try {
      await addChallenge(values as Omit<Challenge, '$id'>);
      toast({
        title: "Challenge Added!",
        description: `Day ${values.day} challenge has been successfully added.`,
      });
      form.reset();
    } catch (err) {
      toast({
        title: "Error adding challenge",
        description: "An error occurred while adding the challenge.",
        variant: "destructive",
      });
      console.error(err);
    }
  };

  if (authLoading || !userProfile?.isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:underline">
          Go to User Dashboard
        </Link>
      </div>

      <Tabs defaultValue="submissions" className="w-full">
        <TabsList>
          <TabsTrigger value="submissions">
            <Shield className="mr-2 h-4 w-4" />
            Review Submissions
          </TabsTrigger>
          <TabsTrigger value="add-challenge">
            <Plus className="mr-2 h-4 w-4" />
            Add Challenge
          </TabsTrigger>
        </TabsList>

        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-center text-destructive">{error}</div>
              ) : submissions.length === 0 ? (
                <p className="text-center text-muted-foreground">No submissions yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Email</TableHead>
                      <TableHead>Challenge</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Submitted At</TableHead>
                      <TableHead>Language</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((sub) => (
                      <TableRow key={sub.$id}>
                        <TableCell>
                          <div className="font-medium">{sub.userEmail}</div>
                        </TableCell>
                        <TableCell>{sub.questionTitle}</TableCell>
                        <TableCell>
                          <Badge variant={
                            sub.difficulty === 'hard' ? 'destructive' : 
                            sub.difficulty === 'medium' ? 'secondary' : 'default'
                          } className="capitalize">{sub.difficulty}</Badge>
                        </TableCell>
                        <TableCell>{new Date(sub.completedAt).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{sub.language}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-challenge">
          <Card>
            <CardHeader>
              <CardTitle>Add a New Challenge</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onAddChallengeSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="day" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Day</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="date" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl><Input type="date" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Challenge Title</FormLabel>
                      <FormControl><Input placeholder="Daily Challenge: Day X" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Challenge Description</FormLabel>
                      <FormControl><Textarea placeholder="Describe the challenges for this day..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <h3 className="font-semibold text-lg mt-8">Questions</h3>
                  {/* Note: This is a simplified form for demonstration. A real implementation would use a component for dynamic question fields. */}
                  <FormField control={form.control} name="questions.0.difficulty" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question 1 Difficulty</FormLabel>
                      <FormControl><Input placeholder="easy, medium, or hard" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="questions.0.title" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question 1 Title</FormLabel>
                      <FormControl><Input placeholder="Two Sum" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="questions.0.description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question 1 Description</FormLabel>
                      <FormControl><Textarea placeholder="Given an array of integers..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="questions.0.link" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question 1 Link</FormLabel>
                      <FormControl><Input placeholder="https://leetcode.com/..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Challenge
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}