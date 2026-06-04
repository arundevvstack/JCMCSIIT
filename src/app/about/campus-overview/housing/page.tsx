import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Housing | JCMC SIIT',
  description: 'Learn more about Housing at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Housing" />;
}
