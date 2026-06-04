import { ArrowRight, FileText, LayoutTemplate } from "lucide-react";
import Link from "next/link";

export default function ContentDashboard() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Content Management</h1>
        <p className="text-slate-500">Manage dynamic pages and reusable content blocks across the site.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <FileText className="w-48 h-48" />
          </div>
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 relative z-10">
            <FileText className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3 relative z-10">Pages Manager</h2>
          <p className="text-slate-600 mb-8 max-w-sm relative z-10">
            Create and edit full dynamic pages. Manage slugs, SEO metadata, and publish status.
          </p>
          <Link href="/admin/content/pages" className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-700 transition-colors relative z-10 group-hover:translate-x-1 duration-300">
            Manage Pages <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <LayoutTemplate className="w-48 h-48" />
          </div>
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 relative z-10">
            <LayoutTemplate className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3 relative z-10">Content Blocks</h2>
          <p className="text-slate-600 mb-8 max-w-sm relative z-10">
            Edit reusable snippets of text and HTML used across static pages (e.g., hero text, contact info).
          </p>
          <Link href="/admin/content/blocks" className="inline-flex items-center gap-2 font-bold text-emerald-600 hover:text-emerald-700 transition-colors relative z-10 group-hover:translate-x-1 duration-300">
            Manage Blocks <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
