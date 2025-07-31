import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, ArrowLeft, Users, Phone, Mail, Shield, Zap } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Premium = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

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

  // Handle payment success/cancellation from URL params
  useEffect(() => {
    const success = searchParams.get('success');
    const cancelled = searchParams.get('cancelled');
    const sessionId = searchParams.get('session_id');

    if (success === 'true' && sessionId) {
      verifyPayment(sessionId);
    } else if (cancelled === 'true') {
      toast({
        title: "Payment Cancelled",
        description: "Your payment was cancelled. You can try again anytime.",
        variant: "destructive",
      });
      // Clean up URL
      navigate('/premium', { replace: true });
    }
  }, [searchParams, navigate, toast]);

  const verifyPayment = async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { session_id: sessionId }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Payment Successful!",
          description: data.message || "Welcome to Premium! You now have access to all premium features.",
        });
        // Navigate back to dashboard
        setTimeout(() => navigate('/'), 2000);
      } else {
        throw new Error(data.message || "Payment verification failed");
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast({
        title: "Payment Verification Failed",
        description: "There was an error verifying your payment. Please contact support.",
        variant: "destructive",
      });
    } finally {
      // Clean up URL
      navigate('/premium', { replace: true });
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to upgrade to premium",
          variant: "destructive",
        });
        return;
      }

      // Get the session token for the API call
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error("No valid session found");
      }

      // Create Stripe checkout session
      const { data, error } = await supabase.functions.invoke('create-payment', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Redirect to Stripe checkout
        window.open(data.url, '_blank');
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error starting your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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
                  <div className="text-4xl font-bold">$49.99</div>
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
                      Pay with Stripe
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-xs text-purple-100">
                    Secure payment powered by Stripe
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