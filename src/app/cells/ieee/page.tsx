import { Metadata } from 'next';
import { IeeeBranchView } from '@/components/cells/ieee-branch-view';

export const metadata: Metadata = {
  title: 'IEEE Student Branch & Societies | JCMCSIIT',
  description: 'IEEE Student Branch and Societies (IEEE SAS SBC, IEEE RAS SBC, IEEE WIE) at John Cox Memorial CSI Institute of Technology.',
};

export default function Page() {
  return <IeeeBranchView />;
}
