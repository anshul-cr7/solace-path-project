
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Mail, User, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LoginSignupProps {
  onTryFree: () => void;
}

const LoginSignup = ({ onTryFree }: LoginSignupProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    password: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Sign in existing user
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in."
        });
      } else {
        // Sign up new user
        const redirectUrl = `${window.location.origin}/`;
        
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              name: formData.name,
              contact: formData.contact
            }
          }
        });

        if (error) throw error;

        toast({
          title: "Account created!",
          description: "Welcome to Serenity. Your journey begins now."
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-12 w-12 text-purple-500" />
            <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Serenity
            </span>
          </div>
          <p className="text-slate-600 text-lg">Your journey to mental wellness starts here</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-slate-700">
              {isLogin ? 'Welcome Back' : 'Join Serenity'}
            </CardTitle>
            <CardDescription className="text-slate-500">
              {isLogin ? 'Sign in to continue your wellness journey' : 'Create your account to get started'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 border-slate-200 focus:border-purple-400 focus:ring-purple-400"
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 border-slate-200 focus:border-purple-400 focus:ring-purple-400"
                  required
                />
              </div>

              {!isLogin && (
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    type="tel"
                    name="contact"
                    placeholder="Contact Number"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="pl-10 border-slate-200 focus:border-purple-400 focus:ring-purple-400"
                    required={!isLogin}
                  />
                </div>
              )}

              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="border-slate-200 focus:border-purple-400 focus:ring-purple-400"
                required
              />

              <div className="flex space-x-3">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-6 disabled:opacity-50"
                >
                  {isLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={onTryFree}
                  className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50 font-medium py-6"
                >
                  Try for Free
                </Button>
              </div>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginSignup;
