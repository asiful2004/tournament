import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Navigation } from '@/components/ui/navigation';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  acceptedTerms: z.boolean().refine(val => val === true, 'You must accept the Terms & Conditions'),
  acceptedPrivacy: z.boolean().refine(val => val === true, 'You must accept the Privacy Policy'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      dateOfBirth: '',
      acceptedTerms: false,
      acceptedPrivacy: false,
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Registration successful',
        description: `Welcome to SkillsMoney, ${data.user.name}!`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setLocation('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: 'Registration failed',
        description: error.message || 'Failed to create account',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black">
      <Navigation />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-md bg-gray-900/90 border-purple-500/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">
            Create Account
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Join SkillsMoney tournament platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        data-testid="input-name"
                        placeholder="Enter your full name"
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        data-testid="input-email"
                        type="email"
                        placeholder="Enter your email"
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      />
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
                    <FormLabel className="text-gray-200">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        data-testid="input-password"
                        type="password"
                        placeholder="Create a password"
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        data-testid="input-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Date of Birth</FormLabel>
                    <p className="text-sm text-orange-400 mb-2">
                      ⚠️ Minimum age 15+ years required to participate
                    </p>
                    <FormControl>
                      <Input
                        {...field}
                        data-testid="input-date-of-birth"
                        type="date"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acceptedTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        data-testid="checkbox-terms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-gray-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-gray-200 text-sm">
                        I accept the{' '}
                        <a href="/terms" className="text-purple-400 hover:text-purple-300 underline">
                          Terms & Conditions
                        </a>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acceptedPrivacy"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        data-testid="checkbox-privacy"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-gray-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-gray-200 text-sm">
                        I accept the{' '}
                        <a href="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                          Privacy Policy
                        </a>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button
                data-testid="button-register"
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <div className="text-gray-400 text-sm">
              Already have an account?{' '}
              <button
                data-testid="link-login"
                onClick={() => setLocation('/login')}
                className="text-purple-400 hover:text-purple-300 underline"
              >
                Sign in
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}