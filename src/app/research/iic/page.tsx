import { Metadata } from "next";
import { Lightbulb, Award, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { getPublicPageByRoute } from "@/lib/cms/pages";
import { getPublicContentBlock } from "@/lib/cms/content-blocks";

export const metadata: Metadata = {
  title: "Institution's Innovation Council (IIC) | JCMCSIIT",
  description: "Fostering innovation, entrepreneurship, and start-up culture at JCMCSIIT.",
};

const defaultLeaders = [
  {
    name: "Mrs. Arathiraj B S",
    role: "IIC President",
    dept: "Asst. Prof. ECE",
    image: "https://jcmcsiit.ac.in/Faculty/ECE/Arathy%20Raj%20B%20S.jpg",
    badgeColor: "bg-orange-100 text-orange-700",
  },
  {
    name: "Mr. Akhil W V",
    role: "Vice President",
    dept: "Asst. Prof. ME",
    image: "https://jcmcsiit.ac.in/Faculty/ME/Akhil%20W%20V.jpg",
    badgeColor: "bg-slate-200 text-slate-700",
  },
  {
    name: "Mrs. Nisha A M",
    role: "Convenor",
    dept: "Asst. Prof. CSE",
    image: "https://jcmcsiit.ac.in/Faculty/CSE/NISHA%20A.M.jpg",
    badgeColor: "bg-slate-200 text-slate-700",
  },
];

const defaultCerts = [
  {
    title: "Establishment Certificate",
    subtitle: "Official IIC Establishment Details",
    url: "https://jcmcsiit.ac.in/general/IICEstablismentCertificate.pdf",
  },
  {
    title: "Rating Certificate",
    subtitle: "IIC Star Rating 2022-23",
    url: "https://jcmcsiit.ac.in/general/IICRatingCertificate_2022-23.pdf",
  },
];

export default async function IICPage() {
  const [page, councilBlock, certsBlock] = await Promise.all([
    getPublicPageByRoute("/research/iic").catch(() => null),
    getPublicContentBlock("iic_council_members").catch(() => null),
    getPublicContentBlock("iic_certificates").catch(() => null),
  ]);

  const rawLeaders = Array.isArray(councilBlock?.structured_data?.members)
    ? (councilBlock.structured_data.members as Array<{ name?: string; role?: string; designation?: string; dept?: string; image?: string; image_url?: string }>)
    : null;

  const leaders = rawLeaders && rawLeaders.length > 0
    ? rawLeaders.map((m, idx) => ({
        name: m.name || `Member ${idx + 1}`,
        role: m.role || "Council Member",
        dept: m.dept || m.designation || "",
        image: m.image || m.image_url || "https://jcmcsiit.ac.in/Faculty/ECE/Arathy%20Raj%20B%20S.jpg",
        badgeColor: idx === 0 ? "bg-orange-100 text-orange-700" : "bg-slate-200 text-slate-700",
      }))
    : defaultLeaders;

  const rawCerts = Array.isArray(certsBlock?.structured_data?.certificates)
    ? (certsBlock.structured_data.certificates as Array<{ title?: string; subtitle?: string; url?: string }>)
    : null;

  const certs = rawCerts && rawCerts.length > 0
    ? rawCerts.map((c, idx) => ({
        title: c.title || `Certificate ${idx + 1}`,
        subtitle: c.subtitle || "Official Document",
        url: c.url || "#",
      }))
    : defaultCerts;

  const pageDesc = page?.seo_description || "Established on 17th January 2024 with the objective of fostering innovation, entrepreneurship, and start-up culture among students and faculty members. The council aims to create a vibrant ecosystem that nurtures creative ideas and transforms them into impactful solutions.";

  return (
    <main className="min-h-screen pt-32 pb-24 bg-white relative">
      <div className="container px-4 md:px-6 relative z-10 mx-auto">
        
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-200 bg-orange-50 mb-8 shadow-sm">
            <Lightbulb className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-semibold text-orange-700 tracking-wide">Innovation Hub</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-slate-900">
            {page?.title ? (
              page.title
            ) : (
              <>Institution&apos;s Innovation <span className="text-orange-500">Council</span>.</>
            )}
          </h1>
          <p className="text-slate-600 text-xl leading-relaxed max-w-3xl mx-auto text-justify">
            {pageDesc}
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {leaders.map((leader, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-200 text-center flex flex-col items-center">
              <div className="h-24 w-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md">
                <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">{leader.name}</h3>
              <p className="text-sm text-slate-500 mb-2">{leader.dept}</p>
              <div className={`px-3 py-1 ${leader.badgeColor} text-xs font-bold rounded-full`}>{leader.role}</div>
            </div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center"><Award className="w-6 h-6 mr-3 text-orange-500" /> Certificates & Recognition</h2>
            <ul className="space-y-4">
              {certs.map((cert, i) => (
                <li key={i}>
                  <a href={cert.url} target="_blank" rel="noopener noreferrer" className="flex items-center p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mr-4 shrink-0">
                      <Download className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{cert.title}</div>
                      <div className="text-sm text-slate-500">{cert.subtitle}</div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 md:p-10 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />
            <h2 className="text-2xl font-bold mb-6 relative z-10">Gallery</h2>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square relative rounded-xl overflow-hidden bg-slate-800">
                  <img 
                    src={`https://jcmcsiit.ac.in/img/IIC/23-10-2025/IIC%20Slider%20(${i}).jpg`}
                    alt={`IIC Event ${i}`}
                    className="object-cover w-full h-full opacity-80 hover:opacity-100 transition-opacity hover:scale-110 duration-500"
                    />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
