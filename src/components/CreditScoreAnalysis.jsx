import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, TrendingUp, Lightbulb, Target } from 'lucide-react';

const CreditScoreAnalysis = ({ data }) => {
  const [factors, setFactors] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyzeCreditScore();
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const analyzeCreditScore = async () => {
    try {
      // Mock API call - replace with actual backend endpoint
      const response = await fetch('/api/credit-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const analysisData = await response.json();
        setFactors(analysisData.factors);
        setSuggestions(analysisData.suggestions);
      } else {
        generateMockAnalysis();
      }
    } catch (error) {
      generateMockAnalysis();
    } finally {
      setLoading(false);
    }
  };

  const generateMockAnalysis = () => {
    const mockFactors = [
      {
        name: 'Payment History',
        impact: data.paymentHistory >= 95 ? 'positive' : data.paymentHistory >= 85 ? 'neutral' : 'negative',
        weight: 35,
        description: 'Your track record of making payments on time',
        currentValue: `${data.paymentHistory}%`,
        idealValue: '100%',
      },
      {
        name: 'Credit Utilization',
        impact: data.creditUtilization <= 10 ? 'positive' : data.creditUtilization <= 30 ? 'neutral' : 'negative',
        weight: 30,
        description: 'Percentage of available credit you\'re using',
        currentValue: `${data.creditUtilization}%`,
        idealValue: '< 10%',
      },
      {
        name: 'Credit Age',
        impact: data.creditAge >= 10 ? 'positive' : data.creditAge >= 5 ? 'neutral' : 'negative',
        weight: 15,
        description: 'Average age of your credit accounts',
        currentValue: `${data.creditAge} years`,
        idealValue: '> 10 years',
      },
      {
        name: 'Credit Mix',
        impact: data.creditMix >= 80 ? 'positive' : data.creditMix >= 60 ? 'neutral' : 'negative',
        weight: 10,
        description: 'Variety of credit types you manage',
        currentValue: `${data.creditMix}%`,
        idealValue: '> 80%',
      },
      {
        name: 'Debt-to-Income',
        impact: data.debtToIncomeRatio <= 20 ? 'positive' : data.debtToIncomeRatio <= 35 ? 'neutral' : 'negative',
        weight: 10,
        description: 'Monthly debt payments relative to income',
        currentValue: `${data.debtToIncomeRatio}%`,
        idealValue: '< 20%',
      },
    ];

    const mockSuggestions = [];

    // Generate suggestions based on data
    if (data.creditUtilization > 30) {
      mockSuggestions.push({
        title: 'Reduce Credit Utilization',
        description: 'Pay down existing balances or request credit limit increases to lower your utilization ratio.',
        impact: 'high',
        timeframe: '1-2 months',
        actionable: true,
      });
    }

    if (data.paymentHistory < 95) {
      mockSuggestions.push({
        title: 'Improve Payment History',
        description: 'Set up automatic payments to ensure all bills are paid on time every month.',
        impact: 'high',
        timeframe: '3-6 months',
        actionable: true,
      });
    }

    if (data.debtToIncomeRatio > 35) {
      mockSuggestions.push({
        title: 'Lower Debt-to-Income Ratio',
        description: 'Focus on paying down high-interest debt or consider debt consolidation options.',
        impact: 'medium',
        timeframe: '6-12 months',
        actionable: true,
      });
    }

    if (data.creditMix < 70) {
      mockSuggestions.push({
        title: 'Diversify Credit Mix',
        description: 'Consider adding different types of credit accounts (installment loans, credit cards) responsibly.',
        impact: 'low',
        timeframe: '3-6 months',
        actionable: true,
      });
    }

    // Always include some general suggestions
    mockSuggestions.push({
      title: 'Monitor Credit Reports',
      description: 'Check all three credit reports regularly for errors and dispute any inaccuracies you find.',
      impact: 'medium',
      timeframe: 'Ongoing',
      actionable: true,
    });

    setFactors(mockFactors);
    setSuggestions(mockSuggestions);
  };

  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'positive':
        return <CheckCircle className="h-5 w-5 text-success-600" />;
      case 'negative':
        return <XCircle className="h-5 w-5 text-danger-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-warning-600" />;
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'positive':
        return 'bg-success-50 border-success-200';
      case 'negative':
        return 'bg-danger-50 border-danger-200';
      default:
        return 'bg-warning-50 border-warning-200';
    }
  };

  const getSuggestionImpactColor = (impact) => {
    switch (impact) {
      case 'high':
        return 'bg-danger-100 text-danger-800';
      case 'medium':
        return 'bg-warning-100 text-warning-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Credit Score Factors */}
      <div className="card p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Target className="h-6 w-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Credit Score Factors
          </h3>
        </div>
        
        <div className="space-y-4">
          {factors.map((factor, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg ${getImpactColor(factor.impact)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getImpactIcon(factor.impact)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{factor.name}</h4>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        {factor.weight}% weight
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{factor.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span>
                        <strong>Current:</strong> {factor.currentValue}
                      </span>
                      <span>
                        <strong>Ideal:</strong> {factor.idealValue}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Improvement Suggestions */}
      <div className="card p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Lightbulb className="h-6 w-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Improvement Suggestions
          </h3>
        </div>
        
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getSuggestionImpactColor(suggestion.impact)}`}>
                    {suggestion.impact.toUpperCase()} IMPACT
                  </span>
                  <TrendingUp className="h-4 w-4 text-success-600" />
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  <strong>Timeline:</strong> {suggestion.timeframe}
                </span>
                {suggestion.actionable && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Actionable
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreditScoreAnalysis; 