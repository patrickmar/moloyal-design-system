import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { MoLoyalAppBar } from "./MoLoyalAppBar";
import { UIIcons, SecurityIcons, FinanceIcons } from "./MoLoyalIcons";
import { NotificationSettings, User } from "./types";
import { MoLoyalToast } from "./MoLoyalToast";

interface MoLoyalNotificationSettingsProps {
  user: User;
  settings: NotificationSettings;
  onBack?: () => void;
  onSaveSettings?: (settings: NotificationSettings) => void;
}

export function MoLoyalNotificationSettings({
  user,
  settings: initialSettings,
  onBack,
  onSaveSettings,
}: MoLoyalNotificationSettingsProps) {
  const [settings, setSettings] = useState(initialSettings);

  const updateSetting = <T extends keyof NotificationSettings>(
    channel: T,
    field: keyof NotificationSettings[T],
    value: boolean
  ) => {
    // Create a deep copy of settings
    const newSettings: NotificationSettings = {
      ...settings,
      [channel]: {
        ...(settings[channel] as any),
        [field]: value,
      },
    };
    setSettings(newSettings);
    onSaveSettings?.(newSettings);
    MoLoyalToast.success("Settings Updated", "Notification preferences saved");
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <MoLoyalAppBar
        variant="with-back"
        title="Notification Settings"
        onBack={onBack}
        user={user}
      />

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Push Notifications */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <UIIcons.Bell className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Push Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive instant alerts on your device
                    </p>
                  </div>
                  <Switch
                    checked={settings.push.enabled}
                    onCheckedChange={(checked: boolean) =>
                      updateSetting("push", "enabled", checked)
                    }
                  />
                </div>

                {settings.push.enabled && (
                  <div className="mt-4 space-y-3 pl-4 border-l-2 border-muted">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <FinanceIcons.Receipt className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            Transactions
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Deposits, withdrawals, and payroll
                        </p>
                      </div>
                      <Switch
                        checked={settings.push.categories.transactions}
                        onCheckedChange={(checked: boolean) =>
                          setSettings({
                            ...settings,
                            push: {
                              ...settings.push,
                              categories: {
                                ...settings.push.categories,
                                transactions: checked,
                              },
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <FinanceIcons.Target className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Goals</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Milestones, contributions, and deadlines
                        </p>
                      </div>
                      <Switch
                        checked={settings.push.categories.goals}
                        onCheckedChange={(checked: boolean) =>
                          setSettings({
                            ...settings,
                            push: {
                              ...settings.push,
                              categories: {
                                ...settings.push.categories,
                                goals: checked,
                              },
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <SecurityIcons.Shield className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Security</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Login alerts and account changes
                        </p>
                      </div>
                      <Switch
                        checked={settings.push.categories.security}
                        onCheckedChange={(checked: boolean) =>
                          setSettings({
                            ...settings,
                            push: {
                              ...settings.push,
                              categories: {
                                ...settings.push.categories,
                                security: checked,
                              },
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <UIIcons.Megaphone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            Announcements
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Army updates and policy changes
                        </p>
                      </div>
                      <Switch
                        checked={settings.push.categories.announcements}
                        onCheckedChange={(checked: boolean) =>
                          setSettings({
                            ...settings,
                            push: {
                              ...settings.push,
                              categories: {
                                ...settings.push.categories,
                                announcements: checked,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* SMS Notifications */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <UIIcons.Message className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">SMS Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Text messages to +234 ••• ••• {user.service_no.slice(-4)}
                    </p>
                  </div>
                  <Switch
                    checked={settings.sms.enabled}
                    onCheckedChange={(checked: boolean) =>
                      updateSetting("sms", "enabled", checked)
                    }
                  />
                </div>

                {settings.sms.enabled && (
                  <div className="mt-4 space-y-3 pl-4 border-l-2 border-muted">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <FinanceIcons.Receipt className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            Transactions
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          High-value transactions only
                        </p>
                      </div>
                      <Switch
                        checked={settings.sms.categories.transactions}
                        onCheckedChange={(checked: boolean) =>
                          setSettings({
                            ...settings,
                            sms: {
                              ...settings.sms,
                              categories: {
                                ...settings.sms.categories,
                                transactions: checked,
                              },
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <SecurityIcons.Shield className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Security</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          OTP codes and login alerts
                        </p>
                      </div>
                      <Switch
                        checked={settings.sms.categories.security}
                        onCheckedChange={(checked: boolean) =>
                          setSettings({
                            ...settings,
                            sms: {
                              ...settings.sms,
                              categories: {
                                ...settings.sms.categories,
                                security: checked,
                              },
                            },
                          })
                        }
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                      <div className="flex gap-2">
                        <UIIcons.Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-blue-900 font-medium">
                            SMS Charges Apply
                          </p>
                          <p className="text-xs text-blue-700 mt-1">
                            Standard carrier rates may apply. Security SMS are
                            always free.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Email Notifications */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <UIIcons.Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      {user.service_no}@army.mil.ng
                    </p>
                  </div>
                  <Switch
                    checked={settings.email.enabled}
                    onCheckedChange={(checked: boolean) =>
                      updateSetting("email", "enabled", checked)
                    }
                  />
                </div>

                {settings.email.enabled && (
                  <div className="mt-4 space-y-3 pl-4 border-l-2 border-muted">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <FinanceIcons.Receipt className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            Transactions
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Monthly statements and receipts
                        </p>
                      </div>
                      <Switch
                        checked={settings.email.categories.transactions}
                        onCheckedChange={(checked: boolean) =>
                          setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              categories: {
                                ...settings.email.categories,
                                transactions: checked,
                              },
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <FinanceIcons.Target className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Goals</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Progress reports and tips
                        </p>
                      </div>
                      <Switch
                        checked={settings.email.categories.goals}
                        onCheckedChange={(checked: boolean) =>
                          setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              categories: {
                                ...settings.email.categories,
                                goals: checked,
                              },
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <SecurityIcons.Shield className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Security</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Account activity and alerts
                        </p>
                      </div>
                      <Switch
                        checked={settings.email.categories.security}
                        onCheckedChange={(checked: boolean) =>
                          setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              categories: {
                                ...settings.email.categories,
                                security: checked,
                              },
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <UIIcons.Megaphone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            Announcements
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Policy updates and news
                        </p>
                      </div>
                      <Switch
                        checked={settings.email.categories.announcements}
                        onCheckedChange={(checked: boolean) =>
                          setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              categories: {
                                ...settings.email.categories,
                                announcements: checked,
                              },
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <UIIcons.Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            Weekly Summary
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Every Monday with account overview
                        </p>
                      </div>
                      <Switch
                        checked={settings.email.categories.weekly_summary}
                        onCheckedChange={(checked: boolean) =>
                          setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              categories: {
                                ...settings.email.categories,
                                weekly_summary: checked,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <UIIcons.Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">About Notifications</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  You can customize how you receive updates from MoLoyal.
                  Security notifications are always enabled to keep your account
                  safe. All settings are saved automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
