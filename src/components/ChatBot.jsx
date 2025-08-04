import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Send, Bot, User, MessageCircle, Loader } from 'lucide-react';

const ChatBot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hello! I'm your financial assistant. I can help you understand your credit score, provide personalized advice, and answer questions about improving your financial health. What would you like to know?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Mock API call - replace with actual chatbot endpoint
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputMessage }),
      });

      let botResponse = '';
      if (response.ok) {
        const data = await response.json();
        botResponse = data.response;
      } else {
        botResponse = generateMockResponse(inputMessage, user);
      }

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: generateMockResponse(inputMessage, user),
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const generateMockResponse = (userInput, userData) => {
    const input = userInput.toLowerCase();

    if (!userData) {
      return "I'm sorry, I can't access your financial data at the moment. Please try again later.";
    }

    const { creditScore, debtToIncomeRatio, creditUtilization } = userData;

    const getScoreRating = (score) => {
      if (!score) return 'N/A';
      if (score >= 800) return 'Excellent';
      if (score >= 740) return 'Very Good';
      if (score >= 670) return 'Good';
      if (score >= 580) return 'Fair';
      return 'Poor';
    };
    const scoreRating = getScoreRating(creditScore);
    
    if (input.includes('credit score') || input.includes('score')) {
      return `Your current credit score of ${creditScore} is in the '${scoreRating}' range! This puts you in a strong position for most loan applications. To move into the 'Excellent' range (800+), focus on reducing your credit utilization below 10% and maintaining perfect payment history.`;
    }
    
    if (input.includes('improve') || input.includes('better') || input.includes('increase')) {
      return "Great question! Based on your current profile, here are the top 3 ways to improve your credit score: 1) Pay down credit card balances to reduce utilization below 30% (ideally under 10%), 2) Set up automatic payments to ensure 100% on-time payments, 3) Keep old accounts open to maintain credit history length. These changes can boost your score by 20-50 points over 3-6 months.";
    }
    
    if (input.includes('debt') || input.includes('pay') || input.includes('payment')) {
      return `Managing debt effectively is crucial for credit health. Your current debt-to-income ratio is ${debtToIncomeRatio}%, which is reasonable but could be improved. Consider the 'avalanche method' - pay minimums on all debts, then put extra money toward the highest interest rate debt first. This saves money and improves your credit utilization faster.`;
    }
    
    if (input.includes('utilization') || input.includes('credit card')) {
      return `Credit utilization is 30% of your credit score calculation! Your current ${creditUtilization}% utilization is higher than ideal. Aim for under 30% across all cards, and under 10% for the best scores. Pro tip: Make multiple payments per month or pay before your statement closes to keep reported balances low.`;
    }
    
    if (input.includes('forecast') || input.includes('future') || input.includes('predict')) {
      return `Based on your current financial behavior, I predict your credit score could reach ${creditScore + 20} within 6 months if you maintain good habits. With aggressive improvements (paying down debt, perfect payments), you could potentially reach ${creditScore + 35}! The key is consistency - small improvements compound over time.`;
    }
    
    if (input.includes('report') || input.includes('error') || input.includes('mistake')) {
      return "Checking your credit reports regularly is smart! You're entitled to free reports from all three bureaus annually at annualcreditreport.com. Look for errors like incorrect balances, accounts that aren't yours, or wrong payment histories. Disputing errors can sometimes boost your score quickly - I've seen 50+ point increases from fixing major errors!";
    }
    
    if (input.includes('hello') || input.includes('hi') || input.includes('help')) {
      return "Hello! I'm here to help with all your credit and financial questions. I can explain your credit score factors, suggest improvement strategies, help you understand your expenses, or discuss debt management. What specific area would you like to focus on?";
    }
    
    if (input.includes('expense') || input.includes('spending') || input.includes('budget')) {
      return "Looking at your spending patterns, I notice housing and shopping are your largest categories. Consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings/debt payment. Your current spending suggests room for optimization - maybe reduce shopping by 10% and put that toward debt paydown?";
    }
    
    if (input.includes('loan') || input.includes('mortgage') || input.includes('apply')) {
      return `With your ${creditScore} credit score, you should qualify for good rates on most loans! For mortgages, you'll likely get rates close to the best available. For auto loans, you're in the 'prime' category. Personal loans should also have reasonable rates. Shopping around with multiple lenders within 14-45 days counts as one inquiry, so compare offers freely.`;
    }
    
    if (input.includes('thanks') || input.includes('thank you')) {
      return "You're welcome! I'm always here to help you improve your financial health. Remember, building good credit is a marathon, not a sprint. Stay consistent with good habits and you'll see steady progress. Feel free to ask me anything else!";
    }
    
    // Generic helpful response for unmatched queries
    return "That's a great question! While I'd love to give you specific advice, I'd recommend speaking with a certified financial advisor for detailed guidance. In general, focus on the key credit factors: payment history (35%), credit utilization (30%), credit age (15%), credit mix (10%), and new credit (10%). Is there a specific aspect of your credit profile you'd like to discuss?";
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "How can I improve my credit score?",
    "Why is my utilization high?",
    "What's my score forecast?",
    "How to reduce my debt?",
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                AI Financial Assistant
              </h3>
              <p className="text-sm text-gray-500">
                Get personalized advice and answers to your financial questions
              </p>
            </div>
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start space-x-2 mb-1">
                  {message.sender === 'bot' ? (
                    <Bot className="h-4 w-4 mt-0.5 text-primary-600" />
                  ) : (
                    <User className="h-4 w-4 mt-0.5" />
                  )}
                  <span className="text-xs opacity-75">
                    {message.sender === 'user' ? 'You' : 'Assistant'}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className="text-xs opacity-50 mt-1">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-100">
                <div className="flex items-center space-x-2">
                  <Loader className="h-4 w-4 animate-spin text-primary-600" />
                  <span className="text-sm text-gray-600">Assistant is typing...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        <div className="border-t border-gray-200 p-4">
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors duration-200"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your credit score or finances..."
              className="flex-1 input-field"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="btn-primary px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot; 