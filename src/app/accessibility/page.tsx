import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Accessibility | JCMC SIIT',
  description: 'Learn more about Accessibility at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Accessibility" />;
}
