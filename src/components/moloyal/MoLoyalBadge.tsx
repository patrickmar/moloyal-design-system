import { cn } from '../ui/utils';
import { Shield, Star, Award, Crown } from 'lucide-react';
import { Rank } from './types';

interface MoLoyalBadgeProps {
  rank: Rank;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const rankConfig = {
  'Private': {
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    icon: Shield,
    description: 'Private'
  },
  'Corporal': {
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: Star,
    description: 'Corporal'
  },
  'Sergeant': {
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: Award,
    description: 'Sergeant'
  },
  'Lieutenant': {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: Crown,
    description: 'Lieutenant'
  }
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base'
};

const iconSizes = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4', 
  lg: 'h-5 w-5'
};

const MoLoyalBadge: React.FC<MoLoyalBadgeProps> = ({
  rank,
  size = 'md',
  showIcon = true,
  className
}) => {
  const config = rankConfig[rank];
  const Icon = config.icon;

  return (
    <div 
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        config.color,
        sizeClasses[size],
        className
      )}
      title={`Military Rank: ${config.description}`}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{rank}</span>
    </div>
  );
};

export { MoLoyalBadge };
export type { MoLoyalBadgeProps };