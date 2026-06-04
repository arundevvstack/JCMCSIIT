import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Nba Accredited | JCMC SIIT',
  description: 'Learn more about Nba Accredited at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Nba Accredited" />;
}
