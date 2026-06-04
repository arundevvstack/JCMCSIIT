import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Power Quiz Winners | JCMC SIIT',
  description: 'Learn more about Power Quiz Winners at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Power Quiz Winners" />;
}
