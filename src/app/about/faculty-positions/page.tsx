import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Faculty Positions | JCMC SIIT',
  description: 'Learn more about Faculty Positions at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Faculty Positions" />;
}
