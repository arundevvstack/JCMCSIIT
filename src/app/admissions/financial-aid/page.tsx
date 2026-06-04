import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Financial Aid | JCMC SIIT',
  description: 'Learn more about Financial Aid at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Financial Aid" />;
}
