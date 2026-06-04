import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Terms | JCMC SIIT',
  description: 'Learn more about Terms at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Terms" />;
}
