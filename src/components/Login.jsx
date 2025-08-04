import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, Lock, Mail, Eye, EyeOff, Shield, Star, Zap } from 'lucide-react';
import CreditCardVisual from './CreditCardVisual';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // try {
    //   const response = await fetch("http://localhost:8000/login", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ username, password }),
    //   });
  
    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     alert(`Login failed: ${errorData.detail}`);
    //     return;
    //   }

    const result = await login(username, password);
    if (!result.success) {
      setError(result.error || 'Invalid username or password');
    }
    // On success, the AuthProvider updates the user state, and AppRoutes handles navigation.
    setIsLoading(false);
      
  };
  //   const success = await login(username, password);
  //   if (!success) {
  //     setError('Invalid username or password');
  //   }
  //   setIsLoading(false);
  // };

  // const fillDemoCredentials = () => {
  //   setEmail('demo@example.com');
  //   setPassword('demo123');
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 opacity-20">
          <CreditCardVisual type="premium" size="small" showDetails={false} />
        </div>
        <div className="absolute top-1/4 right-20 opacity-15 transform rotate-12">
          <CreditCardVisual type="primary" size="medium" showDetails={false} />
        </div>
        <div className="absolute bottom-20 left-1/4 opacity-10 transform -rotate-12">
          <CreditCardVisual type="secondary" size="large" showDetails={false} />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header Section */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="mx-auto h-20 w-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3">
                <CreditCard className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 h-6 w-6 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="h-3 w-3 text-white" />
              </div>
            </div>
            <h2 className="mt-8 text-4xl font-bold text-white">
              Welcome Back
            </h2>
            <p className="mt-3 text-lg text-blue-200">
              Sign in to your Credit Dashboard
            </p>
            
            {/* Feature badges */}
            <div className="mt-6 flex justify-center space-x-4">
              <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-xs text-white">Premium</span>
              </div>
              <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-xs text-white">Secure</span>
              </div>
              <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                <Zap className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-white">Fast</span>
              </div>
            </div>
          </div>
          
          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-blue-300" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="block w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-blue-300" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      className="block w-full pl-12 pr-12 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-blue-300 hover:text-white transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-blue-300 hover:text-white transition-colors" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Sign in to Dashboard
                      </>
                    )}
                  </button>

                  {/* <button
                    type="button"
                    onClick={fillDemoCredentials}
                    className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all duration-200 border border-white/30 hover:border-white/50"
                  >
                    Use Demo Credentials
                  </button> */}
                </div>
              </div>
            </div>
          </form>
          
          {/* <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-sm text-blue-200 mb-2">Demo Access</p>
              <p className="text-xs text-blue-300">
                <strong>Email:</strong> demo@example.com<br/>
                <strong>Password:</strong> demo123
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Login; 