import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'International | JCMC SIIT',
  description: 'Learn more about International at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="International" />;
}
