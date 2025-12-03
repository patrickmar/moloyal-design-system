import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { MoLoyalButton } from './MoLoyalButton';
import { MoLoyalToast } from './MoLoyalToast';
import { MilitaryIcons, SecurityIcons, UIIcons, FinanceIcons } from './MoLoyalIcons';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { formatCurrency } from './data';

interface ExtendedUser {
  name: string;
  rank: string;
  service_no: string;
  email: string;
  phone: string;
  regiment: string;
  branch: string;
  kycStatus: 'verified' | 'pending' | 'rejected';
  accountStatus: 'active' | 'suspended' | 'locked';
  balance: number;
  lockedBalance: number;
  lastLogin: string;
  createdAt: string;
  avatar?: string | null;
  suspendedAt?: string | null;
  suspendedBy?: string | null;
  suspensionReason?: string | null;
}

interface MoLoyalAdminUserManagementProps {
  users: ExtendedUser[];
  onUserAction: (userId: string, action: string, reason?: string) => void;
}

export function MoLoyalAdminUserManagement({ users, onUserAction }: MoLoyalAdminUserManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended'>('all');
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'suspend' | 'reset_pin' | 'unlock' | null>(null);
  const [actionReason, setActionReason] = useState('');

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.service_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || 
      user.accountStatus === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleUserAction = (action: 'suspend' | 'reset_pin' | 'unlock', user: ExtendedUser) => {
    setSelectedUser(user);
    setActionType(action);
    setShowActionModal(true);
  };

  const confirmAction = () => {
    if (!selectedUser || !actionType) return;

    onUserAction(selectedUser.service_no, actionType, actionReason);
    
    const actionLabels = {
      suspend: 'Account Suspended',
      reset_pin: 'PIN Reset',
      unlock: 'Account Unlocked'
    };
    
    MoLoyalToast.success(actionLabels[actionType], `Action completed for ${selectedUser.name}`);
    setShowActionModal(false);
    setSelectedUser(null);
    setActionType(null);
    setActionReason('');
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-50 text-green-700 border-green-200',
      suspended: 'bg-red-50 text-red-700 border-red-200',
      locked: 'bg-amber-50 text-amber-700 border-amber-200'
    };
    return variants[status as keyof typeof variants] || variants.active;
  };

  const getKYCBadge = (status: string) => {
    const variants = {
      verified: 'bg-green-50 text-green-700 border-green-200',
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      rejected: 'bg-red-50 text-red-700 border-red-200'
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">
          Search, view, and manage user accounts
        </p>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MilitaryIcons.Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, service number, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
              <MoLoyalButton variant="secondary">
                <FinanceIcons.Download className="h-4 w-4 mr-2" />
                Export
              </MoLoyalButton>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Personnel Directory</CardTitle>
          <CardDescription>View and manage user account details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium">Service No.</th>
                  <th className="text-left p-3 text-sm font-medium">Name & Rank</th>
                  <th className="text-left p-3 text-sm font-medium">Regiment</th>
                  <th className="text-left p-3 text-sm font-medium">Balance</th>
                  <th className="text-center p-3 text-sm font-medium">KYC</th>
                  <th className="text-center p-3 text-sm font-medium">Status</th>
                  <th className="text-center p-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.service_no} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      <div className="font-mono text-sm">{user.service_no}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.rank}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">{user.regiment}</div>
                      <div className="text-xs text-muted-foreground">{user.branch}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{formatCurrency(user.balance)}</div>
                      {user.lockedBalance > 0 && (
                        <div className="text-xs text-amber-600">
                          {formatCurrency(user.lockedBalance)} locked
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="secondary" className={getKYCBadge(user.kycStatus)}>
                        {user.kycStatus}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="secondary" className={getStatusBadge(user.accountStatus)}>
                        {user.accountStatus}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="View Details"
                        >
                          <UIIcons.FileText className="h-4 w-4" />
                        </button>
                        {user.accountStatus === 'active' && (
                          <button
                            onClick={() => handleUserAction('suspend', user)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                            title="Suspend Account"
                          >
                            <SecurityIcons.AlertTriangle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleUserAction('reset_pin', user)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                          title="Reset PIN"
                        >
                          <SecurityIcons.Unlock className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <MilitaryIcons.Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No users found matching your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Detail Modal */}
      {selectedUser && !showActionModal && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>{selectedUser.service_no}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Name</div>
                  <div className="font-medium">{selectedUser.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Rank</div>
                  <div className="font-medium">{selectedUser.rank}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Email</div>
                  <div className="font-medium text-sm">{selectedUser.email}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Phone</div>
                  <div className="font-medium">{selectedUser.phone}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Regiment</div>
                  <div className="font-medium text-sm">{selectedUser.regiment}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Branch</div>
                  <div className="font-medium">{selectedUser.branch}</div>
                </div>
              </div>

              {/* Account Balance */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Total Balance</div>
                    <div className="text-xl font-bold">{formatCurrency(selectedUser.balance)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Locked Balance</div>
                    <div className="text-xl font-bold text-amber-600">{formatCurrency(selectedUser.lockedBalance)}</div>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">KYC Status</span>
                  <Badge variant="secondary" className={getKYCBadge(selectedUser.kycStatus)}>
                    {selectedUser.kycStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Account Status</span>
                  <Badge variant="secondary" className={getStatusBadge(selectedUser.accountStatus)}>
                    {selectedUser.accountStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Login</span>
                  <span className="text-sm">{new Date(selectedUser.lastLogin).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Account Created</span>
                  <span className="text-sm">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Suspension Info */}
              {selectedUser.accountStatus === 'suspended' && selectedUser.suspensionReason && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="font-medium text-red-700 mb-1">Account Suspended</div>
                  <div className="text-sm text-red-600 mb-2">{selectedUser.suspensionReason}</div>
                  <div className="text-xs text-red-500">
                    Suspended {selectedUser.suspendedAt && `on ${new Date(selectedUser.suspendedAt).toLocaleDateString()}`}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                {selectedUser.accountStatus === 'active' ? (
                  <MoLoyalButton 
                    variant="danger"
                    onClick={() => {
                      handleUserAction('suspend', selectedUser);
                      setSelectedUser(null);
                    }}
                  >
                    <SecurityIcons.AlertTriangle className="h-4 w-4 mr-2" />
                    Suspend Account
                  </MoLoyalButton>
                ) : (
                  <MoLoyalButton 
                    variant="primary"
                    onClick={() => {
                      handleUserAction('unlock', selectedUser);
                      setSelectedUser(null);
                    }}
                  >
                    <SecurityIcons.Unlock className="h-4 w-4 mr-2" />
                    Unlock Account
                  </MoLoyalButton>
                )}
                <MoLoyalButton 
                  variant="secondary"
                  onClick={() => {
                    handleUserAction('reset_pin', selectedUser);
                    setSelectedUser(null);
                  }}
                >
                  <SecurityIcons.Unlock className="h-4 w-4 mr-2" />
                  Reset PIN
                </MoLoyalButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Action Confirmation Modal */}
      {showActionModal && selectedUser && actionType && (
        <Dialog open={showActionModal} onOpenChange={setShowActionModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === 'suspend' && 'Suspend Account'}
                {actionType === 'reset_pin' && 'Reset PIN'}
                {actionType === 'unlock' && 'Unlock Account'}
              </DialogTitle>
              <DialogDescription>
                {selectedUser.name} ({selectedUser.service_no})
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {actionType === 'suspend' && 'This will suspend the user account and prevent access to MoLoyal services.'}
                {actionType === 'reset_pin' && 'This will reset the user\'s PIN. They will need to set a new PIN on next login.'}
                {actionType === 'unlock' && 'This will unlock the user account and restore full access.'}
              </p>

              {actionType === 'suspend' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Reason for Suspension *</label>
                  <textarea
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    className="w-full p-2 border rounded-lg min-h-[100px]"
                    placeholder="Enter reason for suspension..."
                    required
                  />
                </div>
              )}

              {actionType === 'reset_pin' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="text-sm text-amber-700">
                    User will receive an SMS with reset instructions
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <MoLoyalButton variant="ghost" onClick={() => setShowActionModal(false)}>
                  Cancel
                </MoLoyalButton>
                <MoLoyalButton 
                  variant={actionType === 'suspend' ? 'danger' : 'primary'}
                  onClick={confirmAction}
                  disabled={actionType === 'suspend' && !actionReason}
                >
                  Confirm
                </MoLoyalButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
