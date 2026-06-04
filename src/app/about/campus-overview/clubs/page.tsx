import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Clubs | JCMC SIIT',
  description: 'Learn more about Clubs at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Clubs" />;
}
