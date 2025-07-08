
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Star, Clock, MessageCircle } from 'lucide-react';

interface Counselor {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  experience: string;
  availability: 'available' | 'busy' | 'offline';
  nextSlot: string;
  image: string;
}

const CounselorSection = () => {
  const counselors: Counselor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialization: 'Anxiety & Depression',
      rating: 4.9,
      experience: '8 years',
      availability: 'available',
      nextSlot: 'Available now',
      image: '👩‍⚕️'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialization: 'Stress Management',
      rating: 4.8,
      experience: '12 years',
      availability: 'busy',
      nextSlot: 'Next available: 2:00 PM',
      image: '👨‍⚕️'
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialization: 'Trauma & PTSD',
      rating: 4.9,
      experience: '10 years',
      availability: 'available',
      nextSlot: 'Available in 15 min',
      image: '👩‍⚕️'
    },
    {
      id: '4',
      name: 'Dr. David Thompson',
      specialization: 'Relationship Issues',
      rating: 4.7,
      experience: '6 years',
      availability: 'offline',
      nextSlot: 'Next available: Tomorrow 9:00 AM',
      image: '👨‍⚕️'
    }
  ];

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleContactCounselor = (counselor: Counselor) => {
    console.log(`Contacting ${counselor.name}`);
    // In a real app, this would open a booking modal or redirect to booking page
  };

  return (
    <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-slate-700">
          <Users className="h-6 w-6 text-blue-500" />
          <span>Mental Health Professionals</span>
        </CardTitle>
        <p className="text-slate-500 text-sm">Connect with licensed counselors and therapists</p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {counselors.map((counselor) => (
            <Card key={counselor.id} className="bg-white/70 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{counselor.image}</div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-700">{counselor.name}</h3>
                        <p className="text-sm text-slate-500">{counselor.specialization}</p>
                      </div>
                      <Badge className={getAvailabilityColor(counselor.availability)}>
                        {counselor.availability}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span>{counselor.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{counselor.experience}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-600">{counselor.nextSlot}</p>
                      <Button
                        size="sm"
                        onClick={() => handleContactCounselor(counselor)}
                        disabled={counselor.availability === 'offline'}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white disabled:opacity-50"
                      >
                        <MessageCircle className="mr-1 h-3 w-3" />
                        Contact Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CounselorSection;
