"use client";

import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form";
import { Mail, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function Home() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    localStorage.setItem('quizWhizEmail', values.email);
    router.push('/quiz');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-accent/10 -z-10"></div>
      <Sparkles className="absolute top-1/4 left-1/4 w-32 h-32 text-primary/30 animate-pulse" />
      <Sparkles className="absolute bottom-1/4 right-1/4 w-32 h-32 text-accent/30 animate-pulse delay-500" />
      
      <Card className="w-full max-w-md shadow-2xl backdrop-blur-sm bg-card/80">
        <CardHeader className="text-center">
            <h1 className="text-5xl font-bold text-primary font-headline">
            QuizBabu
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
            Aaooo! Aap ki Knowledge Dekhi jaaye :)
            </p>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="sr-only">Email</FormLabel>
                    <FormControl>
                        <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            placeholder="Enter your email to start" 
                            className="pl-10 h-12 text-base"
                            {...field} 
                        />
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                  <Button
               type="submit"
                className="w-full h-12 text-lg bg-accent text-accent-foreground hover:bg-green-500 transition-colors duration-200"
                 >
                         Start Quiz
                      </Button>

            </form>
            </Form>
        </CardContent>
      </Card>
    </main>
  );
}
