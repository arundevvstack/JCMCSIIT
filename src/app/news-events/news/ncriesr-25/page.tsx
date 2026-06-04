import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Ncriesr 25 | JCMC SIIT',
  description: 'Learn more about Ncriesr 25 at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Ncriesr 25" />;
}
