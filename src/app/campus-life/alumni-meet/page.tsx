import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Alumni Meet | JCMC SIIT',
  description: 'Learn more about Alumni Meet at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Alumni Meet" />;
}
