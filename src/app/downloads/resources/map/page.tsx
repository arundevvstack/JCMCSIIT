import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Map | JCMC SIIT',
  description: 'Learn more about Map at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Map" />;
}
