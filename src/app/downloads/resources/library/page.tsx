import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Library | JCMC SIIT',
  description: 'Learn more about Library at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Library" />;
}
