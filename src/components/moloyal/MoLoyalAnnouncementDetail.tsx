import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { MoLoyalAppBar } from './MoLoyalAppBar';
import { MoLoyalButton } from './MoLoyalButton';
import { UIIcons, FinanceIcons, SecurityIcons, MilitaryIcons } from './MoLoyalIcons';
import { ArmyAnnouncement, User } from './types';

interface MoLoyalAnnouncementDetailProps {
  announcement: ArmyAnnouncement;
  user: User;
  onBack?: () => void;
  onDownloadAttachment?: (attachmentId: string) => void;
}

export function MoLoyalAnnouncementDetail({
  announcement,
  user,
  onBack,
  onDownloadAttachment
}: MoLoyalAnnouncementDetailProps) {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getPriorityBadge = (priority: string) => {
    const config = {
      urgent: { label: 'URGENT', className: 'bg-destructive text-destructive-foreground' },
      high: { label: 'High Priority', className: 'bg-orange-500 text-white' },
      medium: { label: 'Medium Priority', className: 'bg-blue-500 text-white' },
      low: { label: 'Info', className: 'bg-muted text-muted-foreground' }
    };
    return config[priority as keyof typeof config] || config.low;
  };

  const renderBody = (body: string) => {
    // Simple markdown-like rendering
    const lines = body.split('\\n');
    return lines.map((line, index) => {
      // Bold text **text**
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <h3 key={index} className="font-semibold mt-4 mb-2">
            {line.replace(/\*\*/g, '')}
          </h3>
        );
      }
      // Bullet points
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <li key={index} className="ml-4 text-sm text-foreground mb-1">
            {line.substring(2)}
          </li>
        );
      }
      // Checkmarks
      if (line.startsWith('✅ ')) {
        return (
          <div key={index} className="flex items-start gap-2 mb-2">
            <span className="text-green-600 flex-shrink-0">✅</span>
            <span className="text-sm text-foreground">{line.substring(2)}</span>
          </div>
        );
      }
      // Empty lines
      if (line.trim() === '') {
        return <div key={index} className="h-2" />;
      }
      // Regular text
      return (
        <p key={index} className="text-sm text-foreground mb-2">
          {line}
        </p>
      );
    });
  };

  const getTargetAudienceText = () => {
    if (announcement.targetAudience.type === 'all') {
      return 'All Personnel';
    }
    if (announcement.targetAudience.type === 'rank' && announcement.targetAudience.ranks) {
      return announcement.targetAudience.ranks.join(', ');
    }
    if (announcement.targetAudience.type === 'regiment' && announcement.targetAudience.regiments) {
      return announcement.targetAudience.regiments.join(', ');
    }
    if (announcement.targetAudience.type === 'custom') {
      return `${announcement.targetAudience.customUserIds?.length || 0} personnel`;
    }
    return 'Unknown';
  };

  const priorityBadge = getPriorityBadge(announcement.priority);

  return (
    <div className="h-full flex flex-col bg-background">
      <MoLoyalAppBar
        variant="with-back"
        title="Announcement"
        onBack={onBack}
        user={user}
      />

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                announcement.priority === 'urgent'
                  ? 'bg-destructive/10 text-destructive'
                  : announcement.priority === 'high'
                  ? 'bg-accent/10 text-accent-foreground'
                  : 'bg-primary/10 text-primary'
              }`}>
                <UIIcons.Megaphone className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <Badge className={priorityBadge.className}>
                  {priorityBadge.label}
                </Badge>
                <h1 className="mt-2 font-semibold">{announcement.title}</h1>
              </div>
            </div>

            {/* Meta Information */}
            <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <SecurityIcons.User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">From:</span>
                <span className="font-medium">{announcement.createdBy}</span>
              </div>
              <div className="flex items-center gap-2">
                <UIIcons.Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">Published:</span>
                <span className="font-medium">
                  {announcement.publishedAt ? formatDate(announcement.publishedAt) : 'Not published'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <UIIcons.Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">Target:</span>
                <span className="font-medium">{getTargetAudienceText()}</span>
              </div>
              {announcement.expiresAt && (
                <div className="flex items-center gap-2">
                  <UIIcons.Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground">Expires:</span>
                  <span className="font-medium">{formatDate(announcement.expiresAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="bg-card border rounded-lg p-4">
            <div className="prose prose-sm max-w-none">
              {renderBody(announcement.body)}
            </div>
          </div>

          {/* Attachments */}
          {announcement.attachments && announcement.attachments.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <UIIcons.Paperclip className="h-5 w-5" />
                Attachments ({announcement.attachments.length})
              </h3>
              <div className="space-y-2">
                {announcement.attachments.map((attachment) => (
                  <button
                    key={attachment.id}
                    onClick={() => onDownloadAttachment?.(attachment.id)}
                    className="w-full bg-card border rounded-lg p-3 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        {attachment.type === 'pdf' ? (
                          <UIIcons.Document className="h-5 w-5 text-primary" />
                        ) : attachment.type === 'link' ? (
                          <UIIcons.Link className="h-5 w-5 text-primary" />
                        ) : (
                          <UIIcons.Image className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{attachment.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs uppercase">
                            {attachment.type}
                          </Badge>
                          {attachment.size && (
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(attachment.size)}
                            </span>
                          )}
                        </div>
                      </div>
                      <UIIcons.ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Analytics (if available) */}
          {announcement.analytics && (
            <div className="bg-muted/30 border rounded-lg p-4 space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <FinanceIcons.Chart className="h-5 w-5" />
                Delivery Stats
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-card rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {announcement.analytics.delivered.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Delivered</div>
                </div>
                <div className="bg-card rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-accent-foreground">
                    {announcement.analytics.opened.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Opened</div>
                </div>
              </div>
              <div className="text-xs text-center text-muted-foreground">
                {Math.round((announcement.analytics.opened / announcement.analytics.delivered) * 100)}% open rate
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <MoLoyalButton variant="secondary" className="flex-1">
              <UIIcons.Share className="h-4 w-4 mr-2" />
              Share
            </MoLoyalButton>
            <MoLoyalButton variant="ghost" className="flex-1">
              <UIIcons.Bookmark className="h-4 w-4 mr-2" />
              Save
            </MoLoyalButton>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}