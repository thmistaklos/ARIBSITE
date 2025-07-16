import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Milk } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AnimatedButton from '@/components/AnimatedButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, user, loading } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  React.useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { success } = await signIn(values.email, values.password);
    if (success) {
      navigate('/admin');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-dairy-cream px-4"
    >
      <Card className="w-full max-w-md bg-white rounded-xl shadow-lg border-2 border-dairy-blue/20">
        <CardHeader className="text-center pb-6">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            className="flex justify-center mb-4"
          >
            <Milk className="h-12 w-12 text-dairy-darkBlue" />
          </motion.div>
          <CardTitle className="text-3xl font-bold text-dairy-darkBlue">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-dairy-text">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin@example.com"
                        {...field}
                        className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue"
                        type="email"
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
                    <FormLabel className="text-dairy-text">Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        {...field}
                        className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AnimatedButton
                type="submit"
                className="w-full bg-dairy-blue text-white hover:bg-dairy-darkBlue"
                soundOnClick="/sounds/click.mp3"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </AnimatedButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LoginPage;