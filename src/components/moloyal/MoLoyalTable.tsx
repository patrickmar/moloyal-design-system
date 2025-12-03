import { cn } from '../ui/utils';
import { ChevronUp, ChevronDown, MoreHorizontal } from 'lucide-react';
import { MoLoyalAvatar } from './MoLoyalAvatar';
import { MoLoyalBadge } from './MoLoyalBadge';
import { User } from './types';

interface MoLoyalTableProps {
  data: User[];
  className?: string;
  onSort?: (field: keyof User, direction: 'asc' | 'desc') => void;
  sortField?: keyof User;
  sortDirection?: 'asc' | 'desc';
}

interface ColumnConfig {
  key: keyof User;
  label: string;
  sortable?: boolean;
  render?: (value: any, user: User) => React.ReactNode;
}

const MoLoyalTable: React.FC<MoLoyalTableProps> = ({
  data,
  className,
  onSort,
  sortField,
  sortDirection
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const columns: ColumnConfig[] = [
    {
      key: 'name',
      label: 'Personnel',
      sortable: true,
      render: (_, user) => (
        <div className="flex items-center gap-3">
          <MoLoyalAvatar
            src={user.avatar}
            name={user.name}
            rank={user.rank as any}
            size="sm"
          />
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.service_no}</div>
          </div>
        </div>
      )
    },
    {
      key: 'rank',
      label: 'Rank',
      sortable: true,
      render: (rank) => <MoLoyalBadge rank={rank as any} size="sm" />
    },
    {
      key: 'allocation',
      label: 'Monthly Allocation',
      sortable: true,
      render: (allocation) => (
        <span className="font-medium">{formatCurrency(allocation)}</span>
      )
    }
  ];

  const handleSort = (field: keyof User) => {
    if (!onSort) return;
    
    const newDirection = 
      sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(field, newDirection);
  };

  return (
    <div className={cn('bg-card border border-border rounded-lg shadow-sm overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-left text-sm font-medium text-muted-foreground',
                    column.sortable && 'cursor-pointer hover:text-foreground select-none'
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          className={cn(
                            'h-3 w-3 -mb-1',
                            sortField === column.key && sortDirection === 'asc'
                              ? 'text-primary' 
                              : 'text-muted-foreground/50'
                          )} 
                        />
                        <ChevronDown 
                          className={cn(
                            'h-3 w-3',
                            sortField === column.key && sortDirection === 'desc'
                              ? 'text-primary'
                              : 'text-muted-foreground/50'
                          )} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              <th className="w-12 px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((user, index) => (
              <tr 
                key={user.service_no || index}
                className="hover:bg-muted/25 transition-colors"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3">
                    {column.render 
                      ? column.render(user[column.key], user)
                      : user[column.key]
                    }
                  </td>
                ))}
                <td className="px-4 py-3">
                  <button 
                    className="p-1 hover:bg-muted rounded"
                    aria-label="More actions"
                  >
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length === 0 && (
        <div className="px-4 py-8 text-center text-muted-foreground">
          No personnel data available
        </div>
      )}
    </div>
  );
};

export { MoLoyalTable };
export type { MoLoyalTableProps };