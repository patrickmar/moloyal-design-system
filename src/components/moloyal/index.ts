// MoLoyal UI Kit - Complete Export Index
// This file serves as the main entry point for the MoLoyal Design System

// Core Types
export * from './types';
export * from './data';

// Components
export { MoLoyalButton } from './MoLoyalButton';
export type { MoLoyalButtonProps } from './MoLoyalButton';

export { MoLoyalInput } from './MoLoyalInput';
export type { MoLoyalInputProps } from './MoLoyalInput';

export { MoLoyalAvatar } from './MoLoyalAvatar';
export type { MoLoyalAvatarProps } from './MoLoyalAvatar';

export { MoLoyalAppBar } from './MoLoyalAppBar';
export type { MoLoyalAppBarProps } from './MoLoyalAppBar';

export { MoLoyalBottomNav } from './MoLoyalBottomNav';
export type { MoLoyalBottomNavProps } from './MoLoyalBottomNav';

export { MoLoyalProgressBar } from './MoLoyalProgressBar';
export type { MoLoyalProgressBarProps } from './MoLoyalProgressBar';

export { BalanceCard, GoalCard, TransactionRow } from './MoLoyalCards';
export type { BalanceCardProps, GoalCardProps, TransactionRowProps } from './MoLoyalCards';

export { MoLoyalBadge } from './MoLoyalBadge';
export type { MoLoyalBadgeProps } from './MoLoyalBadge';

export { MoLoyalModal, MoLoyalConfirmation } from './MoLoyalModal';
export type { MoLoyalModalProps, MoLoyalConfirmationProps } from './MoLoyalModal';

export { MoLoyalToast, showMoLoyalToast } from './MoLoyalToast';
export type { MoLoyalToastOptions } from './MoLoyalToast';

export { MoLoyalTable } from './MoLoyalTable';
export type { MoLoyalTableProps } from './MoLoyalTable';

// Agent App Components
export { MoLoyalAgentApp } from './MoLoyalAgentApp';
export { MoLoyalAgentLogin } from './MoLoyalAgentLogin';
export { MoLoyalAgentCashIn } from './MoLoyalAgentCashIn';
export { MoLoyalAgentCashOut } from './MoLoyalAgentCashOut';
export { MoLoyalAgentKYC } from './MoLoyalAgentKYC';
export { MoLoyalAgentReconciliation } from './MoLoyalAgentReconciliation';
export { MoLoyalAgentOfflineQueue } from './MoLoyalAgentOfflineQueue';

// Notification Components
export { MoLoyalNotificationsCenter } from './MoLoyalNotificationsCenter';
export { MoLoyalAnnouncementDetail } from './MoLoyalAnnouncementDetail';
export { MoLoyalNotificationSettings } from './MoLoyalNotificationSettings';
export { MoLoyalAdminAnnouncementComposer } from './MoLoyalAdminAnnouncementComposer';

// Utility Components
export { MoLoyalDemoBanner } from './MoLoyalDemoBanner';
export { MoLoyalAccessibilityChecklist } from './MoLoyalAccessibilityChecklist';
export { MoLoyalTestPlan } from './MoLoyalTestPlan';

// Icons
export { 
  MoLoyalLogo,
  FinanceIcons,
  MilitaryIcons,
  SecurityIcons,
  UIIcons,
  PrivateInsignia,
  CorporalInsignia,
  SergeantInsignia,
  LieutenantInsignia
} from './MoLoyalIcons';

// Design System Info
export const DESIGN_SYSTEM_VERSION = '1.0.0';
export const DESIGN_SYSTEM_NAME = 'MoLoyal Design System';
export const DESIGN_SYSTEM_DESCRIPTION = 'Military-grade fintech design system for Android + iOS';

// Accessibility Information
export const ACCESSIBILITY_NOTES = {
  colorContrast: 'All color combinations meet WCAG AA standards (4.5:1 contrast ratio)',
  focusManagement: 'All interactive elements have visible focus indicators',
  screenReader: 'Components include proper ARIA labels and semantic markup',
  keyboardNavigation: 'Full keyboard navigation support for all components',
  mobileAccessibility: 'Touch targets meet minimum 44px size requirements'
};

// Design Tokens Summary
export const DESIGN_TOKENS = {
  colors: {
    primary: '#0B6B40', // Army green
    accent: '#C69C18',  // Accent gold
    background: '#F4F6F8', // Background neutral
    surface: '#FFFFFF',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    danger: '#DC2626'
  },
  spacing: [4, 8, 12, 16, 24, 32, 40],
  borderRadius: {
    small: 8,
    medium: 12,
    large: 20
  },
  typography: {
    fontFamily: 'Inter',
    sizes: {
      headline: 24,
      subhead: 18,
      body: 16,
      caption: 12
    }
  },
  elevation: {
    cardShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
  }
};