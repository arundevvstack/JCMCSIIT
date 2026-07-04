import { Metadata } from "next";
import { Building2, Landmark, CreditCard, ScanLine } from "lucide-react";

export const metadata: Metadata = {
  title: "Online Payment | JCMCSIIT",
  description: "Make an online payment to John Cox Memorial CSI Institute of Technology using bank transfer or QR code.",
};

export default function OnlinePaymentPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-6 shadow-sm">
            <CreditCard className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Online Payment</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Securely pay your fees using bank transfer or by scanning our official QR code.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Bank Details Card */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200/60 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <Landmark className="text-blue-600 w-7 h-7" />
              Bank Details
            </h2>
            
            <div className="space-y-6">
              <div className="flex flex-col border-b border-slate-100 pb-4">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Account Name</span>
                <span className="text-lg font-bold text-slate-900">John Cox Memorial C.S.I Institute Of Technology</span>
              </div>
              
              <div className="flex flex-col border-b border-slate-100 pb-4">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">A/C No</span>
                <span className="text-2xl font-black text-blue-600 font-mono tracking-wider">40826096025</span>
              </div>
              
              <div className="flex flex-col border-b border-slate-100 pb-4">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">IFSC Code</span>
                <span className="text-xl font-bold text-slate-800 font-mono">SBIN0018145</span>
              </div>

              <div className="flex flex-col border-b border-slate-100 pb-4">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Bank</span>
                <span className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-slate-400" />
                  State Bank of India
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Branch</span>
                <span className="text-lg font-medium text-slate-700">Kumarapuram</span>
              </div>
            </div>
          </div>

          {/* QR Code Card */}
          <div className="bg-[#0B1F3A] rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden flex flex-col items-center justify-center text-center h-full">
            <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/3 -translate-x-1/3 pointer-events-none" />
            
            <div className="relative z-10 w-full flex flex-col items-center">
              <h2 className="text-xl font-bold text-emerald-400 mb-2 flex items-center gap-2">
                <ScanLine className="w-6 h-6" />
                Scan to Pay
              </h2>
              <p className="text-slate-300 text-sm mb-8">Please scan the below QR code to make payment</p>
              
              {/* QR Code Placeholder Box */}
              <div className="bg-white p-4 rounded-3xl shadow-2xl mb-8 transform transition-transform hover:scale-105 duration-300">
                <div className="w-48 h-48 sm:w-64 sm:h-64 border-4 border-dashed border-slate-200 rounded-2xl flex items-center justify-center bg-slate-50 relative overflow-hidden">
                   {/* In a real scenario, this would be an <Image> tag pointing to /images/payment-qr.png.
                       We are providing a placeholder indicating where to place the image. */}
                   <div className="text-slate-400 font-medium text-center px-4">
                      Upload your QR Code image to <br/><code className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded mt-2 block text-xs">/public/images/payment-qr.png</code><br/> and replace this div with an <code>&lt;Image&gt;</code> component.
                   </div>
                </div>
              </div>
              
              {/* Merchant Details */}
              <div className="bg-white/10 rounded-2xl p-6 w-full backdrop-blur-sm border border-white/10 text-left">
                <h3 className="font-bold text-lg mb-4 text-white uppercase tracking-wide">Merchant Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-slate-400 text-sm block mb-1">Entity Name</span>
                    <span className="font-semibold text-white tracking-wide">THE CHURCH OF SOUTH INDIA TRUST ASSOCIATION</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 text-sm block mb-1">MID</span>
                      <span className="font-mono text-emerald-400 tracking-wider">022211900275288</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-sm block mb-1">TID</span>
                      <span className="font-mono text-emerald-400 tracking-wider">YC021101</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
