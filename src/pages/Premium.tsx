import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, ArrowLeft, Users, Phone, Mail, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Premium = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: <Users className="h-5 w-5 text-purple-500" />,
      title: "Access to Professional Counselors",
      description: "Connect with 5+ certified mental health professionals"
    },
    {
      icon: <Phone className="h-5 w-5 text-green-500" />,
      title: "Direct Contact Information", 
      description: "Get phone numbers and email addresses for immediate contact"
    },
    {
      icon: <Mail className="h-5 w-5 text-blue-500" />,
      title: "Detailed Professional Profiles",
      description: "View specializations, experience, and availability schedules"
    },
    {
      icon: <Shield className="h-5 w-5 text-red-500" />,
      title: "Verified Credentials",
      description: "All counselors are licensed and verified professionals"
    },
    {
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      title: "Priority Support",
      description: "Get priority access to new features and support"
    }
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // For demo purposes, we'll simulate a successful payment
      // In a real app, this would integrate with Razorpay or Stripe
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to purchase premium access.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update user's premium status
      const { error } = await supabase
        .from('profiles')
        .update({ is_premium: true })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating premium status:', error);
        toast({
          title: "Payment Error",
          description: "Failed to process payment. Please try again.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }

      toast({
        title: "Payment Successful!",
        description: "Welcome to Premium! You now have access to all counselor information.",
      });

      // Redirect back to dashboard
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Upgrade to Premium</h1>
            <p className="text-slate-600">Unlock access to professional mental health counselors</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Features List */}
          <div className="md:col-span-2 space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="h-6 w-6 text-purple-500" />
                  <span>Premium Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-700 mb-1">{feature.title}</h3>
                      <p className="text-sm text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sample Counselor Preview */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>What You'll Get Access To</CardTitle>
                <p className="text-sm text-slate-600">Preview of counselor information available with premium</p>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-700">Dr. Sarah Johnson</h4>
                    <Badge className="bg-green-100 text-green-700">8+ years</Badge>
                  </div>
                  <p className="text-sm text-purple-600 font-medium mb-2">Anxiety & Depression Specialist</p>
                  <p className="text-xs text-slate-600 mb-3">Specializing in cognitive behavioral therapy with focus on anxiety disorders...</p>
                  
                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-3 w-3 text-blue-500" />
                      <span>sarah.johnson@therapy.com</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-3 w-3 text-green-500" />
                      <span>+1-555-0123</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Card */}
          <div className="md:col-span-1">
            <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-500 to-pink-500 text-white sticky top-4">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  <Crown className="h-12 w-12 text-yellow-300" />
                </div>
                <CardTitle className="text-2xl">Premium Access</CardTitle>
                <p className="text-purple-100">One-time payment</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold">₹999</div>
                  <p className="text-purple-100">Lifetime Access</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-300" />
                    <span className="text-sm">Access to all counselors</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-300" />
                    <span className="text-sm">Direct contact information</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-300" />
                    <span className="text-sm">Detailed profiles & schedules</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-300" />
                    <span className="text-sm">Priority support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-300" />
                    <span className="text-sm">Lifetime updates</span>
                  </div>
                </div>

                <Button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-white text-purple-600 hover:bg-purple-50 font-semibold py-3"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <>
                      <Crown className="mr-2 h-4 w-4" />
                      Pay with Razorpay
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-xs text-purple-100">
                    Secure payment powered by Razorpay
                  </p>
                  <p className="text-xs text-purple-100 mt-1">
                    30-day money-back guarantee
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;