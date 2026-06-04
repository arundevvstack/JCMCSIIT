import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Emergency | JCMC SIIT',
  description: 'Learn more about Emergency at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Emergency" />;
}
