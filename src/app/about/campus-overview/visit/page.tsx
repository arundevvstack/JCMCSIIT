import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Visit | JCMC SIIT',
  description: 'Learn more about Visit at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Visit" />;
}
