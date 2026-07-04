import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';

interface FacultyNavigationProps {
  previousFaculty?: { name: string; slug: string };
  nextFaculty?: { name: string; slug: string };
  departmentSlug: string;
}

export function FacultyNavigation({ previousFaculty, nextFaculty, departmentSlug }: FacultyNavigationProps) {
  return (
    <div className="border-t border-zinc-200 dark:border-zinc-800 py-8 mt-12 bg-zinc-50/50 dark:bg-zinc-900/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          
          <div className="w-full sm:w-1/3 flex justify-start">
            {previousFaculty ? (
              <Link href={`/faculty/${previousFaculty.slug}`} className="group flex items-center text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors">
                <ChevronLeft className="w-5 h-5 mr-1 text-zinc-400 group-hover:text-primary transition-colors" />
                <span className="truncate max-w-[150px]">{previousFaculty.name}</span>
              </Link>
            ) : <div />}
          </div>

          <div className="w-full sm:w-1/3 flex justify-center">
            <Link href="/academics/faculty" className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-primary hover:border-primary transition-all">
              <Users className="w-4 h-4" /> Back to Directory
            </Link>
          </div>

          <div className="w-full sm:w-1/3 flex justify-end">
            {nextFaculty ? (
              <Link href={`/faculty/${nextFaculty.slug}`} className="group flex items-center text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors text-right">
                <span className="truncate max-w-[150px]">{nextFaculty.name}</span>
                <ChevronRight className="w-5 h-5 ml-1 text-zinc-400 group-hover:text-primary transition-colors" />
              </Link>
            ) : <div />}
          </div>

        </div>
      </div>
    </div>
  );
}
