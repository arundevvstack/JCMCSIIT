import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Job Fair 26 | JCMC SIIT',
  description: 'Learn more about Job Fair 26 at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Job Fair 26" />;
}
