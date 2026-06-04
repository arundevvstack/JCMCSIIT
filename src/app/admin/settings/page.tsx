import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Settings | JCMC SIIT',
  description: 'Learn more about Settings at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Settings" />;
}
