import { Metadata } from "next";
import { Tent, Wifi, Utensils, ShieldCheck, Dumbbell, BookOpen, Bus } from "lucide-react";

export const metadata: Metadata = {
  title: "Campus Life | JCMCSIIT",
  description: "Experience the vibrant campus life, facilities, and student activities at JCMCSIIT.",
};

const facilities = [
  { title: "Smart Classrooms", desc: "Digitally equipped lecture halls with interactive boards and projectors.", icon: BookOpen },
  { title: "Wi-Fi Campus", desc: "High-speed internet connectivity across all buildings and hostels.", icon: Wifi },
  { title: "Cafeteria", desc: "Spacious dining area serving nutritious meals at subsidized rates.", icon: Utensils },
  { title: "Sports Complex", desc: "Indoor and outdoor sports facilities for basketball, cricket, football, and badminton.", icon: Dumbbell },
  { title: "Transport", desc: "College buses covering major routes across Thiruvananthapuram.", icon: Bus },
  { title: "Security", desc: "24/7 CCTV surveillance and security personnel across the campus.", icon: ShieldCheck },
];

export default function CampusLifePage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-white relative">
      <div className="container px-4 md:px-6 relative z-10 mx-auto">

        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
            Campus Life.
          </h1>
          <p className="text-slate-500 text-xl leading-relaxed max-w-2xl mx-auto">
            A modern, well-equipped campus designed to inspire learning, collaboration, and personal growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {facilities.map((facility) => (
            <div key={facility.title} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
                <facility.icon className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-3 text-foreground">{facility.title}</h2>
              <p className="text-slate-500 leading-relaxed">{facility.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 rounded-3xl p-10 border border-slate-200 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-foreground text-center">Student Clubs & Activities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["IEEE Student Branch", "NSS Unit", "Robotics Club", "Coding Club", "Entrepreneurship Cell", "Cultural Committee", "Debate Society", "Photography Club"].map((club) => (
              <div key={club} className="p-4 rounded-xl bg-white border border-slate-100 text-center shadow-sm">
                <p className="text-sm font-semibold text-slate-700">{club}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
