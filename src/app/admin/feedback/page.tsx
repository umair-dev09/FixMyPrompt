import { FeedbackDashboard } from '@/components/feedback-dashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feedback Dashboard | FixMyPrompt Admin',
  description: 'Admin dashboard for viewing user feedback and analytics',
  robots: 'noindex, nofollow', // Don't index admin pages
};

export default function FeedbackDashboardPage() {
  return <FeedbackDashboard />;
}
