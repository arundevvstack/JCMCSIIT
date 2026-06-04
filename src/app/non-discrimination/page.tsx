import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Non Discrimination | JCMC SIIT',
  description: 'Learn more about Non Discrimination at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Non Discrimination" />;
}
