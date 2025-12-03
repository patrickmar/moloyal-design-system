import { Eye, EyeOff, TrendingUp, Calendar, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../ui/utils';
import { Goal, Transaction } from './types';
import { MoLoyalProgressBar } from './MoLoyalProgressBar';

// Balance Card Component
interface BalanceCardProps {
  balance: number;
  allocation: number;
  className?: string;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance, allocation, className }) => {
  const [showBalance, setShowBalance] = useState(true);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className={cn(
      'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 rounded-lg shadow-lg',
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm opacity-90">Available Balance</p>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">
              {showBalance ? formatCurrency(balance) : '••••••'}
            </h2>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1 hover:bg-white/20 rounded"
              aria-label={showBalance ? 'Hide balance' : 'Show balance'}
            >
              {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-75">Monthly Allocation</p>
          <p className="text-sm font-medium">{formatCurrency(allocation)}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-sm opacity-90">
        <TrendingUp className="h-4 w-4" />
        <span>+12% this month</span>
      </div>
    </div>
  );
};

// Goal Card Component
interface GoalCardProps {
  goal: Goal;
  className?: string;
  onClick?: () => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, className, onClick }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const daysLeft = Math.ceil(
    (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div 
      className={cn(
        'bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium">{goal.title}</h3>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <MoLoyalProgressBar
        current={goal.current}
        target={goal.target}
        className="mb-3"
      />
      
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>{daysLeft} days left</span>
        </div>
        <span>{formatCurrency(goal.target - goal.current)} to go</span>
      </div>
    </div>
  );
};

// Transaction Row Components
interface TransactionRowProps {
  transaction: Transaction;
  variant?: 'compact' | 'expanded';
  className?: string;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ 
  transaction, 
  variant = 'compact',
  className 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (variant === 'compact') {
    return (
      <div className={cn(
        'flex items-center justify-between py-3 border-b border-border last:border-b-0',
        className
      )}>
        <div className="flex-1">
          <p className="font-medium text-sm">{transaction.description}</p>
          <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
        </div>
        <div className="text-right">
          <p className={cn(
            'font-medium',
            transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
          )}>
            {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
          </p>
          {transaction.category && (
            <p className="text-xs text-muted-foreground">{transaction.category}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'bg-card border border-border rounded-lg p-4 shadow-sm',
      className
    )}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium">{transaction.description}</h4>
          <p className="text-sm text-muted-foreground">{transaction.category}</p>
        </div>
        <div className="text-right">
          <p className={cn(
            'font-bold text-lg',
            transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
          )}>
            {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
          </p>
          <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
        </div>
      </div>
    </div>
  );
};

export { BalanceCard, GoalCard, TransactionRow };
export type { BalanceCardProps, GoalCardProps, TransactionRowProps };