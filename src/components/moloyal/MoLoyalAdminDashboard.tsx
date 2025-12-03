import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { FinanceIcons, MilitaryIcons, SecurityIcons } from './MoLoyalIcons';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatCurrency } from './data';

interface KPIData {
  totalUsers: number;
  totalUsersTrend: number;
  activeSavers: number;
  activeSaversTrend: number;
  totalFunds: number;
  totalFundsTrend: number;
  lockedFunds: number;
  lockedFundsTrend: number;
  pendingWithdrawals: number;
  pendingWithdrawalsTrend: number;
  monthlyGrowth: Array<{ month: string; value: number }>;
}

interface MoLoyalAdminDashboardProps {
  kpiData: KPIData;
  adminName: string;
  adminRole: string;
}

export function MoLoyalAdminDashboard({ kpiData, adminName, adminRole }: MoLoyalAdminDashboardProps) {
  const TrendIndicator = ({ value }: { value: number }) => {
    const isPositive = value >= 0;
    return (
      <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? (
          <FinanceIcons.ArrowUp className="h-3 w-3" />
        ) : (
          <FinanceIcons.ArrowDown className="h-3 w-3" />
        )}
        <span>{Math.abs(value)}%</span>
      </div>
    );
  };

  const SparklineChart = ({ data }: { data: number[] }) => (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data.map((value, i) => ({ value, index: i }))}>
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="currentColor" 
          strokeWidth={2} 
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  // Generate sparkline data from monthly growth
  const sparklineData = kpiData.monthlyGrowth.slice(-7).map(d => d.value / 1000000);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {adminName}
          </p>
        </div>
        <Badge variant="secondary" className="text-sm px-3 py-1">
          <SecurityIcons.Shield className="h-3 w-3 mr-1 inline" />
          {adminRole.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Total Users */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <MilitaryIcons.Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.totalUsers.toLocaleString()}</div>
            <div className="flex items-center justify-between mt-2">
              <TrendIndicator value={kpiData.totalUsersTrend} />
              <div className="text-xs text-muted-foreground">vs last month</div>
            </div>
            <div className="mt-3 text-primary">
              <SparklineChart data={sparklineData} />
            </div>
          </CardContent>
        </Card>

        {/* Active Savers */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Savers</CardTitle>
              <FinanceIcons.PiggyBank className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.activeSavers.toLocaleString()}</div>
            <div className="flex items-center justify-between mt-2">
              <TrendIndicator value={kpiData.activeSaversTrend} />
              <div className="text-xs text-muted-foreground">
                {((kpiData.activeSavers / kpiData.totalUsers) * 100).toFixed(1)}% of total
              </div>
            </div>
            <Progress 
              value={(kpiData.activeSavers / kpiData.totalUsers) * 100} 
              className="mt-3 h-1"
            />
          </CardContent>
        </Card>

        {/* Total Funds */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Funds</CardTitle>
              <FinanceIcons.Wallet className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpiData.totalFunds)}</div>
            <div className="flex items-center justify-between mt-2">
              <TrendIndicator value={kpiData.totalFundsTrend} />
              <div className="text-xs text-muted-foreground">vs last month</div>
            </div>
            <div className="mt-3 text-green-600">
              <SparklineChart data={sparklineData} />
            </div>
          </CardContent>
        </Card>

        {/* Locked Funds */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Locked Funds</CardTitle>
              <SecurityIcons.Lock className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpiData.lockedFunds)}</div>
            <div className="flex items-center justify-between mt-2">
              <TrendIndicator value={kpiData.lockedFundsTrend} />
              <div className="text-xs text-muted-foreground">
                {((kpiData.lockedFunds / kpiData.totalFunds) * 100).toFixed(1)}% of total
              </div>
            </div>
            <Progress 
              value={(kpiData.lockedFunds / kpiData.totalFunds) * 100} 
              className="mt-3 h-1"
            />
          </CardContent>
        </Card>

        {/* Pending Withdrawals */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Withdrawals</CardTitle>
              <SecurityIcons.AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.pendingWithdrawals}</div>
            <div className="flex items-center justify-between mt-2">
              <TrendIndicator value={kpiData.pendingWithdrawalsTrend} />
              <div className="text-xs text-muted-foreground">requires review</div>
            </div>
            <div className="mt-3">
              <Badge variant="secondary" className="text-xs">
                Avg. 2.3 hrs processing time
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fund Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Fund Growth Trend</CardTitle>
            <CardDescription>Total funds under management (7-month view)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kpiData.monthlyGrowth}>
                  <defs>
                    <linearGradient id="colorFunds" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0B6B40" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0B6B40" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `₦${(value / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Total Funds']}
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0B6B40" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorFunds)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Real-time operational metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Transaction Success Rate</span>
                <span className="font-semibold">98.7%</span>
              </div>
              <Progress value={98.7} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">KYC Verification Rate</span>
                <span className="font-semibold">94.2%</span>
              </div>
              <Progress value={94.2} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Agent Network Uptime</span>
                <span className="font-semibold">99.5%</span>
              </div>
              <Progress value={99.5} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-xs text-green-600 mb-1">Today's Deposits</div>
                <div className="text-lg font-bold text-green-700">₦12.5M</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-xs text-blue-600 mb-1">Today's Withdrawals</div>
                <div className="text-lg font-bold text-blue-700">₦8.2M</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
              <SecurityIcons.CheckCircle className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <div className="text-sm font-medium">System Status: Operational</div>
                <div className="text-xs text-muted-foreground">All services running normally</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used administrative functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left group">
              <FinanceIcons.Bank className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-medium text-sm">Upload Payroll</div>
              <div className="text-xs text-muted-foreground">Process batch payments</div>
            </button>
            <button className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left group">
              <MilitaryIcons.Users className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-medium text-sm">Manage Users</div>
              <div className="text-xs text-muted-foreground">View & edit accounts</div>
            </button>
            <button className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left group">
              <FinanceIcons.Calculator className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-medium text-sm">Generate Reports</div>
              <div className="text-xs text-muted-foreground">Export financial data</div>
            </button>
            <button className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left group">
              <SecurityIcons.Shield className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-medium text-sm">View Audit Logs</div>
              <div className="text-xs text-muted-foreground">Security & compliance</div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
