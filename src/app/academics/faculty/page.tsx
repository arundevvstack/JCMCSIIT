import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Search, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Faculty | JCMCSIIT",
  description: "Meet our distinguished faculty members driving innovation and excellence.",
};

const facultyList = [
  { name: "Dr. Alan Turing", designation: "HOD, Artificial Intelligence", department: "AI & ML", slug: "alan-turing" },
  { name: "Dr. Grace Hopper", designation: "HOD, Computer Science", department: "Computer Science", slug: "grace-hopper" },
  { name: "Prof. John Doe", designation: "Professor", department: "Electronics & Communication", slug: "john-doe" },
  { name: "Dr. Jane Smith", designation: "Associate Professor", department: "Biomedical Engineering", slug: "jane-smith" },
  { name: "Dr. Robert Koch", designation: "Professor", department: "Mechanical Engineering", slug: "robert-koch" },
  { name: "Prof. Ada Lovelace", designation: "Assistant Professor", department: "AI & ML", slug: "ada-lovelace" },
];

export default function FacultyPage() {
  return (
    <main className="min-h-screen pt-40 pb-32 bg-white relative">
      <div className="layout-grid relative z-10">
        <div className="flex flex-col items-center text-center mb-24">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-slate-900 leading-[1.1]">
            Academic Leaders.
          </h1>
          <p className="text-slate-500 max-w-2xl text-xl md:text-2xl font-medium leading-relaxed mb-12">
            Meet the pioneers, researchers, and educators forging the next generation of engineers at JCMCSIIT.
          </p>
          
          <div className="w-full max-w-2xl relative shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl group transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search faculty by name or department..." 
              className="w-full h-16 pl-14 pr-6 rounded-2xl border border-slate-200/60 bg-white text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto">
          {facultyList.map((faculty) => (
            <Link key={faculty.slug} href={`/faculty/${faculty.slug}`} className="group block h-full outline-none">
              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200/60 hover:border-slate-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 h-full flex flex-col relative overflow-hidden">
                <div className="flex items-center gap-6 mb-8">
                  <div className="h-20 w-20 rounded-full bg-slate-50 border border-slate-100 flex flex-col items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 group-hover:border-slate-200 transition-all duration-500 shadow-sm">
                    <User className="h-8 w-8 text-slate-300 group-hover:text-primary/60 transition-colors duration-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">{faculty.name}</h2>
                    <p className="text-[15px] font-semibold text-slate-500">{faculty.designation}</p>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <span className="inline-block px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[13px] font-bold tracking-wide uppercase text-slate-600 mb-6 group-hover:bg-white group-hover:border-slate-200 transition-colors">
                    {faculty.department}
                  </span>
                  <div className="flex items-center text-[15px] font-semibold text-slate-900 group-hover:text-primary transition-colors">
                    View Profile
                    <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
