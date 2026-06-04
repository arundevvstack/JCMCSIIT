import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Ug | JCMC SIIT',
  description: 'Learn more about Ug at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Ug" />;
}
