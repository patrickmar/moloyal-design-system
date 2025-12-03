import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { SecurityIcons, UIIcons, MilitaryIcons } from './MoLoyalIcons';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorName: string;
  actorRole: 'super_admin' | 'finance_admin' | 'auditor' | 'support' | 'system';
  action: string;
  resource: string;
  resourceId: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  changes?: any;
  severity: 'info' | 'warning' | 'critical';
}

interface MoLoyalAdminAuditLogsProps {
  logs: AuditLogEntry[];
}

export function MoLoyalAdminAuditLogs({ logs }: MoLoyalAdminAuditLogsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'info' | 'warning' | 'critical'>('all');
  const [filterAction, setFilterAction] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const actionTypes = [...new Set(logs.map(log => log.action))];

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resourceId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    const matchesAction = filterAction === 'all' || log.action === filterAction;

    return matchesSearch && matchesSeverity && matchesAction;
  });

  const getSeverityBadge = (severity: string) => {
    const variants = {
      info: 'bg-blue-50 text-blue-700 border-blue-200',
      warning: 'bg-amber-50 text-amber-700 border-amber-200',
      critical: 'bg-red-50 text-red-700 border-red-200'
    };
    return variants[severity as keyof typeof variants] || variants.info;
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      super_admin: 'bg-purple-50 text-purple-700 border-purple-200',
      finance_admin: 'bg-green-50 text-green-700 border-green-200',
      auditor: 'bg-blue-50 text-blue-700 border-blue-200',
      support: 'bg-orange-50 text-orange-700 border-orange-200',
      system: 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return variants[role as keyof typeof variants] || variants.system;
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'payroll_upload':
        return SecurityIcons.Shield;
      case 'user_suspended':
      case 'user_activated':
        return SecurityIcons.AlertTriangle;
      case 'pin_reset':
        return SecurityIcons.Unlock;
      case 'policy_update':
        return SecurityIcons.Shield;
      case 'withdrawal_approved':
      case 'withdrawal_denied':
        return SecurityIcons.CheckCircle;
      case 'report_generated':
        return UIIcons.FileText;
      case 'failed_login':
        return SecurityIcons.AlertTriangle;
      default:
        return MilitaryIcons.Info;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Audit & Activity Logs</h1>
        <p className="text-muted-foreground">
          Immutable audit trail of all administrative actions
        </p>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SecurityIcons.Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by actor, description, or resource ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value as any)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="all">All Severity</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="all">All Actions</option>
                {actionTypes.map(action => (
                  <option key={action} value={action}>
                    {action.replace(/_/g, ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredLogs.length} of {logs.length} log entries
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>Chronological log of all system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => {
              const ActionIcon = getActionIcon(log.action);
              
              return (
                <div
                  key={log.id}
                  className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedLog(log)}
                >
                  {/* Icon */}
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    log.severity === 'critical' ? 'bg-red-100' :
                    log.severity === 'warning' ? 'bg-amber-100' :
                    'bg-blue-100'
                  }`}>
                    <ActionIcon className={`h-5 w-5 ${
                      log.severity === 'critical' ? 'text-red-600' :
                      log.severity === 'warning' ? 'text-amber-600' :
                      'text-blue-600'
                    }`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="font-medium mb-1">{log.description}</div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-muted-foreground">{log.actorName}</span>
                          <Badge variant="secondary" className={getRoleBadge(log.actorRole)}>
                            {log.actorRole.replace('_', ' ')}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary" className={getSeverityBadge(log.severity)}>
                        {log.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <SecurityIcons.Shield className="h-3 w-3" />
                        {log.resource}
                      </span>
                      <span className="flex items-center gap-1">
                        <MilitaryIcons.Info className="h-3 w-3" />
                        {log.resourceId}
                      </span>
                      <span className="flex items-center gap-1">
                        <UIIcons.Clock className="h-3 w-3" />
                        {log.ipAddress}
                      </span>
                    </div>
                  </div>

                  {/* Expand Icon */}
                  <div className="flex-shrink-0 text-muted-foreground">
                    <UIIcons.ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              );
            })}

            {filteredLogs.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <SecurityIcons.Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No audit logs found matching your filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Log Detail Modal */}
      {selectedLog && (
        <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Audit Log Details</DialogTitle>
              <DialogDescription>Log ID: {selectedLog.id}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Timestamp</div>
                  <div className="font-medium">{new Date(selectedLog.timestamp).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Severity</div>
                  <Badge variant="secondary" className={getSeverityBadge(selectedLog.severity)}>
                    {selectedLog.severity}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Actor</div>
                  <div className="font-medium">{selectedLog.actorName}</div>
                  <Badge variant="secondary" className={`${getRoleBadge(selectedLog.actorRole)} mt-1`}>
                    {selectedLog.actorRole.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Action</div>
                  <div className="font-medium">{selectedLog.action.replace(/_/g, ' ').toUpperCase()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Resource</div>
                  <div className="font-medium">{selectedLog.resource}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Resource ID</div>
                  <div className="font-mono text-sm">{selectedLog.resourceId}</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="text-sm text-muted-foreground mb-1">Description</div>
                <div className="p-3 bg-muted/50 rounded-lg">{selectedLog.description}</div>
              </div>

              {/* Technical Details */}
              <div className="space-y-3">
                <div className="text-sm font-medium">Technical Details</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground mb-1">IP Address</div>
                    <div className="font-mono">{selectedLog.ipAddress}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Actor ID</div>
                    <div className="font-mono">{selectedLog.actor}</div>
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">User Agent</div>
                  <div className="font-mono text-xs bg-muted p-2 rounded break-all">{selectedLog.userAgent}</div>
                </div>
              </div>

              {/* Changes */}
              {selectedLog.changes && (
                <div>
                  <div className="text-sm font-medium mb-2">Change Details</div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(selectedLog.changes, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Security Notice */}
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <SecurityIcons.Shield className="h-4 w-4 text-primary" />
                  <span className="font-medium">Immutable Audit Record</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  This log entry is cryptographically sealed and cannot be modified or deleted.
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
