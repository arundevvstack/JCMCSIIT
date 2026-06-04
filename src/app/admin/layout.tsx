import { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard, Users, FileText, Settings, LogOut } from "lucide-react";

export const metadata: Metadata = {
  title: "CMS Admin | JCMCSIIT",
  description: "Content Management System for JCMCSIIT",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <span className="font-bold text-lg text-primary tracking-tight">Antigravity CMS</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            <li>
              <Link href="/admin" className="flex items-center px-3 py-2.5 rounded-lg bg-slate-100 text-primary font-medium">
                <LayoutDashboard className="h-5 w-5 mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/content" className="flex items-center px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                <FileText className="h-5 w-5 mr-3 text-slate-400" />
                Content blocks
              </Link>
            </li>
            <li>
              <Link href="/admin/users" className="flex items-center px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                <Users className="h-5 w-5 mr-3 text-slate-400" />
                Staff & Admins
              </Link>
            </li>
            <li>
              <Link href="/admin/settings" className="flex items-center px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                <Settings className="h-5 w-5 mr-3 text-slate-400" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-200">
          <button className="flex w-full items-center px-3 py-2 text-sm text-slate-600 hover:text-red-600 transition-colors">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="font-semibold text-slate-800">Institution Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-sm">
              AD
            </div>
          </div>
        </header>
        <div className="p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
