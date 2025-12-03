import { useState, ReactNode } from "react"; // Added ReactNode import
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MoLoyalButton } from "./MoLoyalButton";
import { MoLoyalInput } from "./MoLoyalInput";
import { MoLoyalModal } from "./MoLoyalModal";
import { MoLoyalToast } from "./MoLoyalToast";
import { UIIcons, FinanceIcons, SecurityIcons } from "./MoLoyalIcons";
import { ArmyAnnouncement, Rank } from "./types";

interface MoLoyalAdminAnnouncementComposerProps {
  announcements: ArmyAnnouncement[];
  onCreateAnnouncement?: (announcement: Partial<ArmyAnnouncement>) => void;
  onPublishAnnouncement?: (id: string) => void;
  onDeleteDraft?: (id: string) => void;
}

export function MoLoyalAdminAnnouncementComposer({
  announcements,
  onCreateAnnouncement,
  onPublishAnnouncement,
  onDeleteDraft,
}: MoLoyalAdminAnnouncementComposerProps) {
  const [activeTab, setActiveTab] = useState<
    "compose" | "drafts" | "published"
  >("compose");

  // Composer state
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState<
    "low" | "medium" | "high" | "urgent"
  >("medium");
  const [targetType, setTargetType] = useState<
    "all" | "rank" | "regiment" | "custom"
  >("all");
  const [selectedRanks, setSelectedRanks] = useState<Rank[]>([]);
  const [selectedRegiments, setSelectedRegiments] = useState<string[]>([]);
  const [scheduleType, setScheduleType] = useState<"immediate" | "scheduled">(
    "immediate"
  );
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [showPreview, setShowPreview] = useState(false);
  const [editingDraft, setEditingDraft] = useState<string | null>(null);

  const ranks: Rank[] = ["Private", "Corporal", "Sergeant", "Lieutenant"];
  const regiments = [
    "1st Division Infantry",
    "2nd Brigade Artillery",
    "3rd Division Mechanized",
    "4th Brigade Engineering",
    "7th Division Infantry",
    "81st Division",
    "82nd Division",
  ];

  const draftAnnouncements = announcements.filter((a) => a.status === "draft");
  const publishedAnnouncements = announcements.filter(
    (a) => a.status === "published" || a.status === "scheduled"
  );

  const handleSaveDraft = () => {
    if (!title || !body) {
      MoLoyalToast.error("Missing Fields", "Please provide title and body");
      return;
    }

    const draft: Partial<ArmyAnnouncement> = {
      id: editingDraft || `ANN${Date.now()}`,
      title,
      body,
      priority,
      status: "draft",
      createdBy: "Admin User",
      createdAt: new Date().toISOString(),
      targetAudience: {
        type: targetType,
        ...(targetType === "rank" && { ranks: selectedRanks }),
        ...(targetType === "regiment" && { regiments: selectedRegiments }),
      },
      ...(scheduleType === "scheduled" &&
        scheduledDate && {
          scheduledSendDate: scheduledDate.toISOString(),
        }),
    };

    onCreateAnnouncement?.(draft);
    MoLoyalToast.success("Draft Saved", "Announcement saved to drafts");

    // Reset form
    setTitle("");
    setBody("");
    setPriority("medium");
    setTargetType("all");
    setSelectedRanks([]);
    setSelectedRegiments([]);
    setScheduleType("immediate");
    setScheduledDate(undefined);
    setEditingDraft(null);
  };

  const handlePublish = () => {
    if (!title || !body) {
      MoLoyalToast.error("Missing Fields", "Please provide title and body");
      return;
    }

    const announcement: Partial<ArmyAnnouncement> = {
      id: editingDraft || `ANN${Date.now()}`,
      title,
      body,
      priority,
      status: scheduleType === "scheduled" ? "scheduled" : "published",
      createdBy: "Admin User",
      createdAt: new Date().toISOString(),
      publishedAt:
        scheduleType === "immediate" ? new Date().toISOString() : undefined,
      targetAudience: {
        type: targetType,
        ...(targetType === "rank" && { ranks: selectedRanks }),
        ...(targetType === "regiment" && { regiments: selectedRegiments }),
      },
      ...(scheduleType === "scheduled" &&
        scheduledDate && {
          scheduledSendDate: scheduledDate.toISOString(),
        }),
      analytics:
        scheduleType === "immediate"
          ? {
              delivered: 0,
              opened: 0,
              clicked: 0,
              targetCount: getTargetCount(),
            }
          : undefined,
    };

    onCreateAnnouncement?.(announcement);

    if (scheduleType === "immediate") {
      MoLoyalToast.success(
        "Published!",
        `Announcement sent to ${getTargetCount().toLocaleString()} personnel`
      );
    } else {
      MoLoyalToast.success(
        "Scheduled!",
        `Announcement scheduled for ${scheduledDate?.toLocaleDateString()}`
      );
    }

    // Reset form
    setTitle("");
    setBody("");
    setPriority("medium");
    setTargetType("all");
    setSelectedRanks([]);
    setSelectedRegiments([]);
    setScheduleType("immediate");
    setScheduledDate(undefined);
    setEditingDraft(null);
    setActiveTab("published");
  };

  const getTargetCount = () => {
    if (targetType === "all") return 45678;
    if (targetType === "rank") {
      const rankCounts: Record<string, number> = {
        Private: 25000,
        Corporal: 12000,
        Sergeant: 6000,
        Lieutenant: 2678,
      };
      return selectedRanks.reduce(
        (sum, rank) => sum + (rankCounts[rank] || 0),
        0
      );
    }
    if (targetType === "regiment") {
      return selectedRegiments.length * 6500;
    }
    return 0;
  };

  const loadDraft = (draft: ArmyAnnouncement) => {
    setTitle(draft.title);
    setBody(draft.body);
    setPriority(draft.priority);
    setTargetType(draft.targetAudience.type);
    if (draft.targetAudience.ranks)
      setSelectedRanks(draft.targetAudience.ranks);
    if (draft.targetAudience.regiments)
      setSelectedRegiments(draft.targetAudience.regiments);
    if (draft.scheduledSendDate) {
      setScheduleType("scheduled");
      setScheduledDate(new Date(draft.scheduledSendDate));
    }
    setEditingDraft(draft.id);
    setActiveTab("compose");
    MoLoyalToast.info("Draft Loaded", "Continue editing your announcement");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Announcement Center</h2>
        <p className="text-muted-foreground">
          Create and manage announcements for military personnel
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v: string) =>
          setActiveTab(v as "compose" | "drafts" | "published")
        }
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compose">
            <UIIcons.Plus className="h-4 w-4 mr-2" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="drafts" className="relative">
            <UIIcons.Document className="h-4 w-4 mr-2" />
            Drafts
            {draftAnnouncements.length > 0 && (
              <Badge className="ml-2">{draftAnnouncements.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="published">
            <UIIcons.Check className="h-4 w-4 mr-2" />
            Published
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingDraft ? "Edit Draft" : "New Announcement"}
              </CardTitle>
              <CardDescription>
                Compose an announcement to send to personnel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <MoLoyalInput
                label="Title"
                placeholder="e.g., Enhanced Withdrawal Limits for All Ranks"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              {/* Body */}
              <div className="space-y-2">
                <label className="block font-medium">Message Body</label>
                <textarea
                  className="w-full min-h-[300px] p-3 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring font-[var(--font-family)]"
                  placeholder="Write your announcement here...&#10;&#10;**Use markdown for formatting:**&#10;- **Bold text** for headings&#10;- Bullet points with -&#10;- ✅ for checkmarks"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {body.length} characters • Supports basic markdown formatting
                </p>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="block font-medium">Priority Level</label>
                <div className="grid grid-cols-4 gap-3">
                  {(["low", "medium", "high", "urgent"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        priority === p
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className="text-sm font-medium capitalize">{p}</div>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Target Audience */}
              <div className="space-y-4">
                <label className="block font-medium">Target Audience</label>

                <Select
                  value={targetType}
                  onValueChange={(v: "all" | "rank" | "regiment" | "custom") =>
                    setTargetType(v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      All Personnel ({getTargetCount().toLocaleString()})
                    </SelectItem>
                    <SelectItem value="rank">Specific Ranks</SelectItem>
                    <SelectItem value="regiment">Specific Regiments</SelectItem>
                    <SelectItem value="custom">Custom List</SelectItem>
                  </SelectContent>
                </Select>

                {targetType === "rank" && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Select target ranks:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {ranks.map((rank) => (
                        <Badge
                          key={rank}
                          variant={
                            selectedRanks.includes(rank)
                              ? "default"
                              : "secondary"
                          }
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedRanks((prev) =>
                              prev.includes(rank)
                                ? prev.filter((r) => r !== rank)
                                : [...prev, rank]
                            );
                          }}
                        >
                          {rank}
                        </Badge>
                      ))}
                    </div>
                    {selectedRanks.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Target: {getTargetCount().toLocaleString()} personnel
                      </p>
                    )}
                  </div>
                )}

                {targetType === "regiment" && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Select target regiments:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {regiments.map((regiment) => (
                        <Badge
                          key={regiment}
                          variant={
                            selectedRegiments.includes(regiment)
                              ? "default"
                              : "secondary"
                          }
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedRegiments((prev) =>
                              prev.includes(regiment)
                                ? prev.filter((r) => r !== regiment)
                                : [...prev, regiment]
                            );
                          }}
                        >
                          {regiment}
                        </Badge>
                      ))}
                    </div>
                    {selectedRegiments.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Target: ~{getTargetCount().toLocaleString()} personnel
                      </p>
                    )}
                  </div>
                )}

                {targetType === "custom" && (
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Custom list feature coming soon. Upload CSV with service
                      numbers.
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Scheduling */}
              <div className="space-y-4">
                <label className="block font-medium">Delivery</label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setScheduleType("immediate")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      scheduleType === "immediate"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <UIIcons.Send className="h-5 w-5 mx-auto mb-2" />
                    <div className="text-sm font-medium">Send Immediately</div>
                  </button>

                  <button
                    onClick={() => setScheduleType("scheduled")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      scheduleType === "scheduled"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <UIIcons.Calendar className="h-5 w-5 mx-auto mb-2" />
                    <div className="text-sm font-medium">Schedule</div>
                  </button>
                </div>

                {scheduleType === "scheduled" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <MoLoyalButton variant="secondary" className="w-full">
                        <UIIcons.Calendar className="h-4 w-4 mr-2" />
                        {scheduledDate
                          ? scheduledDate.toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Select Date & Time"}
                      </MoLoyalButton>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={scheduledDate}
                        onSelect={setScheduledDate}
                        disabled={(date: Date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <MoLoyalButton
                  variant="secondary"
                  onClick={handleSaveDraft}
                  className="flex-1"
                >
                  <UIIcons.Save className="h-4 w-4 mr-2" />
                  Save Draft
                </MoLoyalButton>
                <MoLoyalButton
                  onClick={() => setShowPreview(true)}
                  variant="ghost"
                  className="flex-1"
                >
                  <UIIcons.Eye className="h-4 w-4 mr-2" />
                  Preview
                </MoLoyalButton>
                <MoLoyalButton onClick={handlePublish} className="flex-1">
                  <UIIcons.Send className="h-4 w-4 mr-2" />
                  {scheduleType === "immediate" ? "Publish Now" : "Schedule"}
                </MoLoyalButton>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4 mt-6">
          {draftAnnouncements.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <UIIcons.Document className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No draft announcements</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Saved drafts will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            draftAnnouncements.map((draft) => (
              <Card key={draft.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{draft.title}</CardTitle>
                      <CardDescription className="mt-1">
                        Created {new Date(draft.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">Draft</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {draft.body.substring(0, 150)}...
                  </p>
                  <div className="flex gap-2">
                    <MoLoyalButton
                      size="small"
                      onClick={() => loadDraft(draft)}
                    >
                      <UIIcons.Edit className="h-4 w-4 mr-2" />
                      Edit
                    </MoLoyalButton>
                    <MoLoyalButton
                      size="small"
                      variant="danger"
                      onClick={() => onDeleteDraft?.(draft.id)}
                    >
                      <UIIcons.Trash className="h-4 w-4 mr-2" />
                      Delete
                    </MoLoyalButton>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="published" className="space-y-4 mt-6">
          <ScrollArea className="h-[600px]">
            {publishedAnnouncements.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <UIIcons.Check className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No published announcements
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Published announcements will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              publishedAnnouncements.map((announcement) => (
                <Card key={announcement.id} className="mb-4">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">
                            {announcement.title}
                          </CardTitle>
                          <Badge
                            variant={
                              announcement.status === "published"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {announcement.status}
                          </Badge>
                        </div>
                        <CardDescription>
                          By {announcement.createdBy} •{" "}
                          {announcement.publishedAt
                            ? new Date(
                                announcement.publishedAt
                              ).toLocaleDateString()
                            : "Not published yet"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {announcement.analytics && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-muted/50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-primary">
                            {announcement.analytics.delivered.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Delivered
                          </div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-accent-foreground">
                            {announcement.analytics.opened.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Opened
                          </div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {Math.round(
                              (announcement.analytics.opened /
                                announcement.analytics.delivered) *
                                100
                            )}
                            %
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Open Rate
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Preview Modal - Fixed with trigger prop */}
      {showPreview && (
        <MoLoyalModal
          trigger={
            <MoLoyalButton variant="ghost" onClick={() => setShowPreview(true)}>
              Preview
            </MoLoyalButton>
          }
          title="Announcement Preview"
          description="How your announcement will appear to recipients"
        >
          <div className="space-y-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <UIIcons.Megaphone className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <Badge
                    variant={
                      priority === "urgent" ? "destructive" : "secondary"
                    }
                    className="mb-2"
                  >
                    {priority.toUpperCase()}
                  </Badge>
                  <h3 className="font-semibold">
                    {title || "Announcement Title"}
                  </h3>
                </div>
              </div>
              <div className="whitespace-pre-wrap text-sm text-foreground">
                {body || "Announcement body will appear here..."}
              </div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Target: {getTargetCount().toLocaleString()} personnel
                </span>
                <span>
                  {scheduleType === "immediate"
                    ? "Immediate delivery"
                    : scheduledDate
                    ? `Scheduled: ${scheduledDate.toLocaleDateString()}`
                    : "No schedule set"}
                </span>
              </div>
            </div>
            <MoLoyalButton
              onClick={() => setShowPreview(false)}
              className="w-full"
            >
              Close Preview
            </MoLoyalButton>
          </div>
        </MoLoyalModal>
      )}
    </div>
  );
}
