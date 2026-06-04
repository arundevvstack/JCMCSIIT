import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Apply | JCMC SIIT',
  description: 'Learn more about Apply at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Apply" />;
}
