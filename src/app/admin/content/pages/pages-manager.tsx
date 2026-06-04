"use client";

import { useState } from "react";
import { savePage, deletePage } from "@/actions/cms";
import { Plus, Save, Trash2, Globe, Lock, Search } from "lucide-react";

type PageData = {
  id: string;
  slug: string;
  title: string;
  content: string;
  is_published: boolean;
  updated_at: string;
};

export default function PagesManager({ initialPages }: { initialPages: PageData[] }) {
  const [pages, setPages] = useState<PageData[]>(initialPages);
  const [activePageId, setActivePageId] = useState<string | null>(initialPages[0]?.id || null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const activePage = pages.find((p) => p.id === activePageId) || {
    id: "",
    slug: "",
    title: "",
    content: "",
    is_published: false,
    updated_at: "",
  };

  const handleAddNew = () => {
    const newPage: PageData = {
      id: `new-${Date.now()}`,
      slug: "new-page",
      title: "New Page",
      content: "# New Page\\n\\nStart typing here...",
      is_published: false,
      updated_at: new Date().toISOString(),
    };
    setPages([newPage, ...pages]);
    setActivePageId(newPage.id);
  };

  const handleChange = (field: keyof PageData, value: string | boolean) => {
    setPages(pages.map((p) => (p.id === activePageId ? { ...p, [field]: value } : p)));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      if (!activePage.id.startsWith("new-")) {
        formData.append("id", activePage.id);
      }
      formData.append("slug", activePage.slug);
      formData.append("title", activePage.title);
      formData.append("content", activePage.content);
      formData.append("is_published", activePage.is_published.toString());

      await savePage(formData);
      alert("Page saved successfully!");
      // We should ideally refetch or the revalidatePath will handle it on next load, 
      // but for UX we just update the local state to remove the "new-" prefix if needed.
    } catch (err: any) {
      alert("Error saving: " + err.message);
    }
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this page?")) return;
    
    if (!activePage.id.startsWith("new-")) {
      try {
        await deletePage(activePage.id);
      } catch (err: any) {
        alert("Error deleting: " + err.message);
        return;
      }
    }
    
    const newPages = pages.filter((p) => p.id !== activePageId);
    setPages(newPages);
    setActivePageId(newPages.length > 0 ? newPages[0].id : null);
  };

  const filteredPages = pages.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.slug.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-full gap-6">
      {/* Sidebar List */}
      <div className="w-80 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden shrink-0">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <button 
            onClick={handleAddNew}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors mb-4"
          >
            <Plus className="w-4 h-4" /> Create New Page
          </button>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search pages..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredPages.map((page) => (
            <button
              key={page.id}
              onClick={() => setActivePageId(page.id)}
              className={`w-full text-left p-3 rounded-xl transition-all ${activePageId === page.id ? 'bg-blue-50 border-blue-200 border' : 'hover:bg-slate-50 border border-transparent'}`}
            >
              <div className="font-semibold text-slate-900 truncate">{page.title}</div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-slate-500 truncate">/{page.slug}</span>
                {page.is_published ? (
                  <Globe className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Lock className="w-3 h-3 text-amber-500" />
                )}
              </div>
            </button>
          ))}
          {filteredPages.length === 0 && (
            <div className="p-4 text-center text-slate-500 text-sm">No pages found.</div>
          )}
        </div>
      </div>

      {/* Editor Main Area */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        {activePageId ? (
          <>
            {/* Toolbar */}
            <div className="h-16 border-b border-slate-200 px-6 flex items-center justify-between bg-slate-50 shrink-0">
              <h2 className="font-bold text-slate-800">Edit Page</h2>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mr-4 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={activePage.is_published}
                    onChange={(e) => handleChange("is_published", e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  Published
                </label>
                <button 
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors disabled:opacity-70"
                >
                  <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            {/* Editor Form */}
            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-6 shrink-0">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Page Title</label>
                  <input 
                    type="text" 
                    value={activePage.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">URL Slug</label>
                  <div className="flex items-center">
                    <span className="px-4 py-2 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-slate-500 text-sm">/</span>
                    <input 
                      type="text" 
                      value={activePage.slug}
                      onChange={(e) => handleChange("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-r-xl focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono text-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col min-h-[400px]">
                <label className="block text-sm font-bold text-slate-700 mb-2">Markdown Content</label>
                <textarea 
                  value={activePage.content}
                  onChange={(e) => handleChange("content", e.target.value)}
                  className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-6 font-mono text-sm resize-none focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-800"
                  placeholder="# Enter your markdown here..."
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <FileText className="w-16 h-16 mb-4 opacity-20" />
            <p className="font-medium text-lg text-slate-500">Select a page to edit or create a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
