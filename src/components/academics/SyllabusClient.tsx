"use client";

import React, { useState, useMemo } from 'react';
import { Search, Download, Eye, FileText, ChevronRight, BookOpen, Layers } from 'lucide-react';
import Link from 'next/link';

type SyllabusItem = {
  id: string;
  title: string;
  department: string;
  semester: string;
  scheme: string;
  category: string;
  pdf_url: string;
  description: string;
  tags: string[];
};

export default function SyllabusClient({ data, initialDepartment }: { data: SyllabusItem[], initialDepartment?: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>(initialDepartment || 'All');
  const [selectedScheme, setSelectedScheme] = useState<string>('All');

  // Derive unique filters
  const departments = ['All', ...Array.from(new Set(data.map(item => item.department)))];
  const schemes = ['All', ...Array.from(new Set(data.map(item => item.scheme)))];

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesDept = selectedDepartment === 'All' || item.department === selectedDepartment;
      const matchesScheme = selectedScheme === 'All' || item.scheme === selectedScheme;

      return matchesSearch && matchesDept && matchesScheme;
    });
  }, [data, searchQuery, selectedDepartment, selectedScheme]);

  return (
    <div className="w-full">
      {/* Search and Filters Section */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mb-12">
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-0 text-slate-900 rounded-2xl ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-lg transition-shadow"
            placeholder="Search for Engineering Graphics, C Programming, 2019 Scheme..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center">
              <BookOpen className="w-4 h-4 mr-2" /> Department / Category
            </label>
            <div className="flex flex-wrap gap-2">
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedDepartment === dept 
                      ? 'bg-primary text-white shadow-md shadow-primary/20' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full md:w-64">
            <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center">
              <Layers className="w-4 h-4 mr-2" /> Scheme
            </label>
            <select
              value={selectedScheme}
              onChange={(e) => setSelectedScheme(e.target.value)}
              className="block w-full rounded-xl border-0 py-3 pl-4 pr-10 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6 bg-slate-50"
            >
              {schemes.map(scheme => (
                <option key={scheme} value={scheme}>{scheme}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">
          Academic Resources <span className="text-slate-400 text-lg font-normal ml-2">({filteredData.length} results)</span>
        </h2>
      </div>

      {filteredData.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No resources found</h3>
          <p className="text-slate-500">We couldn't find any syllabus matching your search criteria. Try adjusting your filters.</p>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedDepartment('All'); setSelectedScheme('All'); }}
            className="mt-6 px-6 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map(item => (
            <div key={item.id} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col h-full">
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">
                    {item.scheme}
                  </div>
                  <div className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg">
                    {item.semester}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-start text-sm font-medium text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 mt-1.5 shrink-0"></span>
                  <span className="flex-1">{item.department}</span>
                </div>
              </div>
              
              <div className="bg-slate-50 px-6 py-4 flex gap-3 border-t border-slate-100">
                {item.pdf_url ? (
                  <>
                    <a 
                      href={`/${item.pdf_url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-2.5 px-4 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                    >
                      <Eye className="w-4 h-4" /> Preview
                    </a>
                    <a 
                      href={`/${item.pdf_url}`}
                      download
                      className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-2.5 px-4 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md hover:shadow-primary/20"
                    >
                      <Download className="w-4 h-4" /> Download
                    </a>
                  </>
                ) : (
                  <div className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-400 py-2.5 px-4 rounded-xl text-sm font-semibold cursor-not-allowed">
                    <FileText className="w-4 h-4" /> PDF Not Available
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
