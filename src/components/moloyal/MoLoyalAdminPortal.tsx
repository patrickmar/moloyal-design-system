import { useState, useEffect } from 'react';
import { MoLoyalAdminLogin } from './MoLoyalAdminLogin';
import { MoLoyalAdminDashboard } from './MoLoyalAdminDashboard';
import { MoLoyalAdminPayroll } from './MoLoyalAdminPayroll';
import { MoLoyalAdminUserManagement } from './MoLoyalAdminUserManagement';
import { MoLoyalAdminPolicyEditor } from './MoLoyalAdminPolicyEditor';
import { MoLoyalAdminReports } from './MoLoyalAdminReports';
import { MoLoyalAdminAuditLogs } from './MoLoyalAdminAuditLogs';
import { MoLoyalLogo, SecurityIcons, FinanceIcons, MilitaryIcons, UIIcons } from './MoLoyalIcons';
import { Badge } from '../ui/badge';
import { MoLoyalButton } from './MoLoyalButton';
import { MoLoyalToast } from './MoLoyalToast';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'finance_admin' | 'auditor' | 'support';
  department: string;
  rank: string;
}

interface MoLoyalAdminPortalProps {
  kpiData: any;
  users: any[];
  rankAllocations: any[];
  auditLog: any[];
  rosterData: any[];
  reportFilters: any;
  adminAuditLogs: any[];
  onBack?: () => void;
}

export function MoLoyalAdminPortal({
  kpiData,
  users,
  rankAllocations,
  auditLog,
  rosterData,
  reportFilters,
  adminAuditLogs,
  onBack
}: MoLoyalAdminPortalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sessionTimeout, setSessionTimeout] = useState(30 * 60); // 30 minutes in seconds
  const [showSessionWarning, setShowSessionWarning] = useState(false);

  // Session timeout management
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      setSessionTimeout(prev => {
        if (prev <= 60 && !showSessionWarning) {
          setShowSessionWarning(true);
          MoLoyalToast.warning('Session Expiring', 'Your session will expire in 1 minute');
        }
        if (prev <= 0) {
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, showSessionWarning]);

  const handleLoginSuccess = (admin: Admin, token: string) => {
    setCurrentAdmin(admin);
    setSessionToken(token);
    setIsAuthenticated(true);
    setSessionTimeout(30 * 60);
    
    // Log the login
    console.log('Admin logged in:', admin, 'Token:', token);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentAdmin(null);
    setSessionToken(null);
    setSessionTimeout(30 * 60);
    setShowSessionWarning(false);
    MoLoyalToast.info('Logged Out', 'You have been securely logged out');
  };

  const handleExtendSession = () => {
    setSessionTimeout(30 * 60);
    setShowSessionWarning(false);
    MoLoyalToast.success('Session Extended', 'Your session has been extended');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUserAction = (userId: string, action: string, reason?: string) => {
    console.log('User action:', { userId, action, reason });
    // This would make an API call in production
  };

  const handlePayrollUpload = (summary: any) => {
    console.log('Payroll uploaded:', summary);
    // This would trigger backend processing
  };

  const handlePolicyPublish = (allocations: any) => {
    console.log('Policy published:', allocations);
    MoLoyalToast.success('Policy Published', 'Rank allocation policy is now active');
  };

  // Navigation items with role-based access
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: FinanceIcons.Bank,
      roles: ['super_admin', 'finance_admin', 'auditor', 'support']
    },
    {
      id: 'payroll',
      label: 'Payroll Upload',
      icon: FinanceIcons.Calculator,
      roles: ['super_admin', 'finance_admin']
    },
    {
      id: 'users',
      label: 'User Management',
      icon: MilitaryIcons.Users,
      roles: ['super_admin', 'finance_admin', 'support']
    },
    {
      id: 'policy',
      label: 'Policy Editor',
      icon: SecurityIcons.Shield,
      roles: ['super_admin', 'finance_admin']
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: UIIcons.FileText,
      roles: ['super_admin', 'finance_admin', 'auditor']
    },
    {
      id: 'audit',
      label: 'Audit Logs',
      icon: SecurityIcons.Eye,
      roles: ['super_admin', 'auditor']
    }
  ];

  const visibleNavItems = navigationItems.filter(item =>
    currentAdmin && item.roles.includes(currentAdmin.role)
  );

  if (!isAuthenticated) {
    return <MoLoyalAdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <MoLoyalLogo size={32} variant="icon" />
            <div>
              <div className="font-bold">MoLoyal</div>
              <div className="text-xs text-muted-foreground">Admin Portal</div>
            </div>
          </div>
        </div>

        {/* Admin Info */}
        <div className="p-4 border-b bg-muted/30">
          <div className="text-sm font-medium">{currentAdmin?.name}</div>
          <div className="text-xs text-muted-foreground mb-2">{currentAdmin?.rank}</div>
          <Badge variant="secondary" className="text-xs">
            {currentAdmin?.role.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Session Info & Logout */}
        <div className="p-4 border-t space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Session expires in:</span>
            <span className={`font-mono ${sessionTimeout < 60 ? 'text-destructive font-semibold' : ''}`}>
              {formatTime(sessionTimeout)}
            </span>
          </div>
          {showSessionWarning && (
            <MoLoyalButton
              variant="secondary"
              size="small"
              fullWidth
              onClick={handleExtendSession}
            >
              Extend Session
            </MoLoyalButton>
          )}
          <MoLoyalButton
            variant="ghost"
            size="small"
            fullWidth
            onClick={handleLogout}
          >
            <UIIcons.LogOut className="h-4 w-4 mr-2" />
            Logout
          </MoLoyalButton>
          {onBack && (
            <MoLoyalButton
              variant="ghost"
              size="small"
              fullWidth
              onClick={onBack}
            >
              <UIIcons.ArrowLeft className="h-4 w-4 mr-2" />
              Back to Design System
            </MoLoyalButton>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Role-based content rendering */}
          {activeSection === 'dashboard' && (
            <MoLoyalAdminDashboard
              kpiData={kpiData}
              adminName={currentAdmin?.name || ''}
              adminRole={currentAdmin?.role || 'auditor'}
            />
          )}

          {activeSection === 'payroll' && (
            currentAdmin?.role === 'super_admin' || currentAdmin?.role === 'finance_admin' ? (
              <MoLoyalAdminPayroll onUploadComplete={handlePayrollUpload} />
            ) : (
              <div className="text-center py-12">
                <SecurityIcons.AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
                <p className="text-muted-foreground">You don't have permission to access this section</p>
              </div>
            )
          )}

          {activeSection === 'users' && (
            <MoLoyalAdminUserManagement
              users={users}
              onUserAction={handleUserAction}
            />
          )}

          {activeSection === 'policy' && (
            currentAdmin?.role === 'super_admin' || currentAdmin?.role === 'finance_admin' ? (
              <MoLoyalAdminPolicyEditor
                rankAllocations={rankAllocations}
                auditLog={auditLog}
                rosterData={rosterData}
                onSave={(allocations) => console.log('Draft saved:', allocations)}
                onPublish={handlePolicyPublish}
              />
            ) : (
              <div className="text-center py-12">
                <SecurityIcons.AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
                <p className="text-muted-foreground">You don't have permission to access this section</p>
              </div>
            )
          )}

          {activeSection === 'reports' && (
            <MoLoyalAdminReports filters={reportFilters} />
          )}

          {activeSection === 'audit' && (
            currentAdmin?.role === 'super_admin' || currentAdmin?.role === 'auditor' ? (
              <MoLoyalAdminAuditLogs logs={adminAuditLogs} />
            ) : (
              <div className="text-center py-12">
                <SecurityIcons.AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
                <p className="text-muted-foreground">You don't have permission to access this section</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
