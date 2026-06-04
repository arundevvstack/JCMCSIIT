"use client";

import { useState, useEffect, useRef } from "react";
import { X, Play } from "lucide-react";

const VIDEO_ID = "SG1LdJYv0XM";

export function VideoModal() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Trigger Button */}
      <button
        id="watch-profile-video-btn"
        onClick={() => setOpen(true)}
        className="group inline-flex h-16 items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-10 font-bold text-white transition-all hover:bg-white/10 hover:border-white/40 w-full sm:w-auto shadow-sm"
      >
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20 group-hover:bg-emerald-500 transition-colors duration-300 shrink-0">
          <Play className="h-4 w-4 text-white fill-white ml-0.5" />
        </span>
        <span className="text-lg tracking-wide">Watch Profile Video</span>
      </button>

      {/* Backdrop + Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          {/* Frosted glass backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" />

          {/* Dialog */}
          <div
            ref={dialogRef}
            className="relative z-10 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-[#0B1F3A] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                  <Play className="w-4 h-4 text-emerald-400 fill-emerald-400 ml-0.5" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">JCMCSIIT College Profile</p>
                  <p className="text-white/40 text-xs">John Cox Memorial C.S.I Institute of Technology</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close video"
                className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Embed */}
            <div className="relative w-full bg-black" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                title="JCMCSIIT College Profile Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>

            {/* Footer */}
            <div className="bg-[#0B1F3A] px-6 py-3 flex items-center justify-between">
              <p className="text-white/40 text-xs">© JCMCSIIT · Thiruvananthapuram, Kerala</p>
              <a
                href={`https://youtu.be/${VIDEO_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/40 hover:text-white transition-colors"
              >
                Open on YouTube ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
