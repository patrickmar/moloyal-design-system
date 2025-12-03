import { cn } from '../ui/utils';
import { Rank } from './types';
import { Shield } from 'lucide-react';

interface MoLoyalAvatarProps {
  src?: string;
  name: string;
  rank?: Rank;
  size?: 'sm' | 'md' | 'lg';
  showRankBadge?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10', 
  lg: 'h-16 w-16'
};

const rankBadgeColors = {
  'Private': 'bg-gray-500',
  'Corporal': 'bg-blue-500', 
  'Sergeant': 'bg-green-500',
  'Lieutenant': 'bg-yellow-500'
};

const MoLoyalAvatar: React.FC<MoLoyalAvatarProps> = ({
  src,
  name,
  rank,
  size = 'md',
  showRankBadge = true,
  className
}) => {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-card',
          sizeClasses[size]
        )}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className={cn(
            'font-medium text-primary',
            size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-lg' : 'text-sm'
          )}>
            {initials}
          </span>
        )}
      </div>
      
      {showRankBadge && rank && (
        <div 
          className={cn(
            'absolute -bottom-1 -right-1 rounded-full p-1 border-2 border-card',
            rankBadgeColors[rank]
          )}
          title={`Rank: ${rank}`}
        >
          <Shield className="h-3 w-3 text-white" />
        </div>
      )}
    </div>
  );
};

export { MoLoyalAvatar };
export type { MoLoyalAvatarProps };