import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Building2, ShieldCheck, AlertCircle, FileText, Phone, Mail, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Fee Payment | JCMCSIIT',
  description: 'Online fee payment guidelines and bank account details for JCMCSIIT admissions.',
};

export default function PaymentPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-emerald-500/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-blue-500/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

      <div className="container px-4 md:px-8 mx-auto relative z-10 max-w-7xl">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link href="/admissions" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Admissions
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 mb-6 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700 uppercase tracking-widest">Secure Payments</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6">
            Fee <span className="text-emerald-600">Payment</span>
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            Remit your tuition, admission, or hostel fees securely. Choose between online payment gateways or direct bank transfers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Online Payment Portal Card */}
            <div className="bg-[#0B1F3A] rounded-[2rem] p-8 md:p-10 border border-blue-900 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
              
              <div className="flex items-center gap-5 mb-8 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                  <CreditCard className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Online Payment Gateway</h2>
                  <p className="text-sm font-medium text-white/60">Pay via UPI, Debit/Credit Card, or Netbanking</p>
                </div>
              </div>

              <p className="text-white/80 leading-relaxed mb-8 relative z-10">
                You can pay your admission fees instantly using our secure online payment gateway. Once the transaction is successful, please save the receipt for your records.
              </p>

              <div className="relative z-10 flex flex-col sm:flex-row gap-4">
                <button className="inline-flex items-center justify-center gap-2 bg-emerald-500 text-white font-bold py-4 px-8 rounded-xl hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-emerald-500/20">
                  Proceed to Pay <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Direct Bank Transfer Details */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-4 px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shrink-0">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xl">Direct Bank Transfer</h3>
                  <p className="text-sm text-slate-500">NEFT / RTGS / IMPS</p>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Account Name</p>
                    <p className="font-bold text-slate-800 text-lg">Principal, JCMCSIIT</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Bank Name</p>
                    <p className="font-bold text-slate-800 text-lg">State Bank of India (SBI)</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Account Number</p>
                    <div className="flex items-center gap-3">
                      <p className="font-mono font-bold text-blue-600 text-xl bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">XXXX XXXX XXXX</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">IFSC Code</p>
                    <p className="font-mono font-bold text-slate-800 text-xl">SBIN00XXXXX</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Branch</p>
                    <p className="font-bold text-slate-800">Kannammoola Branch, Thiruvananthapuram</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 border-t border-amber-100 px-8 py-5 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 leading-relaxed font-medium">
                  After successful bank transfer, please email the transaction reference number (UTR), student name, and application ID to the accounts office for verification.
                </p>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Guidelines */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Payment Guidelines
              </h3>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                  </span>
                  <span className="text-sm text-slate-600 leading-relaxed font-medium">Ensure you have your Application ID or Roll Number ready before initiating payment.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                  </span>
                  <span className="text-sm text-slate-600 leading-relaxed font-medium">Do not refresh the page or press the back button while the payment is processing.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                  </span>
                  <span className="text-sm text-slate-600 leading-relaxed font-medium">Keep a digital or printed copy of the payment receipt.</span>
                </li>
              </ul>
            </div>

            {/* Helpdesk */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Need Help?</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                If you face any issues during the payment process or need to confirm a transaction, reach out to our accounts department.
              </p>
              
              <div className="space-y-4">
                <a href="tel:04712550474" className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 border border-slate-100 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-emerald-600 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Accounts Office</p>
                    <p className="font-bold text-slate-800">0471 - 2550474</p>
                  </div>
                </a>
                
                <a href="mailto:info@jcmcsiit.ac.in" className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-slate-100 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Email Support</p>
                    <p className="font-bold text-slate-800 text-sm">info@jcmcsiit.ac.in</p>
                  </div>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
