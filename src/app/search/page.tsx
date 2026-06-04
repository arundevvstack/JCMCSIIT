import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Search | JCMC SIIT',
  description: 'Learn more about Search at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Search" />;
}
