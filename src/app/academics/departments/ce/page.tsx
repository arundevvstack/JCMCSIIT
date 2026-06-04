import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Ce | JCMC SIIT',
  description: 'Learn more about Ce at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Ce" />;
}
