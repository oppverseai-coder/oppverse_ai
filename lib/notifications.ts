import { Opportunity } from '@/lib/types';

export interface AppNotification {
  id: string;
  type: 'deadline_urgent' | 'deadline_critical' | 'high_match' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  opportunityId?: string;
  daysRemaining?: number;
}

/**
 * Calculates deadline urgency alerts and high-affinity opportunity notifications
 */
export function generateOpportunityNotifications(opportunities: Opportunity[]): AppNotification[] {
  const notifications: AppNotification[] = [];
  const now = new Date();

  opportunities.forEach((opp) => {
    if (!opp.deadline) return;
    const deadlineDate = new Date(opp.deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const orgName = opp.provider || (opp as any).organization || 'Host Organization';

    if (diffDays > 0 && diffDays <= 2) {
      notifications.push({
        id: `notif-crit-${opp.id}`,
        type: 'deadline_critical',
        title: `CRITICAL: ${diffDays} day${diffDays === 1 ? '' : 's'} left`,
        message: `${opp.title} (${orgName}) is closing on ${opp.deadline}. Prepare your application immediately.`,
        timestamp: 'Just now',
        read: false,
        link: `/discover?id=${opp.id}`,
        opportunityId: opp.id,
        daysRemaining: diffDays
      });
    } else if (diffDays > 2 && diffDays <= 7) {
      notifications.push({
        id: `notif-urg-${opp.id}`,
        type: 'deadline_urgent',
        title: `CLOSING SOON: ${diffDays} days remaining`,
        message: `${opp.title} (${orgName}) deadline is approaching. Check tailored requirements.`,
        timestamp: 'Today',
        read: false,
        link: `/discover?id=${opp.id}`,
        opportunityId: opp.id,
        daysRemaining: diffDays
      });
    }
  });

  // Add sample system & match alerts
  notifications.unshift({
    id: 'notif-system-agent',
    type: 'high_match',
    title: 'New High-Affinity Opportunity Discovered',
    message: 'Autonomous Hunter matched you with "MIT Solve Global Climate Tech Accelerator 2026" (92% Fit).',
    timestamp: '10m ago',
    read: false,
    link: '/missions'
  });

  return notifications;
}
