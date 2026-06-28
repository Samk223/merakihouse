import { FC, useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Are Meraki House products suitable for all skin & hair types?",
    answer: "Yes, our botanical formulas are carefully crafted for all skin and hair types, including sensitive skin and chemically treated hair. We prioritize gentle, pH-balanced, plant-derived ingredients.",
  },
  {
    question: "How do I store my Shampoo Bars to make them last longer?",
    answer: "To extend the life of your shampoo bars, store them on a well-draining soap dish or hanger outside the direct stream of water. Allow them to air-dry completely between washes.",
  },
  {
    question: "Are your products 100% natural and cruelty-free?",
    answer: "Yes! All Meraki House products are 100% cruelty-free, vegan, and handcrafted with sustainably sourced botanical extracts, free of synthetic sulfates, parabens, and silicones.",
  },
  {
    question: "How long does shipping take within India?",
    answer: "We process orders within 24-48 hours. Shipping typically takes 3 to 5 business days across major cities in India, and 5 to 7 days for regional districts.",
  },
  {
    question: "Do you offer plastic-free packaging?",
    answer: "Yes, sustainability is at our core. We ship all products in 100% plastic-free, biodegradable, and recyclable cardboard boxes with paper tape and starch-based cushioning.",
  },
  {
    question: "What is your return policy?",
    answer: "Due to the personal nature of skincare and hygiene items, we do not accept returns. However, if your order arrives damaged or incorrect, please reach out within 48 hours for a replacement.",
  },
];

export const FAQ: FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full py-20 md:py-28 bg-[#FAF6F0] flex items-center justify-center">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 px-6 md:px-12">
        
        {/* Left Column: Heading and Tagline with explicit width constraints */}
        <div className="lg:col-span-5 text-left w-full">
          <style>{`
            @keyframes popQuestion1 {
              0% { transform: translate(-50%, -50%) translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
              10% { opacity: 1; }
              80% { opacity: 1; }
              100% { transform: translate(-50%, -50%) translate(-28px, -28px) scale(1) rotate(-15deg); opacity: 0; }
            }
            @keyframes popQuestion2 {
              0% { transform: translate(-50%, -50%) translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
              10% { opacity: 1; }
              80% { opacity: 1; }
              100% { transform: translate(-50%, -50%) translate(28px, -28px) scale(1) rotate(15deg); opacity: 0; }
            }
            @keyframes popQuestion3 {
              0% { transform: translate(-50%, -50%) translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
              10% { opacity: 1; }
              80% { opacity: 1; }
              100% { transform: translate(-50%, -50%) translate(-32px, 6px) scale(1) rotate(-30deg); opacity: 0; }
            }
            @keyframes popQuestion4 {
              0% { transform: translate(-50%, -50%) translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
              10% { opacity: 1; }
              80% { opacity: 1; }
              100% { transform: translate(-50%, -50%) translate(32px, 6px) scale(1) rotate(30deg); opacity: 0; }
            }
            @keyframes popQuestion5 {
              0% { transform: translate(-50%, -50%) translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
              10% { opacity: 1; }
              80% { opacity: 1; }
              100% { transform: translate(-50%, -50%) translate(-14px, 28px) scale(1) rotate(-45deg); opacity: 0; }
            }
            @keyframes popQuestion6 {
              0% { transform: translate(-50%, -50%) translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
              10% { opacity: 1; }
              80% { opacity: 1; }
              100% { transform: translate(-50%, -50%) translate(14px, 28px) scale(1) rotate(45deg); opacity: 0; }
            }
          `}</style>
          <span className="block font-body font-medium text-[#7A4B54] text-xs sm:text-sm tracking-[0.2em] uppercase select-none w-full">
            FAQ
          </span>
          <h2 className="block font-body font-light text-3xl md:text-[2.25rem] leading-[1.3] text-[#2C293E] mt-3 w-full md:w-[420px] max-w-full relative cursor-heart group/title px-4 py-1">
            Everything you might be interested in about Meraki House on one page.
            
            {/* Question Mark Burst Elements (Question Bomb) */}
            <span className="absolute top-1/2 left-1/2 font-body font-light text-xl text-[#7A4B54] opacity-0 pointer-events-none group-hover/title:animate-[popQuestion1_0.6s_cubic-bezier(0.3,0,0,1)_forwards] select-none">?</span>
            <span className="absolute top-1/2 left-1/2 font-body font-light text-2xl text-[#9D6C76] opacity-0 pointer-events-none group-hover/title:animate-[popQuestion2_0.6s_cubic-bezier(0.3,0,0,1)_forwards] select-none">?</span>
            <span className="absolute top-1/2 left-1/2 font-body font-light text-lg text-[#A9787C] opacity-0 pointer-events-none group-hover/title:animate-[popQuestion3_0.6s_cubic-bezier(0.3,0,0,1)_forwards] select-none">?</span>
            <span className="absolute top-1/2 left-1/2 font-body font-light text-2xl text-[#FAF6F0] opacity-0 pointer-events-none group-hover/title:animate-[popQuestion4_0.6s_cubic-bezier(0.3,0,0,1)_forwards] select-none">?</span>
            <span className="absolute top-1/2 left-1/2 font-body font-light text-xl text-[#7A4B54] opacity-0 pointer-events-none group-hover/title:animate-[popQuestion5_0.6s_cubic-bezier(0.3,0,0,1)_forwards] select-none">?</span>
            <span className="absolute top-1/2 left-1/2 font-body font-light text-2xl text-[#FAF6F0] opacity-0 pointer-events-none group-hover/title:animate-[popQuestion6_0.6s_cubic-bezier(0.3,0,0,1)_forwards] select-none">?</span>
          </h2>
        </div>

        {/* Right Column: Interactive Accordion stack */}
        <div className="lg:col-span-7 w-full flex flex-col justify-start">
          <div className="w-full border-t border-primary/10">
            {faqData.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="border-b border-primary/10 py-5 transition-colors duration-300">
                  
                  {/* Question Toggle Button */}
                  <button
                    type="button"
                    onClick={() => toggleFAQ(idx)}
                    className="w-full flex justify-between items-center text-left py-1 cursor-heart group/btn select-none focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    {/* Dark charcoal question text, transitioning to deep burgundy on hover/active */}
                    <span className={`font-body font-medium text-sm sm:text-base pr-4 transition-colors duration-300 ${
                      isOpen ? "text-[#7A4B54]" : "text-[#2C293E] group-hover/btn:text-[#7A4B54]"
                    }`}>
                      {item.question}
                    </span>
                    
                    {/* Down/Up Arrow Indicator with increased color weight */}
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth="2.5" 
                      stroke="currentColor" 
                      className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#7A4B54]" : "text-dark/60 group-hover/btn:text-[#7A4B54]"
                      }`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                    </svg>
                  </button>

                  {/* Accordion Smooth Height Expansion and Fade */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.3,0,0,1)] ${
                      isOpen ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"
                    }`}
                  >
                    {/* Rich legible charcoal text for answer descriptions */}
                    <p className="font-body font-light text-[#4A4A58] text-xs sm:text-sm leading-relaxed max-w-2xl">
                      {item.answer}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
