import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Accreditation | JCMC SIIT',
  description: 'Learn more about Accreditation at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Accreditation" />;
}
