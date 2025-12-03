import { Home, Target, CreditCard, User } from 'lucide-react';
import { cn } from '../ui/utils';

interface MoLoyalBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'transactions', label: 'Transactions', icon: CreditCard },
  { id: 'profile', label: 'Profile', icon: User }
];

const MoLoyalBottomNav: React.FC<MoLoyalBottomNavProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-0',
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
              aria-label={tab.label}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium truncate">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export { MoLoyalBottomNav };
export type { MoLoyalBottomNavProps };