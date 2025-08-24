'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/hooks/useAuth';
import { Loader2, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://placehold.co/100x100.png" alt="User profile" data-ai-hint="user avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="font-headline text-2xl">Edit Profile</CardTitle>
          <CardDescription>Update your account information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Your Name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="email@example.com" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="github">GitHub Repository</Label>
              <Input id="github" defaultValue="https://github.com/user/repo" />
            </div>
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
          <div className="mt-4">
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}