import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Pg | JCMC SIIT',
  description: 'Learn more about Pg at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Pg" />;
}
