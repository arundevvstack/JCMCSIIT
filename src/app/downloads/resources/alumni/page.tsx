import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Alumni | JCMC SIIT',
  description: 'Learn more about Alumni at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Alumni" />;
}
