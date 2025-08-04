import React from 'react';
import { CreditCard, Wifi, Circle } from 'lucide-react';

const CreditCardVisual = ({
  type = 'primary',
  size = 'medium',
  showDetails = true,
  holderName = 'Demo User',
  lastFourDigits = '4242'
}) => {
  const getCardGradient = () => {
    switch (type) {
      case 'primary':
        return 'bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800';
      case 'secondary':
        return 'bg-gradient-to-br from-gray-700 via-gray-800 to-black';
      case 'premium':
        return 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-600';
      default:
        return 'bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-48 h-30';
      case 'medium':
        return 'w-64 h-40';
      case 'large':
        return 'w-80 h-50';
      default:
        return 'w-64 h-40';
    }
  };

  return (
    <div className={`${getSizeClasses()} ${getCardGradient()} rounded-2xl shadow-2xl relative overflow-hidden transform hover:scale-105 transition-transform duration-300`}>
      {/* Card Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-20 h-20 bg-white rounded-full"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full"></div>
      </div>

      {/* Card Content */}
      <div className="relative h-full p-6 flex flex-col justify-between text-white">
        {/* Top Section */}
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-6 bg-gradient-to-r from-yellow-400 to-yellow-200 rounded"></div>
            <Circle className="h-6 w-6 text-gray-200" />
          </div>
          <Wifi className="h-6 w-6 text-gray-200" />
        </div>

        {/* Middle Section - Card Number */}
        {showDetails && (
          <div className="space-y-2">
            <div className="flex space-x-3 text-xl font-mono tracking-wider">
              <span>••••</span>
              <span>••••</span>
              <span>••••</span>
              <span>{lastFourDigits}</span>
            </div>
          </div>
        )}

        {/* Bottom Section */}
        <div className="flex justify-between items-end">
          {showDetails && (
            <div>
              <div className="text-xs text-gray-300 uppercase tracking-wide">Cardholder</div>
              <div className="text-sm font-semibold">{holderName}</div>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <CreditCard className="h-8 w-8" />
            <span className="text-xs font-bold">CREDIT</span>
          </div>
        </div>
      </div>

      {/* Shine Effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transform -skew-x-12 transition-opacity duration-500"></div>
    </div>
  );
};

export default CreditCardVisual; 