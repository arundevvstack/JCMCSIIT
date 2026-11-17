"use client";

import { useRef, useState } from "react";
import { Send } from "lucide-react";
import { submitContactMessage } from "@/app/actions/admissions";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const submittingRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submittingRef.current || isSubmitting) {
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    submittingRef.current = true;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await submitContactMessage(formData);
      if (result.success) {
        form.reset();
        setSuccessMessage(
          result.message ||
            "Thank you! Your message has been received by the JCMCSIIT office."
        );
        setIsSubmitted(true);
      } else {
        setErrorMessage(
          result.error ||
            "Failed to send message. Please check your details and try again."
        );
      }
    } catch {
      setErrorMessage(
        "Unable to send message right now. Please check your connection and try again."
      );
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-7 h-7 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          Message Sent!
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto">
          {successMessage}
        </p>
        <button
          type="button"
          onClick={() => {
            setErrorMessage(null);
            setIsSubmitted(false);
          }}
          className="mt-6 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {errorMessage ? (
        <div
          role="alert"
          className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-medium"
        >
          {errorMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-2">
            Full Name
          </label>
          <input
            required
            name="name"
            type="text"
            maxLength={255}
            disabled={isSubmitting}
            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-60"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-2">
            Email Address
          </label>
          <input
            required
            name="email"
            type="email"
            maxLength={255}
            disabled={isSubmitting}
            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-60"
            placeholder="you@email.com"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-600 mb-2">
          Subject
        </label>
        <input
          required
          name="subject"
          type="text"
          maxLength={200}
          disabled={isSubmitting}
          className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-60"
          placeholder="How can we help?"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-600 mb-2">
          Message
        </label>
        <textarea
          required
          name="message"
          rows={5}
          maxLength={4500}
          disabled={isSubmitting}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none disabled:opacity-60"
          placeholder="Write your message here..."
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 rounded-xl bg-foreground text-white font-semibold hover:bg-foreground/90 transition-all shadow-lg text-lg flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-wait"
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Sending...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" /> Send Message
          </>
        )}
      </button>
    </form>
  );
}
