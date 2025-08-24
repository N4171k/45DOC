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
import { Loader2, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getUserProfile } from '@/services/appwrite';
import { account } from '@/lib/appwrite';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export default function AdminLoginPage() {
  const { login, logout } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Clear any existing session first
      try {
        await logout();
      } catch (error) {
        // Ignore errors if no session exists
        console.log('No existing session to clear');
      }

      // Small delay to ensure session is cleared
      await new Promise(resolve => setTimeout(resolve, 100));

      // Now attempt login
      await login(values.email, values.password);

      // After successful login, check admin status
      const currentUser = await account.get();
      const userProfile = await getUserProfile(currentUser.$id);

      if (!userProfile?.isAdmin) {
        toast({
          title: 'Access Denied',
          description: 'Administrator privileges required.',
          variant: 'destructive',
        });
        
        // Ensure complete logout
        await logout();
        return;
      }
      
      toast({
        title: 'Login Successful!',
        description: 'Welcome, administrator.',
      });
      router.push('/admin');
      
    } catch (error: any) {
      // Ensure any partial session is cleared on error
      try {
        await logout();
      } catch (logoutError) {
        // Ignore logout errors
      }
      
      toast({
        title: 'Login Failed',
        description: error?.message || 'Please check your credentials and admin status.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm">
        <CardContent className="p-0 flex">
          <div className="w-full p-8">
            <h2 className="font-bold text-2xl mb-6 text-center font-headline">Admin Login</h2>
             <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pass</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Continue
                </Button>
                 <div className="text-center text-sm">
                  <Link href="/login" className="underline text-muted-foreground">
                    user login
                  </Link>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}