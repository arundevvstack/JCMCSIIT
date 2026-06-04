import { Metadata } from "next";
import { ImageIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Photo Gallery | JCMCSIIT",
  description: "Explore campus life, events, and academic moments at JCMCSIIT through our photo gallery.",
};

const galleryCategories = [
  { name: "Campus", count: 24 },
  { name: "Events", count: 36 },
  { name: "Labs", count: 12 },
  { name: "Placements", count: 18 },
  { name: "Sports", count: 15 },
  { name: "Cultural Fest", count: 20 },
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-white relative">
      <div className="container px-4 md:px-6 relative z-10 mx-auto">

        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
            Gallery.
          </h1>
          <p className="text-slate-500 text-xl leading-relaxed max-w-2xl mx-auto">
            A visual journey through the campus, events, and the vibrant life at JCMCSIIT.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {galleryCategories.map((cat) => (
            <div key={cat.name} className="group relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 aspect-[4/3] flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-all duration-300">
              <div className="h-16 w-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <ImageIcon className="h-8 w-8 text-slate-400 group-hover:text-primary transition-colors" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-1">{cat.name}</h2>
              <p className="text-sm text-slate-500">{cat.count} photos</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
