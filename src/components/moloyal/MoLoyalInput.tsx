import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../ui/utils';
import { AlertCircle } from 'lucide-react';

interface MoLoyalInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

const MoLoyalInput = forwardRef<HTMLInputElement, MoLoyalInputProps>(
  ({ className, label, error, helperText, icon, disabled, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block font-medium text-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-3 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'flex h-10 w-full rounded-md border bg-card py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              icon ? 'pl-10 pr-3' : 'px-3',
              error 
                ? 'border-destructive focus-visible:ring-destructive' 
                : 'border-border',
              className
            )}
            disabled={disabled}
            {...props}
          />
          {error && (
            <AlertCircle className={cn(
              "absolute top-3 h-4 w-4 text-destructive",
              icon ? "right-3" : "right-3"
            )} />
          )}
        </div>
        {error && (
          <p className="text-caption text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-caption text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

MoLoyalInput.displayName = 'MoLoyalInput';

export { MoLoyalInput };
export type { MoLoyalInputProps };