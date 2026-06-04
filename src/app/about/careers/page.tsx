import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Careers | JCMC SIIT',
  description: 'Learn more about Careers at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Careers" />;
}
