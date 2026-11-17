import { Metadata } from "next";
import { FacultyListing } from "@/components/faculty/faculty-listing";
import { getPublicFacultyList } from "@/lib/cms/faculty";

export const metadata: Metadata = {
  title: "Faculty Directory | JCMCSIIT",
  description: "Meet the distinguished faculty members of John Cox Memorial C.S.I Institute of Technology.",
};

export const dynamic = "force-dynamic";

export default async function FacultyPage() {
  const facultyMembers = await getPublicFacultyList();

  // Extract unique departments from the dynamic faculty data
  const departmentsMap = new Map();
  facultyMembers.forEach(f => {
    if (f.departments) {
      departmentsMap.set(f.departments.slug, {
        id: f.departments.slug,
        name: f.departments.name
      });
    }
  });
  
  const departments = Array.from(departmentsMap.values());

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0B1F3A] py-24 text-white mt-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-48 -top-48 h-96 w-96 rounded-full bg-emerald-500 blur-3xl" />
          <div className="absolute -right-48 bottom-0 h-96 w-96 rounded-full bg-blue-500 blur-3xl" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl text-white">
            Our Distinguished Faculty
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300 md:text-xl">
            Meet the experienced educators and industry experts dedicated to shaping the engineers and innovators of tomorrow.
          </p>
        </div>
      </section>

      {/* Listing Content */}
      <section className="container mx-auto px-4 py-12">
        <FacultyListing 
          initialFaculty={facultyMembers} 
          departments={departments} 
        />
      </section>
    </main>
  );
}
