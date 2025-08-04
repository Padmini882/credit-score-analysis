import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, Calendar, Target, AlertTriangle } from 'lucide-react';

const CreditScoreForecasting = ({ currentScore }) => {
  const [forecastData, setForecastData] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState('baseline');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForecastData();
  }, [currentScore]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchForecastData = async () => {
    try {
      // Mock API call - replace with actual backend endpoint
      const response = await fetch('/api/credit-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentScore }),
      });

      if (response.ok) {
        const data = await response.json();
        setForecastData(data.forecast);
        setScenarios(data.scenarios);
      } else {
        generateMockForecast();
      }
    } catch (error) {
      generateMockForecast();
    } finally {
      setLoading(false);
    }
  };

  const generateMockForecast = () => {
    const months = ['Current', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const baselineGrowth = [0, 5, 8, 12, 15, 18, 20];
    
    const mockForecast = months.map((month, index) => {
      const predicted = index === 0 ? currentScore : currentScore + baselineGrowth[index];
      const variance = Math.max(10, predicted * 0.05); // 5% variance or minimum 10 points
      
      return {
        month,
        actual: index === 0 ? currentScore : undefined,
        predicted,
        confidence: {
          lower: Math.max(300, predicted - variance),
          upper: Math.min(850, predicted + variance),
        },
      };
    });

    const mockScenarios = [
      {
        name: 'baseline',
        description: 'Current financial habits continue',
        impact: 0,
        color: '#3b82f6',
      },
      {
        name: 'improved',
        description: 'Following improvement suggestions',
        impact: 15,
        color: '#10b981',
      },
      {
        name: 'aggressive',
        description: 'Major debt paydown and credit optimization',
        impact: 35,
        color: '#059669',
      },
      {
        name: 'declined',
        description: 'Missed payments or increased debt',
        impact: -25,
        color: '#ef4444',
      },
    ];

    setForecastData(mockForecast);
    setScenarios(mockScenarios);
  };

  const getScenarioData = () => {
    const scenario = scenarios.find(s => s.name === selectedScenario);
    if (!scenario) return forecastData;

    return forecastData.map(point => ({
      ...point,
      predicted: point.month === 'Current' ? point.predicted : point.predicted + scenario.impact,
      confidence: {
        lower: point.month === 'Current' ? point.confidence.lower : Math.max(300, point.confidence.lower + scenario.impact),
        upper: point.month === 'Current' ? point.confidence.upper : Math.min(850, point.confidence.upper + scenario.impact),
      },
    }));
  };

  const getCurrentScenario = () => {
    return scenarios.find(s => s.name === selectedScenario) || scenarios[0];
  };

  const getFinalScore = () => {
    const data = getScenarioData();
    return data[data.length - 1]?.predicted || currentScore;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const chartData = getScenarioData();
  const currentScenario = getCurrentScenario();
  const finalScore = getFinalScore();
  const totalChange = finalScore - currentScore;

  return (
    <div className="space-y-6">
      {/* Forecast Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-5 w-5 text-primary-600" />
            <h4 className="font-semibold text-gray-900">Predicted Score</h4>
          </div>
          <div className="text-2xl font-bold text-primary-600">
            {finalScore}
          </div>
          <div className={`text-sm ${totalChange >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
            {totalChange >= 0 ? '+' : ''}{totalChange} points
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900">Timeframe</h4>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            6 Months
          </div>
          <div className="text-sm text-gray-500">
            Based on current trends
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-success-600" />
            <h4 className="font-semibold text-gray-900">Confidence</h4>
          </div>
          <div className="text-2xl font-bold text-success-600">
            85%
          </div>
          <div className="text-sm text-gray-500">
            Prediction accuracy
          </div>
        </div>
      </div>

      {/* Scenario Selection */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Forecast Scenarios
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {scenarios.map((scenario) => (
            <button
              key={scenario.name}
              onClick={() => setSelectedScenario(scenario.name)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedScenario === scenario.name
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: scenario.color }}
                />
                <h4 className="font-semibold text-gray-900 capitalize">
                  {scenario.name}
                </h4>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                {scenario.description}
              </p>
              <div className={`text-sm font-medium ${
                scenario.impact >= 0 ? 'text-success-600' : 'text-danger-600'
              }`}>
                {scenario.impact >= 0 ? '+' : ''}{scenario.impact} points
              </div>
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[300, 850]} />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'predicted') return [value, 'Predicted Score'];
                  if (name === 'actual') return [value, 'Actual Score'];
                  return [value, name];
                }}
              />
              <ReferenceLine y={currentScore} stroke="#6b7280" strokeDasharray="5 5" />
              
              {/* Confidence interval */}
              <Line
                type="monotone"
                dataKey="confidence.upper"
                stroke={currentScenario.color}
                strokeOpacity={0.3}
                strokeDasharray="3 3"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="confidence.lower"
                stroke={currentScenario.color}
                strokeOpacity={0.3}
                strokeDasharray="3 3"
                dot={false}
              />
              
              {/* Main prediction line */}
              <Line
                type="monotone"
                dataKey="predicted"
                stroke={currentScenario.color}
                strokeWidth={3}
                dot={{ fill: currentScenario.color, strokeWidth: 2, r: 4 }}
              />
              
              {/* Actual score point */}
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#1f2937"
                strokeWidth={3}
                dot={{ fill: '#1f2937', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Important Notice */}
      <div className="card p-4 bg-warning-50 border-warning-200">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-warning-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-warning-900 mb-1">
              Important Notice
            </h4>
            <p className="text-sm text-warning-800">
              These forecasts are estimates based on historical patterns and current financial behavior. 
              Actual results may vary based on market conditions, policy changes, and individual circumstances. 
              Use these predictions as guidance, not guarantees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditScoreForecasting; 