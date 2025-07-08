
import React, { useState } from 'react';
import Header from './Header';
import JournalSection from './JournalSection';
import ChatbotSection from './ChatbotSection';
import CounselorSection from './CounselorSection';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, BookOpen, MessageCircle, Users } from 'lucide-react';

interface DashboardProps {
  onSignOut: () => void;
  userType: 'registered' | 'trial';
}

const Dashboard = ({ onSignOut, userType }: DashboardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100">
      <Header 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        onSignOut={onSignOut}
        isLoggedIn={true}
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-700 mb-2">
            Welcome to Your Wellness Dashboard
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Take a moment for yourself. Your mental health journey is important, and we're here to support you every step of the way.
          </p>
          {userType === 'trial' && (
            <Card className="mt-4 bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200">
              <CardContent className="p-4">
                <p className="text-purple-700 font-medium">
                  🌟 You're using our free trial. Upgrade to access unlimited features and premium counselor sessions.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-400 to-blue-500 text-white border-0">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2" />
              <h3 className="font-semibold">Journal Entries</h3>
              <p className="text-2xl font-bold">
                {JSON.parse(localStorage.getItem('journalEntries') || '[]').length}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-400 to-purple-500 text-white border-0">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-2" />
              <h3 className="font-semibold">AI Conversations</h3>
              <p className="text-2xl font-bold">Always Available</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-400 to-green-500 text-white border-0">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <h3 className="font-semibold">Counselors Online</h3>
              <p className="text-2xl font-bold">4 Available</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Journal Section */}
          <div className="lg:col-span-1">
            <JournalSection />
          </div>
          
          {/* Chatbot Section */}
          <div className="lg:col-span-1">
            <ChatbotSection />
          </div>
          
          {/* Counselor Section */}
          <div className="lg:col-span-1">
            <CounselorSection />
          </div>
        </div>

        {/* Mental Health Tips */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
              <Heart className="mr-2 h-5 w-5 text-purple-500" />
              Daily Wellness Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/70 rounded-lg">
                <span className="text-2xl mb-2 block">🧘‍♀️</span>
                <p className="text-sm text-slate-600">Practice 5 minutes of mindfulness today</p>
              </div>
              <div className="text-center p-4 bg-white/70 rounded-lg">
                <span className="text-2xl mb-2 block">💧</span>
                <p className="text-sm text-slate-600">Stay hydrated throughout the day</p>
              </div>
              <div className="text-center p-4 bg-white/70 rounded-lg">
                <span className="text-2xl mb-2 block">🌱</span>
                <p className="text-sm text-slate-600">Write down three things you're grateful for</p>
              </div>
              <div className="text-center p-4 bg-white/70 rounded-lg">
                <span className="text-2xl mb-2 block">🚶‍♂️</span>
                <p className="text-sm text-slate-600">Take a short walk outside</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
