import { Metadata } from "next";
import { Award, Users, BookOpen, Calendar, ShieldCheck, Building } from "lucide-react";
import { getPublicContentBlocks } from "@/lib/cms/content-blocks";

export const metadata: Metadata = {
    title: "About Us | JCMCSIIT",
    description:
        "Learn about the heritage, mission, and vision of John Cox Memorial CSI Institute of Technology, Trivandrum.",
};

export default async function AboutPage() {
    const blocks = await getPublicContentBlocks([
        "about_intro",
        "about_mission",
        "about_vision",
        "about_heritage",
    ]);

    const introText =
        blocks.about_intro?.content ||
        "John Cox Memorial CSI Institute of Technology (JCMCSIIT) is an AICTE-approved, NBA-accredited engineering institution affiliated to APJ Abdul Kalam Technological University (KTU), located in the heart of Trivandrum, Kerala.";

    const missionText =
        blocks.about_mission?.content ||
        "To provide quality technical education that fosters innovation, critical thinking, and ethical values, producing graduates who are globally competent engineers and responsible citizens.";

    const visionText =
        blocks.about_vision?.content ||
        "To emerge as a center of excellence in engineering education and research, producing innovative leaders who contribute to the technological and socio-economic development of the nation.";

    const heritageText =
        blocks.about_heritage?.content ||
        `The institution was established in 2002 under the auspices of the Church of South India (CSI), Diocese of South Kerala, as a memorial to the late Rev. John Cox, a revered church leader and educator who dedicated his life to the upliftment of the community through knowledge.\n\nLocated in Kannammoola, adjacent to the Government Medical College in Thiruvananthapuram, the campus provides a vibrant academic atmosphere with modern facilities, laboratories, and a well-stocked library.\n\nOver the past two decades, JCMCSIIT has grown into a respected institution known for its strong placement records, dedicated faculty, and a curriculum that blends traditional engineering fundamentals with emerging technologies like AI, Robotics, and IoT.`;

    return (
        <main className="min-h-screen pt-40 pb-32 bg-white relative">
            <div className="layout-grid relative z-10">
                {/* Hero */}
                <div className="max-w-4xl mx-auto text-center mb-28">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-slate-900 leading-[1.1]">
                        About JCMCSIIT.
                    </h1>
                    <p className="text-slate-500 text-xl md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto">
                        {introText}
                    </p>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto mb-28">
                    <div className="bg-slate-50/50 rounded-[2.5rem] p-12 border border-slate-200/60 transition-all duration-300 hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:border-slate-200">
                        <div className="h-16 w-16 rounded-[1.25rem] bg-white border border-slate-200 flex items-center justify-center mb-8 shadow-sm">
                            <ShieldCheck className="h-8 w-8 text-slate-900" />
                        </div>
                        <h2 className="text-3xl font-bold mb-5 text-slate-900">
                            Our Mission
                        </h2>
                        <p className="text-slate-500 font-medium leading-relaxed text-lg whitespace-pre-line">
                            {missionText}
                        </p>
                    </div>
                    <div className="bg-slate-50/50 rounded-[2.5rem] p-12 border border-slate-200/60 transition-all duration-300 hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:border-slate-200">
                        <div className="h-16 w-16 rounded-[1.25rem] bg-white border border-slate-200 flex items-center justify-center mb-8 shadow-sm">
                            <Award className="h-8 w-8 text-slate-900" />
                        </div>
                        <h2 className="text-3xl font-bold mb-5 text-slate-900">
                            Our Vision
                        </h2>
                        <p className="text-slate-500 font-medium leading-relaxed text-lg whitespace-pre-line">
                            {visionText}
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-32">
                    {[
                        { label: "Established", value: "2002", icon: Calendar },
                        { label: "Faculty Members", value: "130+", icon: Users },
                        { label: "Programs Offered", value: "7", icon: BookOpen },
                        { label: "Campus Acres", value: "15+", icon: Building },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm text-center group hover:border-slate-300 hover:shadow-md transition-all duration-300"
                        >
                            <stat.icon className="h-8 w-8 text-slate-400 group-hover:text-primary mx-auto mb-5 transition-colors" />
                            <div className="text-4xl font-bold text-slate-900 mb-2">
                                {stat.value}
                            </div>
                            <div className="text-[13px] font-semibold uppercase tracking-wider text-slate-500">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* History */}
                <div className="max-w-4xl mx-auto mb-32">
                    <h2 className="text-4xl font-bold mb-10 text-slate-900 text-center">
                        Our Heritage
                    </h2>
                    <div className="space-y-6 text-slate-600 font-medium text-xl leading-relaxed whitespace-pre-line">
                        {heritageText}
                    </div>
                </div>

                {/* Approvals */}
                <div className="bg-slate-50/80 rounded-[2.5rem] p-12 border border-slate-200/60 max-w-5xl mx-auto relative overflow-hidden">
                    <div className="text-center max-w-2xl mx-auto">
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">
                            Accreditations & Affiliations
                        </h3>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Approved by the All India Council for Technical Education (AICTE), New Delhi, and affiliated to APJ Abdul Kalam Technological University (KTU), Kerala.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
