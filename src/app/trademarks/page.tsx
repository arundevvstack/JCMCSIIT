import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Trademarks | JCMC SIIT',
  description: 'Learn more about Trademarks at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Trademarks" />;
}
