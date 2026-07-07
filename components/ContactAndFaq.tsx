'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ChevronDown, 
  ExternalLink, 
  Facebook, 
  Instagram, 
  ShieldCheck, 
  Calendar 
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface FAQ {
  id?: string;
  question: string;
  answer: string;
  display_order?: number;
}

interface StudioHour {
  id?: string;
  day_of_week: string;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
}

const DEFAULT_FAQS: FAQ[] = [
  {
    question: "How much does a tattoo cost?",
    answer: "Tattoo pricing depends on the size, detail, style, and placement of the design. My studio minimum charge is £50, which covers setups and small pieces. For custom designs or larger pieces, I will provide a clear, upfront price estimate after you submit your booking inquiry."
  },
  {
    question: "Do I need to leave a deposit?",
    answer: "Yes, all appointments require a non-refundable deposit to secure your date and time on my calendar. This deposit secures your booking and goes directly toward the final cost of your tattoo on the day of your session."
  },
  {
    question: "Can you cover up an old tattoo?",
    answer: "Yes! I specialize in custom cover-ups. However, cover-ups are highly dependent on the size, darkness, and age of your existing tattoo. Please submit a photo of your current tattoo alongside your design ideas in the booking form so I can evaluate what is possible."
  },
  {
    question: "Does getting a tattoo hurt?",
    answer: "Pain is subjective and varies depending on the placement on your body. Most clients describe it as a warm, scratchy sensation. I work efficiently and make sure you have opportunities to take short breaks during your session if you need them."
  },
  {
    question: "Is your studio licensed and safe?",
    answer: "Absolutely. I operate a fully licensed studio registered with the Caerphilly County Borough Council. I follow strict environmental health standards, use medical-grade sanitization, and utilize 100% single-use sterile needles and disposable equipment for every client."
  },
  {
    question: "Can I bring a friend with me to my appointment?",
    answer: "To maintain a clean, quiet, and focused working environment, I ask that you attend your appointment alone. If you have special circumstances and need to bring a guest, please discuss this with me prior to your session."
  }
];

const DEFAULT_HOURS: StudioHour[] = [
  { day_of_week: "Monday", open_time: null, close_time: null, is_closed: true },
  { day_of_week: "Tuesday", open_time: "10:00 AM", close_time: "06:00 PM", is_closed: false },
  { day_of_week: "Wednesday", open_time: "10:00 AM", close_time: "06:00 PM", is_closed: false },
  { day_of_week: "Thursday", open_time: "10:00 AM", close_time: "06:00 PM", is_closed: false },
  { day_of_week: "Friday", open_time: "10:00 AM", close_time: "06:00 PM", is_closed: false },
  { day_of_week: "Saturday", open_time: "10:00 AM", close_time: "06:00 PM", is_closed: false },
  { day_of_week: "Sunday", open_time: null, close_time: null, is_closed: true }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};

export function ContactAndFaq() {
  const [faqs, setFaqs] = useState<FAQ[]>(DEFAULT_FAQS);
  const [hours, setHours] = useState<StudioHour[]>(DEFAULT_HOURS);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: faqData, error: faqError } = await supabase
          .from('faqs')
          .select('question, answer, display_order')
          .order('display_order', { ascending: true });
        
        if (!faqError && faqData && faqData.length > 0) {
          setFaqs(faqData);
        }

        const { data: hourData, error: hourError } = await supabase
          .from('studio_hours')
          .select('day_of_week, open_time, close_time, is_closed');

        if (!hourError && hourData && hourData.length > 0) {
          // Keep chronological order of days
          const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
          const sortedHours = [...hourData].sort((a, b) => 
            dayOrder.indexOf(a.day_of_week) - dayOrder.indexOf(b.day_of_week)
          );
          setHours(sortedHours);
        }
      } catch (err) {
        console.error("Error fetching ContactAndFaq data:", err);
      }
    }
    fetchData();
  }, []);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <section 
      id="contact-and-faq" 
      className="bg-[#000000] text-[#FAFAFA] py-24 px-4 sm:px-6 lg:px-8 border-t border-neutral-900 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-[#D4AF37] block mb-3">
            Location, Hours & Help
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold font-Oswald uppercase tracking-tight text-white">
            Get in Touch & Find the Studio
          </h2>
          <p className="mt-4 text-neutral-400 max-w-2xl mx-auto text-base sm:text-lg">
            Located in Gilfach Bargoed. Stop by for your scheduled session or reach out to ask a question.
          </p>
        </div>

        {/* Two Column Layout */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Left Column: Contact Cards, Map & Hours */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Essential Contact info */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-xl font-bold font-Oswald uppercase text-white tracking-wider border-b border-neutral-800 pb-2">
                Studio Details
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Address Card */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-950 border border-neutral-900 hover:border-[#D4AF37]/30 transition-colors">
                  <div className="p-3 rounded-lg bg-neutral-900 text-[#D4AF37]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-mono text-xs text-[#D4AF37] uppercase tracking-wider">Address</h4>
                    <p className="mt-1 text-sm font-semibold text-white leading-relaxed">
                      6A Gwerthonor Place<br />
                      Gilfach Bargoed<br />
                      CF81 8JQ<br />
                      United Kingdom
                    </p>
                  </div>
                </div>

                {/* Direct Communications */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <a 
                    href="tel:07729357006" 
                    className="flex items-center gap-4 p-4 rounded-xl bg-neutral-950 border border-neutral-900 hover:border-[#D4AF37] transition-all group"
                  >
                    <div className="p-3 rounded-lg bg-neutral-900 text-[#D4AF37] group-hover:bg-[#D4AF37]/10 transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-mono text-xs text-neutral-400 uppercase">Call Directly</h4>
                      <p className="mt-0.5 text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                        07729357006
                      </p>
                    </div>
                  </a>

                  {/* Email */}
                  <a 
                    href="mailto:Nllewellyn975682@aol.com" 
                    className="flex items-center gap-4 p-4 rounded-xl bg-neutral-950 border border-neutral-900 hover:border-[#D4AF37] transition-all group"
                  >
                    <div className="p-3 rounded-lg bg-neutral-900 text-[#D4AF37] group-hover:bg-[#D4AF37]/10 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-mono text-xs text-neutral-400 uppercase">Send Email</h4>
                      <p className="mt-0.5 text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors truncate">
                        Nllewellyn975682@aol.com
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Interactive Map Block */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-xl font-bold font-Oswald uppercase text-white tracking-wider border-b border-neutral-800 pb-2">
                Studio Location Map
              </h3>
              
              <div className="relative rounded-xl overflow-hidden border border-neutral-900 bg-neutral-950 aspect-video group">
                {/* Simulated Stylized Premium Map Layout */}
                <div 
                  className="absolute inset-0 bg-cover bg-center grayscale opacity-40 mix-blend-luminosity scale-105 group-hover:scale-100 transition-transform duration-700" 
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')` }}
                />
                
                {/* Premium overlay with location grid */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
                
                {/* Visual marker */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <div className="relative mb-2">
                    <span className="absolute inline-flex h-12 w-12 rounded-full bg-[#D4AF37] opacity-20 animate-ping"></span>
                    <div className="relative bg-[#000000] border-2 border-[#D4AF37] p-3 rounded-full text-[#D4AF37]">
                      <MapPin className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-xs font-mono text-[#D4AF37] tracking-wider uppercase bg-black/80 px-2 py-1 rounded border border-neutral-800 mb-1">
                    6A Gwerthonor Place, Gilfach Bargoed
                  </p>
                  <p className="text-[11px] text-neutral-400 max-w-xs font-sans">
                    Find us at 6A Gwerthonor Place, Gilfach Bargoed. Street parking is available nearby.
                  </p>
                </div>

                {/* Map Action Button */}
                <div className="absolute bottom-4 right-4">
                  <a 
                    href="https://www.google.com/maps/dir/?api=1&destination=6A+Gwerthonor+Place+Gilfach+Bargoed+CF81+8JQ" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-white text-black font-semibold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors shadow-lg"
                  >
                    Get Directions (Google Maps)
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Opening Hours & Socials Panel */}
            <motion.div variants={itemVariants} className="p-6 rounded-xl bg-neutral-950 border border-neutral-900 space-y-6">
              <div>
                <h3 className="text-lg font-bold font-Oswald uppercase tracking-wider text-white flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-[#D4AF37]" />
                  Opening Hours
                </h3>
                
                <div className="space-y-2.5">
                  {hours.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm border-b border-neutral-900 pb-2 last:border-0 last:pb-0">
                      <span className="font-medium text-neutral-300">{item.day_of_week}</span>
                      {item.is_closed ? (
                        <span className="font-mono text-xs text-neutral-600 uppercase tracking-widest">Closed</span>
                      ) : (
                        <span className="font-mono text-xs text-white">
                          {item.open_time} – {item.close_time}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Connections */}
              <div className="border-t border-neutral-900 pt-6">
                <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-3">
                  Follow Jake on Socials
                </h4>
                <div className="flex gap-4">
                  <a 
                    href="https://facebook.com/share/1EcPtapnqm/?mibextid=wwXIfr" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-neutral-900 hover:bg-[#D4AF37] hover:text-black transition-all text-neutral-300 font-medium text-xs uppercase tracking-wider"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </a>
                  <a 
                    href="https://instagram.com/tattoos_by_jake_llewellyn?igsh=cXFlbmJ5cnExYXU1&utm_source=qr" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-neutral-900 hover:bg-[#D4AF37] hover:text-black transition-all text-neutral-300 font-medium text-xs uppercase tracking-wider"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right Column: FAQ Accordion */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-xl font-bold font-Oswald uppercase text-white tracking-wider border-b border-neutral-800 pb-2">
                Frequently Asked Questions
              </h3>
              <p className="text-neutral-400 text-sm">
                Have questions about pricing, safety, or the booking process? Click any question to read the answer.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = expandedFaq === index;
                return (
                  <div 
                    key={index} 
                    className="rounded-xl border border-neutral-900 bg-neutral-950 overflow-hidden transition-colors hover:border-[#D4AF37]/20"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left p-5 sm:p-6 flex justify-between items-center gap-4 transition-all focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                      aria-expanded={isOpen}
                    >
                      <span className="font-Oswald text-base sm:text-lg font-medium text-white uppercase tracking-wide leading-snug">
                        {faq.question}
                      </span>
                      <span className={`p-1.5 rounded-lg bg-neutral-900 text-[#D4AF37] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown className="w-4 h-4" />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-neutral-300 text-sm sm:text-base leading-relaxed border-t border-neutral-900/50 pt-4 bg-[#050505]">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>

            {/* Micro Call-to-action */}
            <motion.div 
              variants={itemVariants} 
              className="p-6 rounded-xl border border-dashed border-[#D4AF37]/30 bg-[#D4AF37]/5 flex flex-col sm:flex-row items-center justify-between gap-6"
            >
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-base font-bold font-Oswald uppercase text-white tracking-wider flex items-center justify-center sm:justify-start gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                  Ready to book your session?
                </h4>
                <p className="text-xs text-neutral-400">
                  Skip the social media DMs and use our structured booking form to lock in your date.
                </p>
              </div>
              <a 
                href="#booking-enquiry-form" 
                className="w-full sm:w-auto text-center bg-white hover:bg-[#D4AF37] text-black font-Oswald font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-lg transition-colors"
              >
                Start Inquiry Form
              </a>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}