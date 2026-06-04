import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Tour | JCMC SIIT',
  description: 'Learn more about Tour at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Tour" />;
}
