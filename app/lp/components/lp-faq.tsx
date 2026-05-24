"use client";

import { useState } from "react";

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

type FAQ = {
  question: string;
  answer: string;
};

type LPFAQProps = {
  /** Section heading */
  heading?: string;
  /** FAQs to display */
  faqs: FAQ[];
};

/**
 * FAQ accordion section for landing pages.
 */
export function LPFAQ({ heading = "Frequently Asked Questions", faqs }: LPFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 px-6" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto">
        <h2
          id="faq-heading"
          className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
        >
          {heading}
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-white pr-4">
                  {faq.question}
                </span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-transform ${
                    openIndex === index ? "rotate-45" : ""
                  }`}
                >
                  <PlusIcon className="h-4 w-4" />
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LPFAQ;
