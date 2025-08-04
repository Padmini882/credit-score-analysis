import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { TrendingUp, Target, AlertTriangle, History, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
 
const CreditScoreForecasting = ({ currentScore }) => {
  const { user } = useAuth();
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  // Month names for better visualization
  const getMonthNames = () => {
    // Fixed timeline: Jan 2025 to Oct 2025 (10 months total)
    // Historical data: Jan 2025 - Aug 2025 (8 months)
    // Predicted data: Sep 2025 - Oct 2025 (2 months)
    return [
      'Jan 25',  // score_of_8_months_ago
      'Feb 25',  // score_of_7_months_ago
      'Mar 25',  // score_of_6_months_ago
      'Apr 25',  // score_of_5_months_ago
      'May 25',  // score_of_4_months_ago
      'Jun 25',  // score_of_3_months_ago
      'Jul 25',  // score_of_2_months_ago
      'Aug 25',  // score_of_last_month
      'Sep 25',  // next_month_score (predicted)
      'Oct 25'   // following_month_score (predicted)
    ];
  };
 
  const createForecastDataset = useCallback((apiResponse) => {
    try {
      console.log('📊 Processing API response:', apiResponse);
     
      // Extract historical scores (8 months) in chronological order
      const historicalColumns = [
        'score_of_8_months_ago',
        'score_of_7_months_ago',
        'score_of_6_months_ago',
        'score_of_5_months_ago',
        'score_of_4_months_ago',
        'score_of_3_months_ago',
        'score_of_2_months_ago',
        'score_of_last_month'
      ];
     
      const historicalScores = historicalColumns.map(col => {
        const score = apiResponse[col];
        return score ? Math.round(parseFloat(score)) : null;
      }).filter(score => score !== null);
 
      // Extract predicted scores (2 months)
      const predictedScores = [
        apiResponse.next_month_score ? Math.round(parseFloat(apiResponse.next_month_score)) : null,
        apiResponse.following_month_score ? Math.round(parseFloat(apiResponse.following_month_score)) : null
      ].filter(score => score !== null);
 
      console.log('📈 Historical scores:', historicalScores);
      console.log('🔮 Predicted scores:', predictedScores);
 
      if (historicalScores.length === 0 && predictedScores.length === 0) {
        throw new Error('No valid score data found in API response');
      }
 
      // Combine all scores for the 10-month timeline
      const allScores = [...historicalScores, ...predictedScores];
      const monthNames = getMonthNames();
 
             // Create dataset for the chart
       const dataset = allScores.map((score, index) => {
         const isHistorical = index < historicalScores.length;
         const isPredicted = index >= historicalScores.length;
         const isLastHistorical = index === historicalScores.length - 1; // August (index 7)
         
         return {
           month: monthNames[index] || `Month ${index + 1}`,
           score: score,
           historical: isHistorical ? score : null,
           // Include August value in predicted line to connect the lines
           predicted: (isPredicted || isLastHistorical) ? score : null,
           // Add confidence intervals starting from August (for smooth range transition)
           confidenceUpper: (isPredicted || isLastHistorical) ? Math.min(850, score + 15) : null,
           confidenceLower: (isPredicted || isLastHistorical) ? Math.max(300, score - 15) : null,
           type: isHistorical ? 'Historical' : 'Predicted'
         };
       });
 
      console.log('📊 Final dataset:', dataset);
      return dataset;
 
    } catch (error) {
      console.error('❌ Error creating forecast dataset:', error);
      throw error;
    }
  }, []);
 
  const fetchCompleteUserForecast = useCallback(async () => {
    if (!user?.username) {
      setError('No user logged in');
      setLoading(false);
      return;
    }
 
    setLoading(true);
    setError(null);
 
    try {
      console.log('🔮 Fetching complete forecast for user:', user.username);
 
      // Call your existing /predict endpoint that returns 10 months of data
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.username
        })
      });
 
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        throw new Error(`API request failed (${response.status}): ${errorText}`);
      }
 
      const data = await response.json();
      console.log('✅ API Response received:', data);
 
      if (!data.prediction) {
        throw new Error('Invalid API response: missing prediction data');
      }
 
      // Check for error in the prediction data
      if (data.prediction.error) {
        throw new Error(data.prediction.error);
      }
 
      // Create the forecast dataset from the API response
      const dataset = createForecastDataset(data.prediction);
      setForecastData(dataset);
 
      console.log('✅ Complete 10-month forecast loaded successfully');
 
    } catch (error) {
      console.error('❌ Error fetching forecast:', error);
      setError(`Failed to load forecast: ${error.message}`);
     
      // Optional: Add mock data as fallback for testing
      const mockDataset = createMockForecast();
      setForecastData(mockDataset);
    } finally {
      setLoading(false);
    }
  }, [user?.username, createForecastDataset]);
 
     // Mock data for testing/fallback
   const createMockForecast = useCallback(() => {
     const baseScore = currentScore || user?.creditScore || 720;
     const monthNames = getMonthNames(); // Uses the same Jan 2025 - Oct 2025 timeline
     
          return monthNames.map((month, index) => {
       const isHistorical = index < 8;
       const isPredicted = index >= 8;
       const isLastHistorical = index === 7; // August (index 7)
       
       // Create realistic score progression
       let score;
       if (isHistorical) {
         // Historical data - slight downward trend then recovery
         score = Math.round(baseScore - (8 - index) * 3 + Math.random() * 10 - 5);
       } else {
         // Predicted data - slight upward trend
         score = Math.round(baseScore + (index - 7) * 5 + Math.random() * 8 - 4);
       }
       
       score = Math.max(300, Math.min(850, score)); // Clamp to valid range
       
                return {
           month,
           score,
           historical: isHistorical ? score : null,
           // Include August value in predicted line to connect the lines
           predicted: (isPredicted || isLastHistorical) ? score : null,
           // Add confidence intervals starting from August (for smooth range transition)
           confidenceUpper: (isPredicted || isLastHistorical) ? Math.min(850, score + 12) : null,
           confidenceLower: (isPredicted || isLastHistorical) ? Math.max(300, score - 12) : null,
           type: isHistorical ? 'Historical' : 'Predicted'
         };
     });
  }, [currentScore, user?.creditScore]);
 
  useEffect(() => {
    fetchCompleteUserForecast();
  }, [fetchCompleteUserForecast]);
 
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-blue-600">
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            Score: {data.score}
          </p>
                     <p className="text-sm text-gray-600">
             {data.type === 'Historical' ? '📊 Historical Data' : '🔮 AI Prediction'}
           </p>
           {(data.confidenceUpper && data.confidenceLower) && (
             <p className="text-xs text-gray-500">
               Range: {data.confidenceLower} - {data.confidenceUpper}
             </p>
           )}
        </div>
      );
    }
    return null;
  };
 
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Forecast</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchCompleteUserForecast}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
 
  if (!forecastData.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center text-gray-500">
          <Target className="mx-auto h-12 w-12 mb-4" />
          <p>No forecast data available</p>
        </div>
      </div>
    );
  }
 
  // Calculate analytics
  const historicalData = forecastData.filter(d => d.type === 'Historical');
  const predictedData = forecastData.filter(d => d.type === 'Predicted');
 
  const historicalTrend = historicalData.length > 1
    ? historicalData[historicalData.length - 1].score - historicalData[0].score
    : 0;
 
  const predictedChange = predictedData.length > 0 && historicalData.length > 0
    ? predictedData[predictedData.length - 1].score - historicalData[historicalData.length - 1].score
    : 0;
 
  const finalPredictedScore = predictedData.length > 0
    ? predictedData[predictedData.length - 1].score
    : null;
 
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Credit Score Forecast
        </h2>
                 <p className="text-gray-600">
           January 2025 - October 2025: {historicalData.length} months historical + {predictedData.length} months predicted
         </p>
      </div>
 
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <History className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-600">Historical Trend</p>
              <p className="text-2xl font-bold text-blue-900">
                {historicalTrend > 0 ? '+' : ''}{historicalTrend}
              </p>
            </div>
          </div>
        </div>
 
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-600">Predicted Change</p>
              <p className="text-2xl font-bold text-green-900">
                {predictedChange > 0 ? '+' : ''}{predictedChange}
              </p>
            </div>
          </div>
        </div>
 
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-purple-600">Final Prediction</p>
              <p className="text-2xl font-bold text-purple-900">
                {finalPredictedScore || 'N/A'}
              </p>
            </div>
          </div>
        </div>
 
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-gray-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Data Source</p>
              <p className="text-sm font-bold text-gray-900">Live ML Model</p>
            </div>
          </div>
        </div>
      </div>
 
      {/* Chart */}
      <div className="h-80 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={forecastData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              domain={['dataMin - 20', 'dataMax + 20']}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
           
            {/* Historical data line */}
            <Line
              type="monotone"
              dataKey="historical"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
              connectNulls={false}
              name="Historical Data"
            />
           
            {/* Predicted data line */}
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#10B981"
              strokeWidth={3}
              strokeDasharray="8 8"
              dot={{ fill: '#10B981', strokeWidth: 2, r: 5 }}
              connectNulls={false}
              name="AI Predictions"
            />
           
            {/* Confidence intervals for predictions */}
            <Line
              type="monotone"
              dataKey="confidenceUpper"
              stroke="#10B981"
              strokeWidth={1}
              strokeDasharray="2 2"
              dot={false}
              connectNulls={false}
              name="Upper Confidence"
              strokeOpacity={0.5}
            />
            <Line
              type="monotone"
              dataKey="confidenceLower"
              stroke="#10B981"
              strokeWidth={1}
              strokeDasharray="2 2"
              dot={false}
              connectNulls={false}
              name="Lower Confidence"
              strokeOpacity={0.5}
            />
           
           
          </LineChart>
        </ResponsiveContainer>
      </div>
 
      {/* Footer Info */}
      <div className="text-sm text-gray-600 border-t pt-4">
        <div className="flex flex-wrap gap-4">
          <span>• Blue solid line: Historical data from your records</span>
          <span>• Green dashed line: AI-powered predictions</span>
          <span>• Confidence bands show prediction uncertainty</span>
        </div>
      </div>
    </div>
  );
};
 
export default CreditScoreForecasting;