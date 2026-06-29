import Link from "next/link";
import Image from "next/image";

export function SmartFooter() {
  return (
    <footer className="w-full font-sans border-t border-slate-200">
      {/* Top Section - White Background */}
      <div className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl flex flex-col lg:flex-row gap-12 lg:gap-8">
          
          {/* Link Columns */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            
            {/* Column 1 */}
            <div>
              <h3 className="text-[13px] font-bold text-[#1c4762] mb-4 tracking-wider uppercase">B.Tech</h3>
              <ul className="space-y-3">
                <li><Link href="/academics/departments/aiml" className="text-sm text-slate-700 hover:underline">AI & ML</Link></li>
                <li><Link href="/academics/departments/biomedical-robotic" className="text-sm text-slate-700 hover:underline">Biomedical & Robotic</Link></li>
                <li><Link href="/academics/departments/civil" className="text-sm text-slate-700 hover:underline">Civil</Link></li>
                <li><Link href="/academics/departments/cse" className="text-sm text-slate-700 hover:underline">Computer Science</Link></li>
                <li><Link href="/academics/departments/ece" className="text-sm text-slate-700 hover:underline">Electronics & Comm</Link></li>
                <li><Link href="/academics/departments/eee" className="text-sm text-slate-700 hover:underline">Electrical & Electronics</Link></li>
                <li><Link href="/academics/departments/mechanical" className="text-sm text-slate-700 hover:underline">Mechanical</Link></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h3 className="text-[13px] font-bold text-[#1c4762] mb-4 tracking-wider uppercase">Diploma</h3>
              <ul className="space-y-3">
                <li><Link href="/academics/departments/diploma-civil-engineering" className="text-sm text-slate-700 hover:underline">Civil</Link></li>
                <li><Link href="/academics/departments/diploma-computer-engineering" className="text-sm text-slate-700 hover:underline">Computer</Link></li>
                <li><Link href="/academics/departments/diploma-electronics-communication" className="text-sm text-slate-700 hover:underline">Electronics & Comm</Link></li>
                <li><Link href="/academics/departments/diploma-electrical-engineering" className="text-sm text-slate-700 hover:underline">Electrical</Link></li>
                <li><Link href="/academics/departments/diploma-mechanical-engineering" className="text-sm text-slate-700 hover:underline">Mechanical</Link></li>
                <li className="pt-4"><h3 className="text-[13px] font-bold text-[#1c4762] mb-3 tracking-wider uppercase">Research</h3></li>
                <li><Link href="/research/centers" className="text-sm text-slate-700 hover:underline">Research Centers</Link></li>
                <li><Link href="/research/labs" className="text-sm text-slate-700 hover:underline">Innovation Labs</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h3 className="text-[13px] font-bold text-[#1c4762] mb-4 tracking-wider uppercase">Placements</h3>
              <ul className="space-y-3">
                <li><Link href="/placements/statistics" className="text-sm text-slate-700 hover:underline">Placement Statistics</Link></li>
                <li><Link href="/placements/recruiters" className="text-sm text-slate-700 hover:underline">Top Recruiters</Link></li>
                <li className="pt-4"><h3 className="text-[13px] font-bold text-[#1c4762] mb-3 tracking-wider uppercase">Campus Life</h3></li>
                <li><Link href="/about/campus-overview/housing" className="text-sm text-slate-700 hover:underline">Hostels & Housing</Link></li>
                <li><Link href="/about/campus-overview/clubs" className="text-sm text-slate-700 hover:underline">Student Clubs</Link></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h3 className="text-[13px] font-bold text-[#1c4762] mb-4 tracking-wider uppercase">Admission</h3>
              <ul className="space-y-3">
                <li><Link href="/admissions/ug" className="text-sm text-slate-700 hover:underline">Undergraduate</Link></li>
                <li><Link href="/admissions/pg" className="text-sm text-slate-700 hover:underline">Postgraduate</Link></li>
                <li><Link href="/admissions/financial-aid" className="text-sm text-slate-700 hover:underline">Financial Aid & Scholarships</Link></li>
                <li className="pt-4"><h3 className="text-[13px] font-bold text-[#1c4762] mb-3 tracking-wider uppercase">About</h3></li>
                <li><Link href="/about/history" className="text-sm text-slate-700 hover:underline">History</Link></li>
                <li><Link href="/about/accreditation" className="text-sm text-slate-700 hover:underline">Accreditation</Link></li>
              </ul>
            </div>

            {/* Column 5 */}
            <div>
              <h3 className="text-[13px] font-bold text-[#1c4762] mb-4 tracking-wider uppercase">Resources</h3>
              <ul className="space-y-3">
                <li><Link href="/downloads/resources/map" className="text-sm text-slate-700 hover:underline">Campus Map</Link></li>
                <li><Link href="/downloads/resources/library" className="text-sm text-slate-700 hover:underline">Central Library</Link></li>
                <li><Link href="/downloads/resources/directory" className="text-sm text-slate-700 hover:underline">Directory</Link></li>
                <li><Link href="/downloads/resources/alumni" className="text-sm text-slate-700 hover:underline">Alumni Network</Link></li>
              </ul>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="w-full lg:w-48 flex flex-col gap-3 shrink-0">
            <Link href="/admissions/apply" className="flex items-center justify-center py-2 px-4 border border-slate-300 text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors bg-white shadow-sm">
              Applying
            </Link>
            <Link href="/about/campus-overview/visit" className="flex items-center justify-center py-2 px-4 border border-slate-300 text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors bg-white shadow-sm">
              Visiting
            </Link>
            <Link href="/campus-life/alumni/giving" className="flex items-center justify-center py-2 px-4 border border-slate-300 text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors bg-white shadow-sm">
              Giving
            </Link>
            <Link href="/about/careers" className="flex items-center justify-center py-2 px-4 border border-slate-300 text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors bg-white shadow-sm">
              Careers
            </Link>
            <Link href="/about/faculty-positions" className="flex items-center justify-center py-2 px-4 border border-slate-300 text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors bg-white shadow-sm">
              Faculty Positions
            </Link>
            <Link href="/contact" className="flex items-center justify-center py-2 px-4 border border-slate-300 text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors bg-white shadow-sm">
              Contact
            </Link>
          </div>
          
        </div>
      </div>

      {/* Bottom Section - Primary Brand Color */}
      <div className="bg-[#1c4762] text-white py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl flex flex-col md:flex-row gap-8 items-start">
          
          {/* Logo / Brand Name */}
          <div className="w-full md:w-48 shrink-0">
            <Link href="/" className="inline-flex flex-col">
              <span className="text-2xl font-bold tracking-tight leading-none mb-1 font-editorial">JCMCSIIT</span>
              <span className="text-[10px] uppercase tracking-widest font-semibold opacity-80">University</span>
            </Link>
          </div>

          {/* Links & Copyright */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Top horizontal links */}
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <Link href="/" className="text-[13px] font-bold hover:underline">JCMCSIIT Home</Link>
              <Link href="/downloads/resources/map" className="text-[13px] font-bold hover:underline">Maps & Directions</Link>
              <Link href="/search" className="text-[13px] font-bold hover:underline">Search JCMCSIIT</Link>
              <Link href="/about/emergency" className="text-[13px] font-bold hover:underline">Emergency Info</Link>
            </div>

            {/* Bottom horizontal links */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-white/80">
              <Link href="/terms" className="text-[12px] hover:underline hover:text-white">Terms of Use</Link>
              <Link href="/privacy" className="text-[12px] hover:underline hover:text-white">Privacy</Link>
              <Link href="/copyright" className="text-[12px] hover:underline hover:text-white">Copyright</Link>
              <Link href="/trademarks" className="text-[12px] hover:underline hover:text-white">Trademarks</Link>
              <Link href="/non-discrimination" className="text-[12px] hover:underline hover:text-white">Non-Discrimination</Link>
              <Link href="/accessibility" className="text-[12px] hover:underline hover:text-white">Accessibility</Link>
            </div>

            {/* Copyright Text */}
            <div className="text-[11px] text-white/60 pt-2">
              © {new Date().getFullYear()} John Cox Memorial CSI Institute of Technology. Kannammoola, Trivandrum, Kerala 695011.
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
