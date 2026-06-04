import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Users, Trophy, FlaskConical, Download } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

// Dynamic Data Fetcher
const getDepartmentData = async (slug: string) => {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .eq('slug', slug)
    .single();
    
  if (error || !data) {
    // Fallback to mock data for dev environment without populated DB
    const mockDepartments: Record<string, any> = {
      "artificial-intelligence-machine-learning": {
        name: "Artificial Intelligence & Machine Learning",
        description: "Dive into the mechanics of neural networks, deep learning, and cognitive computing. Our AI & ML department equips students with the algorithms of the future.",
        vision: "To be a center of excellence in Artificial Intelligence, creating innovators who build intelligent systems for global challenges.",
        labs: ["Cognitive Computing Lab", "Robotics & Perception Lab", "Data Science Core"],
        hod: "Dr. Alan Turing (Mock)"
      },
      "computer-science-engineering": {
        name: "Computer Science & Engineering",
        description: "The backbone of the digital age. Learn scalable software architecture, cloud computing, and advanced algorithms.",
        vision: "Empowering students to architect the software systems that power tomorrow's industries.",
        labs: ["Cloud Computing Lab", "Cybersecurity Cell", "Software Engineering Lab"],
        hod: "Dr. Grace Hopper (Mock)"
      }
    };
    
    return mockDepartments[slug] || {
      name: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      description: "Discover the future of engineering with our cutting-edge curriculum and research opportunities.",
      vision: "To lead in technological education and research.",
      labs: ["Advanced Research Lab", "Innovation Hub"],
      hod: "Prof. John Doe"
    };
  }
  
  // Transform DB row to expected format
  return {
    name: data.name,
    description: data.description || "Future-ready engineering department.",
    vision: "To lead in technological education and research.", // Could map from DB if added
    labs: ["Advanced Research Lab", "Innovation Hub"], // Could map from related tables
    hod: "Department Head" // Could map from faculty table
  };
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const dept = await getDepartmentData(resolvedParams.slug);
  return {
    title: `${dept.name} | JCMCSIIT`,
    description: dept.description,
  };
}

export default async function DepartmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const dept = await getDepartmentData(resolvedParams.slug);

  return (
    <main className="min-h-screen pt-32 pb-24 relative bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <Link href="/academics/departments" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-foreground mb-12 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Departments
        </Link>

        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-foreground">
            {dept.name}
          </h1>
          <p className="text-2xl text-slate-500 mb-16 leading-relaxed">
            {dept.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-10">
            <div className="bg-white border border-slate-200 shadow-sm p-10 rounded-3xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center text-foreground">
                <BookOpen className="mr-3 h-6 w-6 text-slate-400" />
                Vision & Mission
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {dept.vision}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-10 rounded-3xl">
              <h2 className="text-2xl font-bold mb-8 flex items-center text-foreground">
                <FlaskConical className="mr-3 h-6 w-6 text-slate-400" />
                Research & Laboratories
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dept.labs.map((lab: string, i: number) => (
                  <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center shadow-sm font-medium text-slate-700">
                    <div className="h-2 w-2 rounded-full bg-primary mr-4"></div>
                    {lab}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 mt-2">Head of Department</h3>
              <p className="text-2xl font-bold text-foreground">{dept.hod}</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center text-foreground">
                <Trophy className="mr-3 h-5 w-5 text-slate-400" />
                Quick Stats
              </h2>
              <ul className="space-y-5">
                <li className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-slate-500 font-medium">Placement Rate</span>
                  <span className="font-bold text-foreground">98%</span>
                </li>
                <li className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-slate-500 font-medium">Research Papers</span>
                  <span className="font-bold text-foreground">120+</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Active Patents</span>
                  <span className="font-bold text-foreground">15</span>
                </li>
              </ul>
            </div>
            
            <button className="w-full h-14 rounded-xl bg-slate-50 border border-slate-200 text-foreground font-semibold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 shadow-sm">
              <Download className="h-5 w-5 text-slate-400" /> Download Syllabus
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
