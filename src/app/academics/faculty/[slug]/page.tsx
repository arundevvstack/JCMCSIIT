import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, User, Mail, Phone, BookOpen, Award } from "lucide-react";

const getFacultyData = (slug: string) => {
  return {
    name: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    designation: "Professor",
    department: "Computer Science & Engineering",
    email: `${slug}@jcmcsiit.ac.in`,
    phone: "+91 9496980000",
    bio: "A highly respected academic with over 15 years of experience in distributed systems and cloud architecture. Leading multiple state-funded research initiatives.",
    education: [
      "Ph.D. in Computer Science, IIT Madras",
      "M.Tech in Software Engineering, NIT Calicut",
      "B.Tech in CSE, Kerala University"
    ],
    publications: 24,
    patents: 2
  };
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const faculty = getFacultyData(resolvedParams.slug);
  return {
    title: `${faculty.name} | Faculty | JCMCSIIT`,
    description: faculty.bio,
  };
}

export default async function FacultyProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const faculty = getFacultyData(resolvedParams.slug);

  return (
    <main className="min-h-screen pt-32 pb-24 bg-white relative">
      <div className="container px-4 md:px-6 relative z-10 max-w-5xl mx-auto">
        <Link href="/academics/faculty" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-foreground mb-12 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Faculty Directory
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Profile Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 flex flex-col items-center text-center">
              <div className="h-40 w-40 rounded-full bg-white border-4 border-slate-100 flex items-center justify-center mb-6 shadow-sm">
                <User className="h-16 w-16 text-slate-300" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-1">{faculty.name}</h1>
              <p className="text-primary font-medium mb-1">{faculty.designation}</p>
              <p className="text-sm text-slate-500 mb-6">{faculty.department}</p>

              <div className="w-full space-y-3 pt-6 border-t border-slate-200 text-left">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <a href={`mailto:${faculty.email}`} className="hover:text-primary transition-colors">{faculty.email}</a>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{faculty.phone}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Publications</p>
                  <p className="text-xl font-bold text-foreground">{faculty.publications}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-6 text-foreground border-b border-slate-100 pb-4">Biography</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {faculty.bio}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 text-foreground border-b border-slate-100 pb-4 flex items-center gap-3">
                <Award className="h-6 w-6 text-primary" /> Educational Qualifications
              </h2>
              <ul className="space-y-4">
                {faculty.education.map((edu, idx) => (
                  <li key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0"></div>
                    <span className="text-slate-700 font-medium">{edu}</span>
                  </li>
                ))}
              </ul>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}
