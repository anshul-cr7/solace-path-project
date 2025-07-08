
import React from 'react';
import { Heart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  onSignOut?: () => void;
  isLoggedIn?: boolean;
}

const Header = ({ isMenuOpen, setIsMenuOpen, onSignOut, isLoggedIn }: HeaderProps) => {
  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-purple-500" />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Serenity
          </span>
        </div>
        
        {isLoggedIn && (
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={onSignOut}
              className="text-slate-600 hover:text-purple-600"
            >
              Sign Out
            </Button>
          </div>
        )}
        
        <button
          className="md:hidden p-2 rounded-lg hover:bg-blue-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
    </header>
  );
};

export default Header;
