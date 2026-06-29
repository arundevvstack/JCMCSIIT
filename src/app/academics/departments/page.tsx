import { Brain, Cpu, Code2, HeartPulse, Building2, Wrench, Zap, Laptop } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academic Departments | JCMCSIIT",
  description: "Explore our future-ready engineering disciplines and research programs.",
};

const btechDepartments = [
  { id: "aiml", name: "Artificial Intelligence & Machine Learning", icon: Brain, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  { id: "biomedical-robotic", name: "Biomedical & Robotic Engineering", icon: HeartPulse, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
  { id: "civil", name: "Civil Engineering", icon: Building2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  { id: "cse", name: "Computer Science & Engineering", icon: Code2, color: "text-slate-700", bg: "bg-slate-100", border: "border-slate-200" },
  { id: "ece", name: "Electronics & Communication Engineering", icon: Cpu, color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-100" },
  { id: "eee", name: "Electrical & Electronics Engineering", icon: Zap, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
  { id: "mechanical", name: "Mechanical Engineering", icon: Wrench, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" }
];

const diplomaDepartments = [
  { id: "diploma-civil-engineering", name: "Civil", icon: Building2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  { id: "diploma-computer-engineering", name: "Computer", icon: Laptop, color: "text-slate-700", bg: "bg-slate-100", border: "border-slate-200" },
  { id: "diploma-electronics-communication", name: "Electronics & Communication", icon: Cpu, color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-100" },
  { id: "diploma-electrical-engineering", name: "Electrical", icon: Zap, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
  { id: "diploma-mechanical-engineering", name: "Mechanical", icon: Wrench, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" }
];

function DepartmentGrid({ title, departments }: { title: string, departments: any[] }) {
  return (
    <div className="mb-24">
      <h2 className="text-4xl font-bold mb-12 text-slate-900 text-center">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto">
        {departments.map((dept) => (
          <Link key={dept.id} href={`/academics/departments/${dept.id}`} className="group h-full outline-none">
            <div className="bg-white h-full p-12 rounded-[2.5rem] border border-slate-200/60 hover:border-slate-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 relative overflow-hidden flex flex-col">
              <div className={`h-16 w-16 rounded-[1.25rem] ${dept.bg} ${dept.border} border flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                <dept.icon className={`h-8 w-8 ${dept.color}`} />
              </div>
              
              <h3 className="text-3xl font-bold mb-4 text-slate-900 group-hover:text-primary transition-colors">
                {dept.name}
              </h3>
              
              <div className="mt-auto pt-10 flex items-center text-[15px] font-semibold text-slate-900 group-hover:text-primary transition-colors">
                Explore Program
                <span className="ml-2 inline-block transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function DepartmentsPage() {
  return (
    <main className="min-h-screen pt-40 pb-16 bg-white relative">
      <div className="layout-grid relative z-10">
        <div className="flex flex-col items-center text-center mb-20">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-slate-900 leading-[1.1]">
            Academic Ecosystem.
          </h1>
          <p className="text-slate-500 max-w-2xl text-xl md:text-2xl font-medium leading-relaxed">
            Immerse yourself in future-ready engineering disciplines. Our departments are hubs of innovation, blending rigorous academics with cutting-edge research.
          </p>
        </div>

        <DepartmentGrid title="B.Tech Programmes" departments={btechDepartments} />
        <DepartmentGrid title="Diploma Programmes" departments={diplomaDepartments} />
      </div>
    </main>
  );
}
