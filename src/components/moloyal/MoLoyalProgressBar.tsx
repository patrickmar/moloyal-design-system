import { cn } from '../ui/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface MoLoyalProgressBarProps {
  current: number;
  target: number;
  className?: string;
  showTooltip?: boolean;
  label?: string;
}

const MoLoyalProgressBar: React.FC<MoLoyalProgressBarProps> = ({
  current,
  target,
  className,
  showTooltip = false,
  label
}) => {
  const percentage = Math.min((current / target) * 100, 100);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const progressBar = (
    <div className={cn('space-y-2', className)}>
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm text-muted-foreground">
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>{formatCurrency(current)}</span>
        <span>{formatCurrency(target)}</span>
      </div>
    </div>
  );

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {progressBar}
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <p className="font-medium">{label}</p>
              <p>{formatCurrency(current)} of {formatCurrency(target)}</p>
              <p>{percentage.toFixed(1)}% complete</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return progressBar;
};

export { MoLoyalProgressBar };
export type { MoLoyalProgressBarProps };