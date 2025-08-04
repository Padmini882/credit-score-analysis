import React from 'react';
import { TrendingUp, TrendingDown, Star, Award } from 'lucide-react';
import CreditCardVisual from './CreditCardVisual';

const CreditScoreCard = ({ 
  score, 
  previousScore = score - 12 
}) => {
  const getScoreColor = (score) => {
    if (score >= 750) return 'text-success-600';
    if (score >= 700) return 'text-warning-600';
    return 'text-danger-600';
  };

  const getScoreRing = (score) => {
    if (score >= 750) return 'stroke-success-600';
    if (score >= 700) return 'stroke-warning-600';
    return 'stroke-danger-600';
  };

  const getScoreRange = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    return 'Poor';
  };

  const getScoreIcon = (score) => {
    if (score >= 750) return Award;
    if (score >= 700) return Star;
    return TrendingUp;
  };

  const percentage = (score / 850) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const scoreDifference = score - previousScore;
  const isPositive = scoreDifference > 0;
  const ScoreIcon = getScoreIcon(score);

  return (
    <div className="relative">
      {/* Background Credit Card */}
      <div className="absolute inset-0 transform rotate-3 opacity-20">
        <CreditCardVisual 
          type={score >= 750 ? 'premium' : score >= 700 ? 'primary' : 'secondary'}
          size="large"
          showDetails={false}
        />
      </div>
      
      {/* Main Card Content */}
      <div className="card p-8 relative z-10 bg-white/95 backdrop-blur-sm border-2 border-gray-100">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <ScoreIcon className={`h-6 w-6 ${getScoreColor(score)}`} />
            <h3 className="text-xl font-bold text-gray-900">
              Credit Score
            </h3>
          </div>
          
          <div className="relative w-40 h-40 mx-auto mb-6">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-gray-200"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={`transition-all duration-2000 ease-out ${getScoreRing(score)}`}
                strokeLinecap="round"
              />
              {/* Inner glow circle */}
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className={`${getScoreRing(score)} opacity-20`}
              />
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(score)} mb-1`}>
                  {score}
                </div>
                <div className="text-xs text-gray-500 font-medium">out of 850</div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
              score >= 750 ? 'bg-success-100 text-success-800' : 
              score >= 700 ? 'bg-warning-100 text-warning-800' : 
              'bg-danger-100 text-danger-800'
            }`}>
              <ScoreIcon className="h-4 w-4" />
              <span className="font-semibold">{getScoreRange(score)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-3 p-4 bg-gray-50 rounded-xl">
            {isPositive ? (
              <TrendingUp className="h-5 w-5 text-success-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-danger-600" />
            )}
            <div className="text-center">
              <span className={`text-lg font-bold ${
                isPositive ? 'text-success-600' : 'text-danger-600'
              }`}>
                {isPositive ? '+' : ''}{scoreDifference} points
              </span>
              <div className="text-sm text-gray-500">vs last month</div>
            </div>
          </div>
          
          {/* Credit Utilization Visual */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <div className="text-sm font-medium text-gray-700 mb-2">Credit Health</div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Poor</span>
              <span>Fair</span>
              <span>Good</span>
              <span>Excellent</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  score >= 750 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                  score >= 700 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                  'bg-gradient-to-r from-red-400 to-red-600'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditScoreCard; 