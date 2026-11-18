import { Metadata } from 'next';
import Image from 'next/image';
import { Quote, ShieldCheck } from 'lucide-react';
import { getChairmanProfileContent } from '@/lib/cms/chairman-profile';
import { resolveChairmanImageSrc } from '@/data/chairman-profile';
import { getPublicPageByRoute } from '@/lib/cms/pages';

export const metadata: Metadata = {
  title: 'Our Chairman | JCMCSIIT',
  description: 'Official profile of Rev. Dr. Princeton Ben Bishop, Chairman & Manager of John Cox Memorial C.S.I Institute of Technology.',
};

export default async function OurChairmanPage() {
  const [{ data: profile }, page] = await Promise.all([
    getChairmanProfileContent(),
    getPublicPageByRoute('/about/our-chairman').catch(() => null),
  ]);

  const name = profile.name;
  const designationLine1 = profile.designationLine1;
  const designationLine2 = profile.designationLine2;
  const quote = profile.quote;
  const message = page?.content || profile.message;
  const image = resolveChairmanImageSrc(profile.imagePath);
  const pageBadge = 'About Us';
  const pageTitle = page?.title || 'Our Chairman';

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container px-4 mx-auto max-w-5xl">
        {/* Page Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 mb-6">
            <span className="text-sm font-bold text-blue-700 uppercase tracking-wide">{pageBadge}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            {pageTitle}
          </h1>
        </div>

        {/* Chairman Card */}
        <div className="bg-gradient-to-br from-[#0B1F3A] to-[#1a3a6b] rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {/* Photo Side */}
            <div className="md:col-span-1 flex items-center justify-center p-10 bg-white/5">
              <div className="text-center">
                <div className="w-48 h-48 rounded-full bg-white/10 border-4 border-white/20 flex items-center justify-center mx-auto mb-6 overflow-hidden relative shadow-inner">
                  <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="192px"
                    unoptimized
                  />
                </div>
                <h2 className="text-white text-xl font-bold leading-tight">{name}</h2>
                <p className="text-emerald-400 text-sm mt-1 font-medium">{designationLine1}</p>
                <p className="text-white/60 text-sm mt-1">{designationLine2}</p>
              </div>
            </div>

            {/* Message / Quote Side */}
            <div className="md:col-span-2 p-10 flex flex-col justify-center">
              {quote ? (
                <>
                  <Quote className="w-10 h-10 text-emerald-400 mb-6 opacity-80" />
                  <blockquote className="text-white text-xl md:text-2xl font-light leading-relaxed italic">
                    &ldquo;{quote}&rdquo;
                  </blockquote>
                  <div className="mt-8 pt-8 border-t border-white/20">
                    <p className="text-white/70 text-sm leading-relaxed">{message}</p>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Institutional Leadership</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Governance &amp; Management
                  </h3>
                  <p className="text-white/80 text-base leading-relaxed">{message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
