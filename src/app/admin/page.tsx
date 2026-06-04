"use client";

import { useState } from "react";
import { Sparkles, Save, Eye, CheckCircle2 } from "lucide-react";

export default function AdminDashboard() {
  const [content, setContent] = useState("# Welcome to JCMCSIIT\\n\\nEdit this content block to update the department overview.");
  const [isRewriting, setIsRewriting] = useState(false);

  const handleAiRewrite = () => {
    setIsRewriting(true);
    // Mocking an AI call
    setTimeout(() => {
      setContent("# Welcome to JCMCSIIT\\n\\nDiscover the future of engineering. Our curriculum blends rigorous academics with cutting-edge AI integration to prepare you for global tech leadership.");
      setIsRewriting(false);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Pages", value: "42" },
          { label: "Faculty Profiles", value: "128" },
          { label: "Active Notices", value: "5" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <span className="text-slate-500 text-sm font-medium mb-2">{stat.label}</span>
            <span className="text-3xl font-bold text-slate-800">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <h2 className="font-semibold text-slate-800">Quick Editor: Department Overview</h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleAiRewrite}
              disabled={isRewriting}
              className="flex items-center px-4 py-2 bg-secondary/10 text-secondary rounded-lg text-sm font-medium hover:bg-secondary/20 transition-colors disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isRewriting ? "Rewriting..." : "AI Enhance"}
            </button>
            <button className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              <Eye className="h-4 w-4 mr-2 text-slate-400" />
              Preview
            </button>
            <button className="flex items-center px-4 py-2 bg-foreground text-white rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors">
              <Save className="h-4 w-4 mr-2" />
              Publish
            </button>
          </div>
        </div>
        
        <div className="flex-1 p-6 flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-600">Markdown Content</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 w-full border border-slate-200 rounded-xl p-4 font-mono text-sm resize-none focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-slate-800 bg-white"
            placeholder="Write markdown here..."
          />
        </div>
      </div>

    </div>
  );
}
