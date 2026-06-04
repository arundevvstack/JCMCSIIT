import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Placed Students | JCMC SIIT',
  description: 'Learn more about Placed Students at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Placed Students" />;
}
