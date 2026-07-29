import { Brain, Cpu, Code2, HeartPulse, Building2, Wrench, Zap, Laptop, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import Image from "next/image";
import { departmentsData } from "@/data/departments";

export const metadata: Metadata = {
  title: "Academic Departments | JCMCSIIT",
  description: "Explore our future-ready engineering disciplines and research programs.",
};

const btechDepartments = [
  { id: "aiml", icon: Brain, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop" },
  { id: "biomedical-robotic", icon: HeartPulse, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=800&auto=format&fit=crop" },
  { id: "civil", icon: Building2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop" },
  { id: "cse", icon: Code2, color: "text-slate-700", bg: "bg-slate-100", border: "border-slate-200", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop" },
  { id: "ece", icon: Cpu, color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-100", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop" },
  { id: "eee", icon: Zap, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop" },
  { id: "mechanical", icon: Wrench, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100", image: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=800&auto=format&fit=crop" }
];

const diplomaDepartments = [
  { id: "diploma-civil-engineering", icon: Building2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop" },
  { id: "diploma-computer-engineering", icon: Laptop, color: "text-slate-700", bg: "bg-slate-100", border: "border-slate-200", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop" },
  { id: "diploma-electronics-communication", icon: Cpu, color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-100", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop" },
  { id: "diploma-electrical-engineering", icon: Zap, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop" },
  { id: "diploma-mechanical-engineering", icon: Wrench, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100", image: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=800&auto=format&fit=crop" }
];

function DepartmentGrid({ title, departments }: { title: string, departments: any[] }) {
  return (
    <div className="mb-32">
      <div className="flex items-center justify-between mb-16 max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">{title}</h2>
        <div className="h-px bg-slate-200 flex-1 ml-10 hidden md:block"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto px-6">
        {departments.map((dept) => {
          const deptData = departmentsData[dept.id];
          const name = deptData?.name || dept.id;
          const cleanName = name.replace("Department of ", "");
          const description = deptData?.shortDescription || "Fostering academic excellence and advanced technical skills.";
          const highlights = [...(deptData?.events || []), ...(deptData?.coreAreas || [])].slice(0, 3);

          return (
            <Link key={dept.id} href={`/academics/departments/${dept.id}`} className="group relative outline-none block h-full">
              <div className="relative h-full flex flex-col rounded-[2.5rem] bg-white border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500">
                
                {/* Image Section */}
                <div className="relative h-64 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <Image 
                    src={dept.image} 
                    alt={cleanName} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                  
                  {/* Icon Badge overlay */}
                  <div className="absolute bottom-6 left-8 z-20">
                     <div className={`h-14 w-14 rounded-2xl bg-white shadow-lg flex items-center justify-center transform group-hover:-translate-y-2 transition-transform duration-500`}>
                      <dept.icon className={`h-7 w-7 ${dept.color}`} />
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex-1 flex flex-col bg-white relative z-20">
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-primary transition-colors leading-tight">
                    {cleanName}
                  </h3>
                  <p className="text-slate-500 mb-6 text-sm leading-relaxed line-clamp-3">
                    {description}
                  </p>

                  {/* Dynamic Highlights (Events / Programs) */}
                  {highlights.length > 0 && (
                    <div className="mt-auto mb-8 space-y-2">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Highlights & Programs</div>
                      {highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center text-sm text-slate-600">
                          <div className={`h-1.5 w-1.5 rounded-full ${dept.bg.replace('bg-', 'bg-').replace('50', '400')} mr-3`}></div>
                          <span className="truncate">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between text-[15px] font-semibold text-slate-900 group-hover:text-primary transition-colors">
                    <span>Explore Department</span>
                    <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function DepartmentsPage() {
  return (
    <main className="min-h-screen pb-24 bg-[#FAFAFA] relative">
      {/* Hero Section */}
      <div className="relative pt-40 pb-32 mb-20 overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <Image 
            src="/images/aaa.png" 
            alt="Campus Architecture" 
            fill 
            className="object-cover opacity-30" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900" />
        </div>
        
        <div className="layout-grid relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <span className="text-sm font-semibold tracking-wide text-white">Academics</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-white leading-[1.1]">
              Engineering the<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Future.</span>
            </h1>
            <p className="text-slate-300 max-w-2xl text-lg md:text-xl font-medium leading-relaxed">
              Immerse yourself in future-ready engineering disciplines. Our departments are hubs of innovation, blending rigorous academics with cutting-edge research, workshops, and real-world programs.
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-20 -mt-10">
        <DepartmentGrid title="B.Tech Programmes" departments={btechDepartments} />
        <DepartmentGrid title="Diploma Programmes" departments={diplomaDepartments} />
      </div>
    </main>
  );
}
