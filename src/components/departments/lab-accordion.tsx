'use client';

import { useState } from 'react';
import { ChevronDown, Wrench } from 'lucide-react';

interface Lab {
  name: string;
  room?: string;
  incharge?: string;
  instructor?: string;
  equipment?: string;
  experiments?: {
    part: string;
    list: string[];
  }[];
}

export function LabAccordion({ lab }: { lab: Lab }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-900">{lab.name}</h4>
            {(lab.incharge || lab.instructor) && (
              <p className="text-sm text-slate-500 mt-1">
                {lab.incharge && <span className="mr-3"><strong>In-charge:</strong> {lab.incharge}</span>}
                {lab.instructor && <span><strong>Instructor:</strong> {lab.instructor}</span>}
              </p>
            )}
          </div>
        </div>
        <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="p-6 border-t border-slate-200 bg-white space-y-6">
          {lab.room && (
            <div>
              <h5 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Room</h5>
              <p className="text-slate-700">{lab.room}</p>
            </div>
          )}
          
          {lab.equipment && (
            <div>
              <h5 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Major Equipment</h5>
              <p className="text-slate-700 leading-relaxed text-sm">{lab.equipment}</p>
            </div>
          )}

          {lab.experiments && lab.experiments.length > 0 && (
            <div>
              <h5 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">List of Experiments</h5>
              <div className="space-y-4">
                {lab.experiments.map((part, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {part.part && <h6 className="font-bold text-primary mb-2 text-sm">{part.part}</h6>}
                    <ul className="list-decimal pl-5 space-y-1 text-sm text-slate-700">
                      {part.list.map((exp, i) => (
                        <li key={i}>{exp}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
