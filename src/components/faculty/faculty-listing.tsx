"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, MapPin, Mail, User, GraduationCap, Briefcase } from "lucide-react";
import { Faculty } from "@/types/faculty";

interface FacultyListingProps {
  initialFaculty: Faculty[];
  departments: { id: string; name: string }[];
}

export function FacultyListing({ initialFaculty, departments }: FacultyListingProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedDesignation, setSelectedDesignation] = useState("all");

  const designations = useMemo(() => {
    const unique = new Set(initialFaculty.map((f) => f.designation).filter(Boolean));
    return Array.from(unique) as string[];
  }, [initialFaculty]);

  const filteredFaculty = useMemo(() => {
    return initialFaculty.filter((faculty) => {
      // Search
      const searchMatch = 
        faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faculty.departments?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faculty.designation?.toLowerCase().includes(searchQuery.toLowerCase());

      // Filters
      const deptMatch = selectedDepartment === "all" || faculty.department_id === selectedDepartment;
      const desigMatch = selectedDesignation === "all" || faculty.designation === selectedDesignation;

      return searchMatch && deptMatch && desigMatch;
    });
  }, [initialFaculty, searchQuery, selectedDepartment, selectedDesignation]);

  return (
    <div className="flex flex-col lg:flex-row gap-10 max-w-[90rem] mx-auto">
      {/* Filters Sidebar */}
      <aside className="lg:w-1/4">
        <div className="sticky top-32 space-y-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Search</h3>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name, designation..." 
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Department</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="department" 
                  value="all"
                  checked={selectedDepartment === "all"}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-4 h-4 text-emerald-500 focus:ring-emerald-500 border-slate-300" 
                />
                <span className="text-slate-700 font-medium">All Departments</span>
              </label>
              {departments.map(dept => (
                <label key={dept.id} className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="department" 
                    value={dept.id}
                    checked={selectedDepartment === dept.id}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-4 h-4 text-emerald-500 focus:ring-emerald-500 border-slate-300" 
                  />
                  <span className="text-slate-700 font-medium">{dept.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Designation</h3>
            <select
              value={selectedDesignation}
              onChange={(e) => setSelectedDesignation(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
            >
              <option value="all">All Designations</option>
              {designations.map(desig => (
                <option key={desig} value={desig}>{desig}</option>
              ))}
            </select>
          </div>
        </div>
      </aside>

      {/* Grid */}
      <div className="lg:w-3/4">
        {filteredFaculty.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
            <User className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No Faculty Found</h3>
            <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredFaculty.map((faculty) => (
              <Link key={faculty.id} href={`/academics/faculty/${faculty.slug}`} className="group block outline-none">
                <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] hover:-translate-y-1 transition-all duration-300 h-full flex flex-col relative overflow-hidden group-hover:bg-white group-hover:border-emerald-500/20">
                  
                  {/* Photo & Name */}
                  <div className="flex items-center gap-5 mb-6">
                    <div className="h-20 w-20 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-inner relative">
                      {faculty.image_url ? (
                        <Image 
                          src={faculty.image_url} 
                          alt={faculty.name} 
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <User className="h-8 w-8 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 leading-tight mb-1 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {faculty.name}
                      </h2>
                      <p className="text-sm font-semibold text-emerald-600">{faculty.designation}</p>
                    </div>
                  </div>
                  
                  {/* Info Cards */}
                  <div className="space-y-3 mb-8">
                    {faculty.departments?.name && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 line-clamp-2">{faculty.departments.name}</span>
                      </div>
                    )}
                    {faculty.profile_data?.highestQualification && (
                      <div className="flex items-start gap-3">
                        <GraduationCap className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 line-clamp-2">{faculty.profile_data.highestQualification}</span>
                      </div>
                    )}
                    {(faculty.profile_data?.teachingExperience || faculty.profile_data?.industryExperience) && (
                      <div className="flex items-start gap-3">
                        <Briefcase className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 line-clamp-2">
                          {[faculty.profile_data?.teachingExperience, faculty.profile_data?.industryExperience].filter(Boolean).join(" • ")}
                        </span>
                      </div>
                    )}
                    {faculty.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="text-sm text-slate-600 truncate">{faculty.email}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action */}
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-slate-500 group-hover:text-emerald-600 transition-colors">
                    <span>View Full Profile</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
