// MoLoyal Military & Finance Icon Collection
import {
  Wallet,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Shield,
  Star,
  Award,
  Crown,
  Banknote,
  Building2,
  Target,
  Lock,
  AlertTriangle,
  CheckCircle,
  Zap,
  Trophy,
  Medal,
  Flag,
  Users,
  FileText,
  Calendar,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  ArrowRightLeft,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  Share,
  Check,
  X,
  Info,
  Phone,
  Unlock,
  Fingerprint,
  MapPin,
  Clock,
  Calculator,
  ChevronRight,
  RefreshCw,
  QrCode,
  Wifi,
  Download,
  Receipt,
  Megaphone,
  MessageSquare,
  Paperclip,
  Mail,
  FileText as Document,
  Plus,
  Edit,
  Trash2,
  Send,
  EyeIcon,
  Save,
  Eye,
  Camera,
  User,
  Link,
  Image,
  Bookmark,
  BarChart3,
  Hand,
  Globe,
  UserPlus,
  Home,
  Badge as BadgeIcon,
  Store,
  Clipboard,
  List,
  Lightbulb,
  Key,
  Bug,
} from "lucide-react";

// Finance Icons
export const FinanceIcons = {
  Wallet,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Banknote,
  Bank: Building2,
  Target,
  Transaction: ArrowRightLeft,
  ArrowDown,
  ArrowUp,
  Calculator,
  Download,
  Receipt,
  Chart: BarChart3,
};

// Military Icons
export const MilitaryIcons = {
  Shield,
  Star,
  Award,
  Crown,
  Trophy,
  Medal,
  Flag,
  Users,
  Location: MapPin,
  MapPin,
  Document,
  Info,
  Contact: Phone,
  QrCode,
  Building: Building2,
};

// Security Icons
export const SecurityIcons = {
  Shield,
  Lock,
  Unlock,
  Eye,
  AlertTriangle,
  Alert: AlertTriangle,
  CheckCircle,
  Zap,
  Fingerprint,
  User,
  Settings,
  UserPlus,
  Key,
  Bug,
};

// UI Icons
export const UIIcons = {
  FileText,
  Document,
  Calendar,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  ArrowLeft,
  ArrowRight,
  Share,
  Check,
  X,
  Close: X,
  Info,
  Clock,
  CheckCircle,
  ChevronRight,
  RefreshCw,
  Wifi,
  Megaphone,
  Message: MessageSquare,
  Paperclip,
  Mail,
  Plus,
  Edit,
  Trash: Trash2,
  Send,
  EyeIcon,
  Save,
  Eye,
  Camera,
  User,
  Users,
  Link,
  Image,
  Bookmark,
  Hand,
  Globe,
  Home,
  Badge: BadgeIcon,
  Store,
  Clipboard,
  List,
  Lightbulb,
  Key,
  Bug,
};

// Rank Insignia Icons (styled components)
interface RankInsigniaProps {
  size?: number;
  className?: string;
}

export const PrivateInsignia: React.FC<RankInsigniaProps> = ({
  size = 24,
  className,
}) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <rect x="11" y="8" width="2" height="8" rx="1" />
  </svg>
);

export const CorporalInsignia: React.FC<RankInsigniaProps> = ({
  size = 24,
  className,
}) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <rect x="9" y="8" width="2" height="8" rx="1" />
    <rect x="13" y="8" width="2" height="8" rx="1" />
  </svg>
);

export const SergeantInsignia: React.FC<RankInsigniaProps> = ({
  size = 24,
  className,
}) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <rect x="7" y="8" width="2" height="8" rx="1" />
    <rect x="11" y="8" width="2" height="8" rx="1" />
    <rect x="15" y="8" width="2" height="8" rx="1" />
  </svg>
);

export const LieutenantInsignia: React.FC<RankInsigniaProps> = ({
  size = 24,
  className,
}) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 6l2 4h-4l2-4z" />
  </svg>
);

// MoLoyal Logo Component
interface MoLoyalLogoProps {
  size?: number;
  variant?: "full" | "icon";
  className?: string;
}

export const MoLoyalLogo: React.FC<MoLoyalLogoProps> = ({
  size = 32,
  variant = "icon",
  className,
}) => {
  if (variant === "icon") {
    return (
      <div
        className={`bg-primary rounded-md flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <span
          className="text-primary-foreground font-bold"
          style={{ fontSize: size * 0.4 }}
        >
          Mo
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="bg-primary rounded-md flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span
          className="text-primary-foreground font-bold"
          style={{ fontSize: size * 0.4 }}
        >
          Mo
        </span>
      </div>
      <span className="font-bold text-primary" style={{ fontSize: size * 0.6 }}>
        MoLoyal
      </span>
    </div>
  );
};

export { MoLoyalLogo as default };
