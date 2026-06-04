import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Recruiters | JCMC SIIT',
  description: 'Learn more about Recruiters at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Recruiters" />;
}
