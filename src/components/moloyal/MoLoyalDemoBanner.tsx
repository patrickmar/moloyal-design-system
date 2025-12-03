import { useState } from 'react';
import { UIIcons } from './MoLoyalIcons';

export function MoLoyalDemoBanner() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
            <UIIcons.Info className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">Demo Mode Active</p>
            <p className="text-xs opacity-90">
              This is a prototype. All data is mocked for demonstration purposes.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="h-8 w-8 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          aria-label="Dismiss banner"
        >
          <UIIcons.Close className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
