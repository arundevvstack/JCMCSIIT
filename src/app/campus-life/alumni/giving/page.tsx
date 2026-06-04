import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Giving | JCMC SIIT',
  description: 'Learn more about Giving at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Giving" />;
}
