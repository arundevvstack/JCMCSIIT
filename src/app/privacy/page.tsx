import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Privacy | JCMC SIIT',
  description: 'Learn more about Privacy at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Privacy" />;
}
