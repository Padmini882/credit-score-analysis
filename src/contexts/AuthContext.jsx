import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    // For demo purposes, check demo credentials first
    // if (email === 'demo@example.com' && password === 'demo123') {
    //   const demoUser = {
    //     id: 'demo-user',
    //     name: 'Demo User',
    //     email: 'demo@example.com',
    //   };
    //   setUser(demoUser);
    //   localStorage.setItem('user', JSON.stringify(demoUser));
    //   return true;
    // }

    try {
      // Mock API call - replace with actual backend endpoint
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        const [score, utilization, dti] = userData.credit_score;

        const appUser = {
          name: userData.username,
          username: userData.username,
          // Store the detailed data from the login response
          creditScore: score,
          // Convert ratios to percentages for the UI components
          creditUtilization: Math.round(utilization * 100),
          debtToIncomeRatio: Math.round(dti * 100),
          financialHealth: parseFloat(userData.financial_health),
          monthlyIncome: userData.monthly_income,
          totalDebt: userData.total_debt,
        };
        setUser(appUser);
        localStorage.setItem('user', JSON.stringify(appUser));
        return { success: true };
      }
      else {
        const errorData = await response.json().catch(() => ({ detail: 'Invalid username or password' }));
        return { success: false, error: errorData.detail };
    }
  } catch (error) {
    console.error("Login request failed:", error);
    return { success: false, error: 'A network error occurred. Please try again.' };
  }

  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 