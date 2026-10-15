"use client";

import { useEffect, useState } from "react";
import { GRADUATION_EVENT } from "@/lib/graduation-event";

const POSTER_SRC = GRADUATION_EVENT.poster;
const REGISTRATION_URL = GRADUATION_EVENT.registerLink;

/**
 * Graduation & Course Completion Ceremony 2026 announcement popup.
 * Mounted once in the root layout; dismissal lasts for the current page session
 * (in-memory state only — no cookies or storage).
 */
export function GraduationPopup() {
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setOpen(false);
    img.src = POSTER_SRC;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, []);

  const visible = open && loaded;

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="graduation-popup-title"
      onClick={() => setOpen(false)}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-300"
    >
      <h2 id="graduation-popup-title" className="sr-only">
        Graduation and Course Completion Ceremony 2026 — John Cox Memorial CSI
        Institute of Technology (JCMCSIIT). 7 November 2026, 6:00 PM, JIT
        Campus. Register by 20 October 2026.
      </h2>

      <div
        className="relative flex max-h-full max-w-full flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="graduation-popup-close"
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close graduation announcement"
          autoFocus
          className="absolute -right-3 -top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl leading-none text-black shadow-lg ring-1 ring-black/10 transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <span aria-hidden="true">×</span>
        </button>

        <a
          id="graduation-popup-register"
          href={REGISTRATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Register for the Graduation and Course Completion Ceremony 2026 (opens Google Form in a new tab)"
          className="block"
        >
          {/* Plain <img> keeps the original poster file untouched (no optimisation/re-encoding). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={POSTER_SRC}
            alt="Graduation and Course Completion Ceremony 2026 poster — JCMCSIIT, 7 November 2026, 6:00 PM, JIT Campus. Registration deadline 20 October 2026."
            className="block h-auto w-auto rounded-md object-contain shadow-2xl"
            style={{ maxWidth: "min(92vw, 720px)", maxHeight: "calc(100dvh - 7rem)" }}
          />
        </a>

        <a
          href={REGISTRATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black shadow-lg transition-colors hover:bg-neutral-200"
        >
          Register Now
        </a>
      </div>
    </div>
  );
}
