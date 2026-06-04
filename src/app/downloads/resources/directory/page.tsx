import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Directory | JCMC SIIT',
  description: 'Learn more about Directory at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Directory" />;
}
