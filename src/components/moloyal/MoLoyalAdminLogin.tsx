import { useState } from 'react';
import { MoLoyalLogo, SecurityIcons, UIIcons } from './MoLoyalIcons';
import { MoLoyalButton } from './MoLoyalButton';
import { MoLoyalInput } from './MoLoyalInput';
import { MoLoyalToast } from './MoLoyalToast';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'finance_admin' | 'auditor' | 'support';
  department: string;
  rank: string;
}

interface MoLoyalAdminLoginProps {
  onLoginSuccess: (admin: Admin, sessionToken: string) => void;
}

export function MoLoyalAdminLogin({ onLoginSuccess }: MoLoyalAdminLoginProps) {
  const [step, setStep] = useState<'credentials' | 'twoFactor'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempAdmin, setTempAdmin] = useState<Admin | null>(null);

  // Demo credentials
  const demoCredentials = {
    email: 'admin@moloyal.mil.ng',
    password: 'Admin@123',
    otp: '123456'
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (email === demoCredentials.email && password === demoCredentials.password) {
        // Store temp admin data
        setTempAdmin({
          id: 'ADM001',
          name: 'Col. Ibrahim Hassan',
          email: email,
          role: 'super_admin',
          department: 'Finance Command',
          rank: 'Colonel'
        });
        setStep('twoFactor');
        MoLoyalToast.success('OTP Sent', 'Verification code sent to your registered device');
      } else {
        MoLoyalToast.error('Login Failed', 'Invalid email or password');
      }
      setLoading(false);
    }, 1000);
  };

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate OTP verification
    setTimeout(() => {
      if (otpCode === demoCredentials.otp && tempAdmin) {
        const sessionToken = `SESSION_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        onLoginSuccess(tempAdmin, sessionToken);
        MoLoyalToast.success('Login Successful', `Welcome back, ${tempAdmin.rank} ${tempAdmin.name.split(' ')[0]}`);
      } else {
        MoLoyalToast.error('Verification Failed', 'Invalid OTP code');
      }
      setLoading(false);
    }, 800);
  };

  const handleResendOTP = () => {
    MoLoyalToast.success('OTP Resent', 'New verification code sent to your device');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <MoLoyalLogo size={48} variant="icon" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">MoLoyal Admin Portal</h1>
          <p className="text-muted-foreground">Military-grade financial management system</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-xl border p-8">
          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Sign In</h2>
                <p className="text-sm text-muted-foreground">Enter your credentials to access the admin portal</p>
              </div>

              <MoLoyalInput
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@moloyal.mil.ng"
                required
                disabled={loading}
              />

              <MoLoyalInput
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-border" />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => MoLoyalToast.info('Contact Admin', 'Please contact your system administrator')}
                >
                  Forgot password?
                </button>
              </div>

              <MoLoyalButton
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                loading={loading}
              >
                <div className="flex items-center justify-center gap-2">
                  <SecurityIcons.Lock className="h-4 w-4" />
                  Continue
                </div>
              </MoLoyalButton>

              {/* Demo Credentials Hint */}
              <div className="mt-6 p-3 bg-muted/50 rounded-lg border border-dashed">
                <p className="text-xs text-muted-foreground text-center">
                  <strong>Demo:</strong> admin@moloyal.mil.ng / Admin@123
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleTwoFactorSubmit} className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 bg-primary/10 rounded-full mb-4">
                  <SecurityIcons.Shield className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Two-Factor Authentication</h2>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code sent to your registered device
                </p>
              </div>

              <MoLoyalInput
                label="Verification Code"
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                required
                disabled={loading}
                helperText="Enter the OTP code from your authenticator app or SMS"
              />

              <div className="flex gap-3">
                <MoLoyalButton
                  type="button"
                  variant="ghost"
                  fullWidth
                  onClick={() => setStep('credentials')}
                  disabled={loading}
                >
                  <UIIcons.ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </MoLoyalButton>
                <MoLoyalButton
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={loading}
                  disabled={otpCode.length !== 6}
                >
                  <SecurityIcons.CheckCircle className="h-4 w-4 mr-2" />
                  Verify & Login
                </MoLoyalButton>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={handleResendOTP}
                  disabled={loading}
                >
                  Didn't receive code? Resend OTP
                </button>
              </div>

              {/* Demo OTP Hint */}
              <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-dashed">
                <p className="text-xs text-muted-foreground text-center">
                  <strong>Demo OTP:</strong> 123456
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <SecurityIcons.Shield className="h-4 w-4" />
            <span>Secured with military-grade encryption</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            All login attempts are logged and monitored for security
          </p>
        </div>
      </div>
    </div>
  );
}
