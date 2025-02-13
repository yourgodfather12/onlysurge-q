import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { Button } from './ui/Button';

export function PublicNavigation() {
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center py-8">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <Zap className="w-8 h-8 text-purple-400" />
          <span className="text-2xl font-bold">OnlySurge</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => navigate('/features')}
            className="text-gray-300 hover:text-white transition-colors"
          >
            Features
          </button>
          <button 
            onClick={() => navigate('/pricing')}
            className="text-gray-300 hover:text-white transition-colors"
          >
            Pricing
          </button>
          <button 
            onClick={() => navigate('/contact')}
            className="text-gray-300 hover:text-white transition-colors"
          >
            Contact
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/signin')}
          className="hidden md:block text-gray-300 hover:text-white transition-colors"
        >
          Sign In
        </button>
        <Button
          variant="primary"
          onClick={() => navigate('/signup')}
        >
          Get Started
        </Button>
      </div>
    </nav>
  );
}