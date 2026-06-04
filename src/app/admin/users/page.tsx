import { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = {
  title: 'Users | JCMC SIIT',
  description: 'Learn more about Users at JCMC SIIT.',
};

export default function Page() {
  return <ComingSoon title="Users" />;
}
