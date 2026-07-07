'use client';

import { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ArrowUp, 
  ShieldCheck, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

const links = [
  { label: 'Home', href: '#hero-section' },
  { label: 'Philosophy', href: '#philosophy-section' },
  { label: 'Meet Jake', href: '#artist-showcase' },
  { label: 'Portfolio', href: '#portfolio-gallery' },
  { label: 'Policies & Pricing', href: '#studio-policies' },
  { label: 'Book Inquiry', href: '#booking-enquiry-form' },
  { label: 'Aftercare Guide', href: '#aftercare-guide' },
  { label: 'Contact & FAQ', href: '#contact-and-faq' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120 },
  },
};

export function Footer() {
  const [status, setStatus] = useState<'OPEN' | 'CLOSED' | 'LOADING'>('LOADING');

  useEffect(() => {
    try {
      const options = { timeZone: 'Europe/London', hour12: false };
      const formatter = new Intl.DateTimeFormat('en-GB', {
        ...options,
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
      const parts = formatter.formatToParts(new Date());
      const partMap = Object.fromEntries(parts.map((p) => [p.type, p.value]));

      const weekday = partMap.weekday; // "Tue", "Wed", "Thu", etc.
      const hour = parseInt(partMap.hour, 10);

      const openDays = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const isOpenDay = openDays.includes(weekday);
      const isOpenHour = hour >= 10 && hour < 18;

      if (isOpenDay && isOpenHour) {
        setStatus('OPEN');
      } else {
        setStatus('CLOSED');
      }
    } catch (e) {
      setStatus('CLOSED');
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-black text-[#F5F5F7] border-t border-neutral-900 overflow-hidden font-sans">
      {/* Decorative subtle background gradient */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.08),transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10">
        
        {/* Dynamic Studio Status Banner */}
        <div className="mb-12 p-1 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 rounded-2xl border border-neutral-800/80">
          <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                {status === 'OPEN' ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </>
                ) : status === 'CLOSED' ? (
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-neutral-600"></span>
                ) : (
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 animate-pulse"></span>
                )}
              </div>
              <p className="text-sm font-medium tracking-wide">
                {status === 'OPEN' && (
                  <span>
                    🟢 <strong className="text-white">We are open right now!</strong> Stop by or send us an inquiry.
                  </span>
                )}
                {status === 'CLOSED' && (
                  <span>
                    ⚪ <strong className="text-neutral-300">We are currently closed.</strong> You can still submit your booking inquiry below.
                  </span>
                )}
                {status === 'LOADING' && (
                  <span className="text-neutral-400">Verifying live studio status...</span>
                )}
              </p>
            </div>
            
            <a 
              href="#booking-enquiry-form" 
              className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase bg-[#D4AF37] hover:bg-[#c49e2e] text-black px-4 py-2 rounded-lg font-bold transition-all duration-200"
            >
              Start Inquiry <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Main Footer Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
        >
          
          {/* Column 1: Brand & Licensing */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold tracking-wider uppercase font-serif text-white">
                Jake Llewellyn
              </h3>
              <p className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase mt-1">
                Tattoo Artist
              </p>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Operating out of a private, fully licensed studio in Gilfach Bargoed. Focusing on clean lines, custom designs, and solid shading in a clean, professional space.
            </p>
            <div className="flex items-center gap-3 p-3.5 bg-neutral-950 rounded-xl border border-neutral-900">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-neutral-200">Fully Licensed Studio</p>
                <p className="text-neutral-500">Caerphilly County Borough Council Registered</p>
              </div>
            </div>
          </motion.div>

          {/* Column 2: Quick Navigation */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="text-sm font-mono tracking-wider uppercase text-neutral-400 border-b border-neutral-900 pb-2">
              Navigation
            </h4>
            <ul className="grid grid-cols-2 gap-y-3 gap-x-4">
              {links.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-[#D4AF37] transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-800 group-hover:bg-[#D4AF37] transition-all duration-200" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Studio Hours */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="text-sm font-mono tracking-wider uppercase text-neutral-400 border-b border-neutral-900 pb-2">
              Opening Hours
            </h4>
            <div className="space-y-3 font-mono text-xs text-neutral-400">
              <div className="flex justify-between py-1 border-b border-neutral-900/40">
                <span className="text-neutral-500">Mon</span>
                <span>Closed</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-900/40 text-neutral-200">
                <span>Tue - Sat</span>
                <span className="text-white">10:00 AM – 6:00 PM</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-500">Sun</span>
                <span>Closed</span>
              </div>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-neutral-500">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Local UK Time (London)</span>
              </div>
            </div>
          </motion.div>

          {/* Column 4: Contact & Socials */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="text-sm font-mono tracking-wider uppercase text-neutral-400 border-b border-neutral-900 pb-2">
              Direct Contact
            </h4>
            <div className="space-y-4">
              <a 
                href="tel:07729357006" 
                className="flex items-center gap-3 text-sm text-neutral-300 hover:text-[#D4AF37] transition-colors duration-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-neutral-950 flex items-center justify-center border border-neutral-900 group-hover:border-[#D4AF37]/30 transition-all">
                  <Phone className="w-4 h-4 text-neutral-400 group-hover:text-[#D4AF37]" />
                </div>
                <span>07729357006</span>
              </a>

              <a 
                href="mailto:Nllewellyn975682@aol.com" 
                className="flex items-center gap-3 text-sm text-neutral-300 hover:text-[#D4AF37] transition-colors duration-200 group block truncate"
              >
                <div className="w-8 h-8 rounded-lg bg-neutral-950 flex items-center justify-center border border-neutral-900 group-hover:border-[#D4AF37]/30 transition-all">
                  <Mail className="w-4 h-4 text-neutral-400 group-hover:text-[#D4AF37]" />
                </div>
                <span className="truncate">Nllewellyn975682@aol.com</span>
              </a>

              <div className="flex items-start gap-3 text-sm text-neutral-300 group">
                <div className="w-8 h-8 rounded-lg bg-neutral-950 flex items-center justify-center border border-neutral-900 shrink-0">
                  <MapPin className="w-4 h-4 text-neutral-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-mono">6A Gwerthonor Place</p>
                  <p className="text-xs text-neutral-400 font-mono">Gilfach Bargoed, CF81 8JQ</p>
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=6A+Gwerthonor+Place+Gilfach+Bargoed+CF81+8JQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#D4AF37] hover:underline mt-1 font-mono uppercase"
                  >
                    Open in Maps <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

        </motion.div>

        {/* Separator */}
        <div className="h-px bg-neutral-900 w-full mb-8" />

        {/* Footer Bottom Meta */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1.5">
            <p className="text-xs text-neutral-500 font-mono">
              © 2025 Tattoos by Jake Llewellyn. All rights reserved.
            </p>
            <p className="text-[11px] text-neutral-600 font-mono">
              Designed with respect to the craft. Safe, Sterile & Fully Registered.
            </p>
          </div>

          {/* Social Links & Back to Top */}
          <div className="flex items-center gap-4">
            <a 
              href="https://facebook.com/share/1EcPtapnqm/?mibextid=wwXIfr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-mono text-neutral-400 hover:text-[#D4AF37] transition-colors border border-neutral-900 hover:border-[#D4AF37]/30 px-3 py-1.5 rounded-lg bg-neutral-955"
            >
              Facebook
            </a>
            <a 
              href="https://instagram.com/tattoos_by_jake_llewellyn?igsh=cXFlbmJ5cnExYXU1&utm_source=qr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-mono text-neutral-400 hover:text-[#D4AF37] transition-colors border border-neutral-900 hover:border-[#D4AF37]/30 px-3 py-1.5 rounded-lg bg-neutral-955"
            >
              Instagram
            </a>

            <button 
              onClick={scrollToTop}
              className="w-10 h-10 rounded-lg bg-neutral-950 hover:bg-neutral-900 border border-neutral-900 text-[#D4AF37] flex items-center justify-center transition-all duration-200"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}