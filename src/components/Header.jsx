import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, LogOut, User, Shield, Star } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();

  const getScoreRating = (score) => {
    if (!score) return null;
    if (score >= 800) return 'Excellent';
    if (score >= 740) return 'Very Good';
    if (score >= 670) return 'Good';
    if (score >= 580) return 'Fair';
    return 'Poor';
  };

  const scoreRating = getScoreRating(user?.creditScore);

  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-800 shadow-xl border-b border-blue-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            {/* Logo with credit card visual */}
            <div className="relative">
              <div className="h-12 w-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg transform rotate-3">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full flex items-center justify-center">
                <Shield className="h-2 w-2 text-white" />
              </div>
            </div>
            
            <div className="text-white">
              <h1 className="text-2xl font-bold tracking-tight">
                Credit Score Dashboard
              </h1>
              <p className="text-blue-200 text-sm">Your Financial Health Command Center</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Credit Score Quick Preview */}
            <div className="hidden md:block bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <div className="text-white">
                <div className="text-sm font-semibold">{user?.creditScore || '...'}</div>
                  <div className="text-xs text-blue-200">
                    {scoreRating ? `${scoreRating} Score` : ''}
                  </div>
                </div>
              </div>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
              <div className="h-10 w-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="text-white">
                <div className="text-sm font-semibold">
                  {user?.name}
                </div>
                <div className="text-xs text-blue-200">Premium Member</div>
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl transition-all duration-200 border border-white/20 hover:border-white/30"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>
    </header>
  );
};

export default Header; 