import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { MoLoyalAppBar } from "./MoLoyalAppBar";
import { FinanceIcons, SecurityIcons, UIIcons } from "./MoLoyalIcons";
import { Notification, ArmyAnnouncement, User } from "./types";
import { MoLoyalButton } from "./MoLoyalButton";

interface MoLoyalNotificationsCenterProps {
  user: User;
  notifications: Notification[];
  announcements: ArmyAnnouncement[];
  onBack?: () => void;
  onNotificationClick?: (notification: Notification) => void;
  onAnnouncementClick?: (announcement: ArmyAnnouncement) => void;
  onSettingsClick?: () => void;
  onMarkAllRead?: () => void;
}

export function MoLoyalNotificationsCenter({
  user,
  notifications,
  announcements,
  onBack,
  onNotificationClick,
  onAnnouncementClick,
  onSettingsClick,
  onMarkAllRead,
}: MoLoyalNotificationsCenterProps) {
  const [activeTab, setActiveTab] = useState<"system" | "announcements">(
    "system"
  );

  const systemNotifications = notifications.filter((n) => n.type === "system");
  const unreadSystemCount = systemNotifications.filter((n) => !n.read).length;

  const publishedAnnouncements = announcements.filter(
    (a) => a.status === "published"
  );
  const unreadAnnouncementIds = notifications
    .filter((n) => n.type === "announcement" && !n.read)
    .map((n) => n.id);
  const unreadAnnouncementsCount = unreadAnnouncementIds.length;

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "urgent":
        return "bg-destructive/10 text-destructive border-destructive/30";
      case "high":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "medium":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "transaction":
        return <FinanceIcons.Receipt className="h-5 w-5" />;
      case "goal":
        return <FinanceIcons.Target className="h-5 w-5" />;
      case "security":
        return <SecurityIcons.Shield className="h-5 w-5" />;
      case "policy":
        return <UIIcons.Document className="h-5 w-5" />;
      default:
        return <UIIcons.Bell className="h-5 w-5" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <MoLoyalAppBar
        variant="with-back"
        title="Notifications"
        onBack={onBack}
        user={user}
      />

      <div className="flex items-center justify-between px-4 py-3 border-b bg-card">
        <div className="flex items-center gap-2">
          <UIIcons.Bell className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold">
            {activeTab === "system"
              ? "System Notifications"
              : "Army Announcements"}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {(unreadSystemCount > 0 || unreadAnnouncementsCount > 0) && (
            <MoLoyalButton variant="ghost" size="small" onClick={onMarkAllRead}>
              Mark all read
            </MoLoyalButton>
          )}
          <button
            onClick={onSettingsClick}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Notification settings"
          >
            <UIIcons.Settings className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value: string) =>
          setActiveTab(value as "system" | "announcements")
        }
        className="flex-1 flex flex-col"
      >
        <div className="border-b bg-card px-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="system" className="relative">
              System
              {unreadSystemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {unreadSystemCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="announcements" className="relative">
              Announcements
              {unreadAnnouncementsCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {unreadAnnouncementsCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="system" className="flex-1 m-0">
          <ScrollArea className="h-full">
            {systemNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <UIIcons.Bell className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No notifications yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You'll see updates about your account here
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {systemNotifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => onNotificationClick?.(notification)}
                    className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                      !notification.read ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          notification.priority === "urgent"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-muted"
                        }`}
                      >
                        {getCategoryIcon(notification.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4
                            className={`font-medium ${
                              !notification.read ? "font-semibold" : ""
                            }`}
                          >
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {notification.priority &&
                            notification.priority !== "low" && (
                              <Badge
                                variant="secondary"
                                className={`text-xs ${getPriorityColor(
                                  notification.priority
                                )}`}
                              >
                                {notification.priority}
                              </Badge>
                            )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="announcements" className="flex-1 m-0">
          <ScrollArea className="h-full">
            {publishedAnnouncements.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <UIIcons.Megaphone className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No announcements yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Official army announcements will appear here
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {publishedAnnouncements.map((announcement) => {
                  const isUnread = unreadAnnouncementIds.includes(
                    `N${announcement.id.slice(3)}`
                  );

                  return (
                    <button
                      key={announcement.id}
                      onClick={() => onAnnouncementClick?.(announcement)}
                      className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                        isUnread ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            announcement.priority === "urgent"
                              ? "bg-destructive/10 text-destructive"
                              : announcement.priority === "high"
                              ? "bg-accent/10 text-accent-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <UIIcons.Megaphone className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4
                              className={`font-medium ${
                                isUnread ? "font-semibold" : ""
                              }`}
                            >
                              {announcement.title}
                            </h4>
                            {isUnread && (
                              <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {announcement.body.substring(0, 120)}...
                          </p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="text-xs text-muted-foreground">
                              {announcement.publishedAt
                                ? formatTimestamp(announcement.publishedAt)
                                : "Draft"}
                            </span>
                            {announcement.attachments &&
                              announcement.attachments.length > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  <UIIcons.Paperclip className="h-3 w-3 mr-1" />
                                  {announcement.attachments.length}
                                </Badge>
                              )}
                            {announcement.priority &&
                              announcement.priority !== "low" && (
                                <Badge
                                  variant="secondary"
                                  className={`text-xs ${getPriorityColor(
                                    announcement.priority
                                  )}`}
                                >
                                  {announcement.priority}
                                </Badge>
                              )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
