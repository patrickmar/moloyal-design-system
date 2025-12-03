import { ArrowLeft, Menu } from 'lucide-react';
import { MoLoyalAvatar } from './MoLoyalAvatar';
import { User } from './types';

interface MoLoyalAppBarProps {
  variant?: 'default' | 'with-back';
  user?: User;
  onBack?: () => void;
  onMenuClick?: () => void;
  title?: string;
}

const MoLoyalAppBar: React.FC<MoLoyalAppBarProps> = ({
  variant = 'default',
  user,
  onBack,
  onMenuClick,
  title
}) => {
  return (
    <header className="h-16 bg-card border-b border-border px-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        {variant === 'with-back' && onBack ? (
          <button
            onClick={onBack}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        
        {variant === 'default' ? (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">Mo</span>
            </div>
            <span className="font-bold text-lg text-primary">MoLoyal</span>
          </div>
        ) : (
          <h1 className="font-semibold text-lg">{title}</h1>
        )}
      </div>

      {user && (
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium">{user.name}</div>
            <div className="text-xs text-muted-foreground">{user.rank}</div>
          </div>
          <MoLoyalAvatar
            src={user.avatar}
            name={user.name}
            rank={user.rank as any}
            size="md"
          />
        </div>
      )}
    </header>
  );
};

export { MoLoyalAppBar };
export type { MoLoyalAppBarProps };