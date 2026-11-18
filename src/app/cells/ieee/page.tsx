import { Metadata } from 'next';
import { IeeeBranchView } from '@/components/cells/ieee-branch-view';
import { getPublicPageByRoute } from '@/lib/cms/pages';
import { getPublicContentBlock } from '@/lib/cms/content-blocks';

export const metadata: Metadata = {
  title: 'IEEE Student Branch & Societies | JCMCSIIT',
  description: 'IEEE Student Branch and Societies (IEEE SAS SBC, IEEE RAS SBC, IEEE WIE) at John Cox Memorial CSI Institute of Technology.',
};

export default async function Page() {
  const [cmsPage, ieeeBlock] = await Promise.all([
    getPublicPageByRoute('/cells/ieee').catch(() => null),
    getPublicContentBlock('ieee_societies_data').catch(() => null),
  ]);

  return (
    <IeeeBranchView
      title={cmsPage?.title}
      subtitle={cmsPage?.subtitle}
      summary={cmsPage?.summary}
      content={cmsPage?.content}
      societiesBlock={ieeeBlock}
    />
  );
}
