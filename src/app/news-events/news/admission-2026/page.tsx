import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Admission 2026 | JCMC SIIT',
  description: 'Learn more about Admission 2026 at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Admission 2026" />;
}
