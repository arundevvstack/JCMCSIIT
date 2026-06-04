import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'History | JCMC SIIT',
  description: 'Learn more about History at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="History" />;
}
