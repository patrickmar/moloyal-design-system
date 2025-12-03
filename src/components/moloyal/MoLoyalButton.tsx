import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../ui/utils';
import { ButtonVariant, ButtonSize } from './types';

interface MoLoyalButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const buttonVariants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
  secondary: 'border-2 border-primary text-primary bg-transparent hover:bg-primary/5',
  ghost: 'text-foreground hover:bg-muted/50',
  danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm'
};

const buttonSizes = {
  small: 'h-8 px-3 text-caption',
  medium: 'h-10 px-4',
  large: 'h-12 px-6'
};

const MoLoyalButton = forwardRef<HTMLButtonElement, MoLoyalButtonProps>(
  ({ variant = 'primary', size = 'medium', fullWidth = false, loading = false, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
          buttonVariants[variant],
          buttonSizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

MoLoyalButton.displayName = 'MoLoyalButton';

export { MoLoyalButton };
export type { MoLoyalButtonProps };