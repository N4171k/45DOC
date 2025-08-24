'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { createAccount } from '@/services/appwrite';
import { useAuth } from '@/hooks/useAuth';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  enroll: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  phone: z.string().optional(),
  batch: z.string().optional(),
  course: z.string().optional(),
  section: z.string().optional(),
  githubRepo: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
});

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { checkUserSession } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      course: '',
      githubRepo: '',
      enroll: '',
      batch: '',
      section: '',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await createAccount(values);
      if (error) {
        throw error;
      }
      await checkUserSession(); // Update auth context
      toast({
        title: 'Account Created!',
        description: 'Welcome to 45 Days of Code.',
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Signup Failed',
        description: error.message || 'Could not create your account.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-4xl">
        <CardContent className="p-0 flex">
          <div className="w-full md:w-1/2 p-8">
            <h2 className="font-bold text-2xl mb-2 font-headline">Create an Account</h2>
            <p className="text-muted-foreground mb-6">Enter your details to get started.</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Your Name" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="enroll" render={({ field }) => (
                    <FormItem><FormLabel>Enroll No.</FormLabel><FormControl><Input placeholder="Enrollment No." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="********" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="+91 1234567890" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="batch" render={({ field }) => (
                     <FormItem><FormLabel>Batch</FormLabel><FormControl><Input placeholder="e.g. B-1" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="course" render={({ field }) => (
                     <FormItem><FormLabel>Course</FormLabel><FormControl><Input placeholder="e.g. B.Tech" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="section" render={({ field }) => (
                     <FormItem><FormLabel>Section</FormLabel><FormControl><Input placeholder="e.g. A" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                 <FormField control={form.control} name="githubRepo" render={({ field }) => (
                    <FormItem><FormLabel>GitHub Repo Link</FormLabel><FormControl><Input placeholder="https://github.com/user/repo" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit
                </Button>
              </form>
            </Form>
          </div>
          <div className="hidden md:flex w-1/2 bg-muted items-center justify-center p-8 rounded-r-lg">
            <h1 className="text-4xl font-bold text-center font-headline">
              welcome <br /> to 45 Days <br /> of Code
            </h1>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}