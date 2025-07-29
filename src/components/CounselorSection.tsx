
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Lock, Crown, Phone, Mail, MapPin, Clock, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Counselor {
  id: string;
  name: string;
  specialization: string;
  contact_email: string;
  contact_phone: string;
  experience_years: number;
  bio: string;
  location: string;
  availability_schedule: string;
}

const CounselorSection = () => {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  useEffect(() => {
    if (isPremium) {
      fetchCounselors();
    }
  }, [isPremium]);

  const checkPremiumStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile) {
        setIsPremium(profile.is_premium || false);
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
    }
    setIsLoading(false);
  };

  const fetchCounselors = async () => {
    try {
      const { data, error } = await supabase
        .from('counselors')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching counselors:', error);
        toast({
          title: "Error",
          description: "Failed to load counselors. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setCounselors(data || []);
    } catch (error) {
      console.error('Error fetching counselors:', error);
    }
  };

  const handleUpgradeToPremium = () => {
    navigate('/premium');
  };

  if (isLoading) {
    return (
      <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </CardContent>
      </Card>
    );
  }

  if (!isPremium) {
    return (
      <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-slate-700">
            <Lock className="h-6 w-6 text-purple-500" />
            <span>Professional Counselors</span>
          </CardTitle>
          <p className="text-slate-500 text-sm">Connect with certified mental health professionals</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <Crown className="h-16 w-16 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Premium Feature</h3>
            <p className="text-slate-600 mb-6">
              Upgrade to premium to access our network of professional counselors with their contact information and availability.
            </p>
            <div className="space-y-2 text-sm text-slate-600 mb-6">
              <p>✓ Access to 5+ certified counselors</p>
              <p>✓ Direct contact information</p>
              <p>✓ Specialization details</p>
              <p>✓ Availability schedules</p>
            </div>
            <Button 
              onClick={handleUpgradeToPremium}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-slate-700">
          <Users className="h-6 w-6 text-green-500" />
          <span>Professional Counselors</span>
          <Badge className="bg-green-100 text-green-700">Premium</Badge>
        </CardTitle>
        <p className="text-slate-500 text-sm">Available certified mental health professionals</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {counselors.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-slate-600">Loading counselors...</p>
            </div>
          ) : (
            counselors.map((counselor) => (
              <Card key={counselor.id} className="bg-white/70 border border-slate-100 shadow-sm">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-slate-700 flex items-center space-x-2">
                          <span>{counselor.name}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-slate-600">{counselor.experience_years}+ years</span>
                          </div>
                        </h4>
                        <p className="text-sm text-purple-600 font-medium">{counselor.specialization}</p>
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-600 line-clamp-2">{counselor.bio}</p>
                    
                    <div className="grid grid-cols-1 gap-1 text-xs text-slate-600">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-3 w-3 text-blue-500" />
                        <span className="truncate">{counselor.contact_email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-3 w-3 text-green-500" />
                        <span>{counselor.contact_phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3 text-red-500" />
                        <span className="truncate">{counselor.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3 text-purple-500" />
                        <span className="truncate">{counselor.availability_schedule}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
                        onClick={() => window.open(`tel:${counselor.contact_phone}`)}
                      >
                        <Phone className="mr-1 h-3 w-3" />
                        Call
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => window.open(`mailto:${counselor.contact_email}`)}
                      >
                        <Mail className="mr-1 h-3 w-3" />
                        Email
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CounselorSection;
