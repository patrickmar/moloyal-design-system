import React, { useState } from 'react';
import { MoLoyalButton } from './MoLoyalButton';
import { MoLoyalInput } from './MoLoyalInput';
import { MoLoyalToast } from './MoLoyalToast';
import { MoLoyalLogo, SecurityIcons, UIIcons } from './MoLoyalIcons';
import { sampleAgents } from './data';
import { Badge } from '../ui/badge';

interface MoLoyalAgentLoginProps {
  onLogin: (agent: any) => void;
  onBack?: () => void;
}

export function MoLoyalAgentLogin({ onLogin, onBack }: MoLoyalAgentLoginProps) {
  const [agentCode, setAgentCode] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFloatBalance, setShowFloatBalance] = useState(false);

  const handleLogin = async () => {
    if (!agentCode || !pin) {
      MoLoyalToast.error('Error', 'Please enter both Agent Code and PIN');
      return;
    }

    if (pin !== '1234') {
      MoLoyalToast.error('Invalid PIN', 'Please check your PIN and try again');
      return;
    }

    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      const agent = sampleAgents.find(a => a.agentCode.toLowerCase() === agentCode.toLowerCase()) 
        || sampleAgents[0]; // Default to first agent for demo

      setShowFloatBalance(true);
      
      // Show float balance for 2 seconds then proceed
      setTimeout(() => {
        setIsLoading(false);
        onLogin(agent);
      }, 2000);
    }, 1500);
  };

  if (showFloatBalance) {
    const agent = sampleAgents.find(a => a.agentCode.toLowerCase() === agentCode.toLowerCase()) 
      || sampleAgents[0];
    
    return (
      <div className="h-full bg-background flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="animate-pulse">
            <MoLoyalLogo size={64} variant="full" />
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <div className="mb-4">
              <h2 className="font-semibold text-lg">Welcome Back!</h2>
              <p className="text-sm text-muted-foreground">{agent.name}</p>
              <Badge variant="secondary" className="mt-2">
                {agent.businessName}
              </Badge>
            </div>
            
            <div className="bg-primary text-primary-foreground rounded-lg p-4">
              <p className="text-sm opacity-90">Current Float Balance</p>
              <p className="text-3xl font-bold">₦{agent.floatBalance.toLocaleString()}</p>
              <div className="flex items-center justify-between mt-2 text-xs opacity-90">
                <span>Tier: {agent.tier}</span>
                <span>ID: {agent.agentCode}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <UIIcons.CheckCircle className="h-4 w-4 text-green-500" />
              <span>KYC Verified</span>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin">
                <UIIcons.Clock className="h-4 w-4" />
              </div>
              <span>Initializing dashboard...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MoLoyalLogo size={32} variant="full" />
          <div>
            <h1 className="font-semibold">Agent Login</h1>
            <p className="text-xs text-muted-foreground">MoLoyal Agent App</p>
          </div>
        </div>
        {onBack && (
          <MoLoyalButton variant="ghost" size="small" onClick={onBack}>
            <UIIcons.X className="h-4 w-4" />
          </MoLoyalButton>
        )}
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          {/* App Icon */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
              <SecurityIcons.Shield className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold">Agent Access</h2>
            <p className="text-sm text-muted-foreground">
              Secure login for MoLoyal agents
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <MoLoyalInput
              label="Agent Code"
              placeholder="Enter your agent code"
              value={agentCode}
              onChange={(e) => setAgentCode(e.target.value)}
              helperText="Example: AML001"
            />

            <MoLoyalInput
              label="PIN"
              type="password"
              placeholder="Enter your PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              helperText="Demo PIN: 1234"
            />

            <MoLoyalButton
              variant="primary"
              size="large"
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin">
                    <UIIcons.Clock className="h-4 w-4" />
                  </div>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </MoLoyalButton>
          </div>

          {/* Demo Credentials */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-medium mb-2 text-sm">Demo Credentials</h3>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Agent Code:</span>
                <span className="font-mono">AML001</span>
              </div>
              <div className="flex justify-between">
                <span>PIN:</span>
                <span className="font-mono">1234</span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="text-center text-xs text-muted-foreground">
            <p>This app is secured with military-grade encryption.</p>
            <p>Your credentials are protected by advanced security measures.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-card border-t px-4 py-3 text-center">
        <p className="text-xs text-muted-foreground">
          MoLoyal Agent App v1.0 • Nigerian Army Financial Services
        </p>
      </div>
    </div>
  );
}