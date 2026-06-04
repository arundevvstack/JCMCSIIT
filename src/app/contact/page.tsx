import { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | JCMCSIIT",
  description: "Get in touch with JCMCSIIT. Find our address, phone numbers, and email contacts.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-white relative">
      <div className="container px-4 md:px-6 relative z-10 mx-auto">

        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
            Get in Touch.
          </h1>
          <p className="text-slate-500 text-xl leading-relaxed max-w-2xl mx-auto">
            We're here to help. Reach out to us for admissions inquiries, campus visits, or general information.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-xl shadow-slate-200/50">
            <h2 className="text-2xl font-bold mb-8 text-foreground">Send a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Full Name</label>
                  <input type="text" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Email Address</label>
                  <input type="email" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="you@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Subject</label>
                <input type="text" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="How can we help?" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Message</label>
                <textarea rows={5} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" placeholder="Write your message here..." />
              </div>
              <button type="submit" className="w-full h-14 rounded-xl bg-foreground text-white font-semibold hover:bg-foreground/90 transition-all shadow-lg text-lg flex items-center justify-center gap-2">
                <Send className="h-5 w-5" /> Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-slate-50 rounded-3xl p-10 border border-slate-100">
              <h2 className="text-2xl font-bold mb-8 text-foreground">Contact Information</h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Campus Address</h3>
                    <p className="text-slate-500 leading-relaxed">Kannammoola, Medical College P.O,<br/>Thiruvananthapuram — 695011, Kerala, India</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                    <p className="text-slate-500">+91 94969 81555</p>
                    <p className="text-slate-500">+91 0471 2550474 / 2446949</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <p className="text-slate-500">principal@jcmcsiit.ac.in</p>
                    <p className="text-slate-500">jcmcsiit@gmail.com</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Office Hours</h3>
                    <p className="text-slate-500">Mon — Sat: 9:00 AM — 5:00 PM</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Map Embed */}
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.8!2d76.93!3d8.49!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sJCMCSIIT!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="JCMCSIIT Campus Location"
              ></iframe>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
