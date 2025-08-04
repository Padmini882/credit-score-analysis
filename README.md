# Credit Score Dashboard - Frontend

A modern, responsive React application for managing and visualizing credit score data with comprehensive financial health insights.

## Features

### 🔐 Authentication
- Simplified user login system
- Demo credentials for quick access
- Secure session management

### 📊 Financial Health Dashboard
- **Credit Score Visualization**: Interactive circular progress indicator with color-coded scoring
- **Financial Metrics Overview**: Debt-to-income ratio, credit utilization, payment history, and credit mix
- **Real-time Updates**: Dynamic data fetching and display

### 💰 Expense Analysis
- **Categorized Spending**: Visual breakdown of expenses by category (Shopping, Transportation, Housing, etc.)
- **Interactive Charts**: Pie charts and bar graphs using Recharts
- **Trend Analysis**: Month-over-month spending patterns with trend indicators

### 🎯 Credit Score Analysis
- **Factor Analysis**: Detailed breakdown of credit score components with impact assessment
- **Improvement Suggestions**: Personalized, actionable recommendations
- **Timeline Estimates**: Expected timeframes for credit improvements

### 📈 Credit Score Forecasting
- **Predictive Modeling**: 6-month credit score forecasts
- **Scenario Planning**: Compare different financial behavior scenarios
- **Confidence Intervals**: Statistical confidence ranges for predictions

### 🤖 AI Chatbot
- **Conversational Interface**: Natural language interaction
- **Financial Advice**: Personalized credit and financial guidance
- **Quick Questions**: Pre-defined common queries for faster assistance

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Create React App

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd credit-score-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Login

Use these credentials to access the demo:
- **Email**: demo@example.com
- **Password**: demo123

## Project Structure

```
src/
├── components/           # React components
│   ├── Login.tsx        # Authentication component
│   ├── Dashboard.tsx    # Main dashboard layout
│   ├── Header.tsx       # Navigation header
│   ├── CreditScoreCard.tsx        # Credit score visualization
│   ├── FinancialHealthOverview.tsx # Financial metrics
│   ├── ExpenseAnalysis.tsx        # Expense categorization
│   ├── CreditScoreAnalysis.tsx    # Score factor analysis
│   ├── CreditScoreForecasting.tsx # Predictive modeling
│   └── ChatBot.tsx      # AI assistant interface
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication state management
├── index.css           # Global styles and Tailwind imports
├── index.tsx           # Application entry point
└── App.tsx             # Main application component
```

## Design System

### Color Palette
- **Primary**: Blue tones (#3b82f6)
- **Success**: Green tones (#22c55e)
- **Warning**: Amber tones (#f59e0b)
- **Danger**: Red tones (#ef4444)

### Components
- **Cards**: White background with subtle shadows
- **Buttons**: Primary and secondary variants with hover states
- **Forms**: Consistent input styling with focus states
- **Charts**: Color-coordinated with the design system

## API Integration

The frontend is designed to work with backend endpoints. Replace the mock data and API calls in the following areas:

### Authentication
```typescript
// src/contexts/AuthContext.tsx
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
```

### Dashboard Data
```typescript
// src/components/Dashboard.tsx
const response = await fetch('/api/dashboard');
```

### Expense Data
```typescript
// src/components/ExpenseAnalysis.tsx
const response = await fetch('/api/expenses');
```

### Credit Analysis
```typescript
// src/components/CreditScoreAnalysis.tsx
const response = await fetch('/api/credit-analysis', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
```

### Credit Forecasting
```typescript
// src/components/CreditScoreForecasting.tsx
const response = await fetch('/api/credit-forecast', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ currentScore }),
});
```

### Chatbot
```typescript
// src/components/ChatBot.tsx
const response = await fetch('/api/chatbot', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: inputMessage }),
});
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (irreversible)

## Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full feature set with optimal layout
- **Tablet**: Adapted grid layouts and touch-friendly interactions
- **Mobile**: Stacked layouts and mobile-optimized navigation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please create an issue in the repository or contact the development team. 