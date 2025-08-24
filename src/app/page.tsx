import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Code2 } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
           <div className="flex justify-center mb-4">
            <Code2 className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">
            Welcome to 45 Days of Code
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Commit to your coding journey, build a daily habit, and watch your skills grow.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Fix: Wrap the Button component within the Link component */}
          <Link href="/login" className="w-full">
            <Button className="w-full">
              Get Started
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}