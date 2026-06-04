"use client";

import { useState } from "react";
import { saveContentBlock, deleteContentBlock } from "@/actions/cms";
import { Plus, Save, Trash2, LayoutTemplate, Search } from "lucide-react";

type BlockData = {
  id: string;
  key: string;
  title: string;
  content: string;
  updated_at: string;
};

export default function BlocksManager({ initialBlocks }: { initialBlocks: BlockData[] }) {
  const [blocks, setBlocks] = useState<BlockData[]>(initialBlocks);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(initialBlocks[0]?.id || null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const activeBlock = blocks.find((b) => b.id === activeBlockId) || {
    id: "",
    key: "",
    title: "",
    content: "",
    updated_at: "",
  };

  const handleAddNew = () => {
    const newBlock: BlockData = {
      id: `new-${Date.now()}`,
      key: "new_block_key",
      title: "New Block",
      content: "Snippet content goes here...",
      updated_at: new Date().toISOString(),
    };
    setBlocks([newBlock, ...blocks]);
    setActiveBlockId(newBlock.id);
  };

  const handleChange = (field: keyof BlockData, value: string) => {
    setBlocks(blocks.map((b) => (b.id === activeBlockId ? { ...b, [field]: value } : b)));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      if (!activeBlock.id.startsWith("new-")) {
        formData.append("id", activeBlock.id);
      }
      formData.append("key", activeBlock.key);
      formData.append("title", activeBlock.title);
      formData.append("content", activeBlock.content);

      await saveContentBlock(formData);
      alert("Block saved successfully!");
    } catch (err: any) {
      alert("Error saving: " + err.message);
    }
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this block?")) return;
    
    if (!activeBlock.id.startsWith("new-")) {
      try {
        await deleteContentBlock(activeBlock.id);
      } catch (err: any) {
        alert("Error deleting: " + err.message);
        return;
      }
    }
    
    const newBlocks = blocks.filter((b) => b.id !== activeBlockId);
    setBlocks(newBlocks);
    setActiveBlockId(newBlocks.length > 0 ? newBlocks[0].id : null);
  };

  const filteredBlocks = blocks.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.key.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-full gap-6">
      {/* Sidebar List */}
      <div className="w-80 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden shrink-0">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <button 
            onClick={handleAddNew}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors mb-4"
          >
            <Plus className="w-4 h-4" /> Create New Block
          </button>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search blocks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredBlocks.map((block) => (
            <button
              key={block.id}
              onClick={() => setActiveBlockId(block.id)}
              className={`w-full text-left p-3 rounded-xl transition-all ${activeBlockId === block.id ? 'bg-emerald-50 border-emerald-200 border' : 'hover:bg-slate-50 border border-transparent'}`}
            >
              <div className="font-semibold text-slate-900 truncate">{block.title}</div>
              <div className="text-xs text-slate-500 truncate mt-1 font-mono">{block.key}</div>
            </button>
          ))}
          {filteredBlocks.length === 0 && (
            <div className="p-4 text-center text-slate-500 text-sm">No blocks found.</div>
          )}
        </div>
      </div>

      {/* Editor Main Area */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        {activeBlockId ? (
          <>
            {/* Toolbar */}
            <div className="h-16 border-b border-slate-200 px-6 flex items-center justify-between bg-slate-50 shrink-0">
              <h2 className="font-bold text-slate-800">Edit Content Block</h2>
              <div className="flex items-center gap-3">
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
                  <label className="block text-sm font-bold text-slate-700 mb-2">Block Title</label>
                  <input 
                    type="text" 
                    value={activeBlock.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-medium transition-all"
                    placeholder="e.g. Footer Contact Text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Unique Key <span className="text-xs font-normal text-slate-400">(Used in code)</span></label>
                  <input 
                    type="text" 
                    value={activeBlock.key}
                    onChange={(e) => handleChange("key", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono text-sm transition-all"
                    placeholder="e.g. footer_contact"
                  />
                </div>
              </div>

              <div className="flex-1 flex flex-col min-h-[400px]">
                <label className="block text-sm font-bold text-slate-700 mb-2">Block Content</label>
                <textarea 
                  value={activeBlock.content}
                  onChange={(e) => handleChange("content", e.target.value)}
                  className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-6 font-mono text-sm resize-none focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-800"
                  placeholder="Enter the raw text, HTML, or markdown for this block..."
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <LayoutTemplate className="w-16 h-16 mb-4 opacity-20" />
            <p className="font-medium text-lg text-slate-500">Select a content block to edit or create a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
