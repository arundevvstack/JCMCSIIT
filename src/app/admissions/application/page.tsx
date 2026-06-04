import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Application | JCMC SIIT',
  description: 'Learn more about Application at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Application" />;
}
