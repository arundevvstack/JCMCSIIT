import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Centers | JCMC SIIT',
  description: 'Learn more about Centers at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Centers" />;
}
