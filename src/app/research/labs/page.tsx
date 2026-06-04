import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Labs | JCMC SIIT',
  description: 'Learn more about Labs at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Labs" />;
}
