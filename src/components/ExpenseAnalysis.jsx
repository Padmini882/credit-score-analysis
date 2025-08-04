import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  ShoppingCart, Car, Home, Utensils, Gamepad2, MoreHorizontal
} from 'lucide-react';

// Maps to style categories based on backend data
const iconMap = {
  Shopping: ShoppingCart,
  Transport: Car,
  Housing: Home,
  Mortgage: Home,
  Dining: Utensils,
  Entertainment: Gamepad2,
  Groceries: ShoppingCart,
  Travel: Car,
  Utilities: MoreHorizontal,
  'Auto Loan': Car,
  Investment: MoreHorizontal,
  Income: MoreHorizontal,
  Other: MoreHorizontal,
};

const categoryColors = {
  Shopping: '#3b82f6',
  Transport: '#10b981',
  Housing: '#f59e0b',
  Mortgage: '#f59e0b',
  Dining: '#ef4444',
  Entertainment: '#8b5cf6',
  Groceries: '#a855f7',
  Travel: '#0ea5e9',
  Utilities: '#f97316',
  'Auto Loan': '#10b981',
  Investment: '#84cc16',
  Income: '#22c55e',
  Other: '#6b7280',
};


const ExpenseAnalysis = () => {
  const { user } = useAuth(); // get user from context
  const [expenseData, setExpenseData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.username) {
      fetchExpenseData(user.username);
      
}
}, [user]);

const fetchExpenseData = async (username) => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch(`http://localhost:8000/api/expenses?username=${username}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // The backend returns a single color. We'll assign colors on the frontend for better visuals.
    // --- Process categories to group less important ones into "Other" ---

    const mainCategoryNames = ['Mortgage', 'Auto Loan', 'Groceries', 'Utilities', 'Dining', 'Shopping', 'Transport'];
    
    // 1. Separate income from expenses and calculate the true total of expenses.
    const expenseCategories = data.categories.filter(c => c.name !== 'Income');
    const totalActualExpenses = expenseCategories.reduce((sum, cat) => sum + cat.amount, 0);

    // 2. Partition expenses into "main" and "other".
    const mainCategories = [];
    const otherCategories = [];
    expenseCategories.forEach(cat => {
      if (mainCategoryNames.includes(cat.name)) {
        mainCategories.push(cat);
      } else {
        otherCategories.push(cat);
      }
    });

    // 3. If there are "other" categories, sum them up into a single item.
    let finalCategories = [...mainCategories];
    if (otherCategories.length > 0) {
      const otherTotal = otherCategories.reduce((sum, cat) => sum + cat.amount, 0);
      finalCategories.push({ name: 'Other', amount: otherTotal, trend: 'stable', trendValue: 0 });
    }

    // 4. Recalculate percentages and add colors/icons for the final list.
    const processedCategories = finalCategories.map(category => ({
      ...category,
      percentage: totalActualExpenses > 0 ? (category.amount / totalActualExpenses) * 100 : 0,
      color: categoryColors[category.name] || categoryColors.Other,
    }));

    setExpenseData(processedCategories.sort((a, b) => b.amount - a.amount));
    setMonthlyData(data.monthly);
    setTotalExpenses(totalActualExpenses);
  } catch (e) {
    console.error("Error fetching expense data:", e);
    setError(e.message);
    console.error("Error fetching data:", error);
    } finally {
      
        setLoading(false);
        }
        };




  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 text-center bg-red-50 border-red-200">
        <h3 className="text-lg font-semibold text-danger-700">Could not load expense data</h3>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Expenses</h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
             ${(totalExpenses || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h4>
          <div className="space-y-4">
            {expenseData.length > 0 ? expenseData.map((category, index) => {
              const Icon = iconMap[category.name] || MoreHorizontal;
              const getTrendColor = () => {
                if (category.trend === 'up') return 'text-danger-600';
                if (category.trend === 'down') return 'text-success-600';
                return 'text-gray-500';
              };
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: category.color + '20' }}
                  >
                    <Icon className="h-5 w-5" style={{ color: category.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{category.name}</span>
                      <span className="text-sm font-bold text-gray-900">
                      ${(category.amount || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${category.percentage}%`,
                            backgroundColor: category.color
                          }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${getTrendColor()}`}>
                        {category.trend === 'up' ? '+' : category.trend === 'down' ? '-' : ''}
                        {Math.abs(category.trendValue || 0)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <p className="text-gray-500 text-center">No spending data available for this period.</p>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Expense Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="amount"
                >
                  {expenseData.length > 0 && expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`$${(value || 0).toLocaleString()}`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spending Trend</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip
                formatter={(value) => [`$${(value || 0).toLocaleString()}`, 'Expenses']}
              />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ExpenseAnalysis;
