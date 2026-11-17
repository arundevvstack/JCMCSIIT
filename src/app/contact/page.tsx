import { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { ContactForm } from "./contact-form";
import { getPublicSiteSettings } from "@/lib/cms/site-settings";

export const metadata: Metadata = {
  title: "Contact Us | JCMCSIIT",
  description: "Get in touch with JCMCSIIT. Find our address, phone numbers, and email contacts.",
};

export default async function ContactPage() {
  const settings = await getPublicSiteSettings();
  const contact = settings.contact_info;

  const address = contact?.address || "Kannammoola, Medical College P.O,\nThiruvananthapuram — 695011, Kerala, India";
  const phones = contact?.phones && contact.phones.length > 0 ? contact.phones : ["+91 94969 81555", "+91 0471 2550474 / 2446949"];
  const emails = contact?.emails && contact.emails.length > 0 ? contact.emails : ["principal@jcmcsiit.ac.in", "jcmcsiit@gmail.com"];
  const officeHours = contact?.office_hours || "Mon — Sat: 9:00 AM — 5:00 PM";
  return (
    <main className="min-h-screen pt-32 pb-24 bg-white relative">
      <div className="container px-4 md:px-6 relative z-10 mx-auto">

        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
            Get in Touch.
          </h1>
          <p className="text-slate-500 text-xl leading-relaxed max-w-2xl mx-auto">
            We&apos;re here to help. Reach out to us for admissions inquiries, campus visits, or general information.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-xl shadow-slate-200/50">
            <h2 className="text-2xl font-bold mb-8 text-foreground">Send a Message</h2>
            <ContactForm />
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
                    <p className="text-slate-500 leading-relaxed whitespace-pre-line">{address}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                    {phones.map((phone, idx) => (
                      <p key={idx} className="text-slate-500">{phone}</p>
                    ))}
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    {emails.map((email, idx) => (
                      <p key={idx} className="text-slate-500">{email}</p>
                    ))}
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Office Hours</h3>
                    <p className="text-slate-500">{officeHours}</p>
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
