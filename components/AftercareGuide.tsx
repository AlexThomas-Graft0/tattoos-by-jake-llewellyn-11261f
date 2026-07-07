'use client';

import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { 
  ShieldCheck, 
  Droplet, 
  Sparkles, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  ArrowRight,
  Info,
  Calendar,
  PhoneCall,
  Printer
} from 'lucide-react';

interface InstructionItem {
  id: string;
  text: string;
}

interface Phase {
  number: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  instructions: InstructionItem[];
}

export function AftercareGuide() {
  // Interactive routine tracker state
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<number>(0);

  const toggleStep = (id: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const printGuide = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const phases: Phase[] = [
    {
      number: "Phase 1",
      title: "The First 2 to 4 Hours",
      subtitle: "Immediate Care & Protection",
      icon: ShieldCheck,
      instructions: [
        { id: "p1-1", text: "Keep the wrap on: Leave the protective wrap or second-skin film on your new tattoo for the exact time I recommended during your session (usually 2 to 4 hours)." },
        { id: "p1-2", text: "Wash your hands first: Before touching your new tattoo, always wash your hands thoroughly with antibacterial soap." },
        { id: "p1-3", text: "Clean gently: Gently wash the tattoo with lukewarm water and mild, unscented soap. Use your clean hands—never use a washcloth, sponge, or loofah." },
        { id: "p1-4", text: "Pat dry: Gently pat the area dry with a clean, fresh paper towel. Do not rub or scrub. Let it air-dry for 10 minutes." }
      ]
    },
    {
      number: "Phase 2",
      title: "Days 1 to 14",
      subtitle: "The Healing Process & Peeling",
      icon: Droplet,
      instructions: [
        { id: "p2-1", text: "Apply thin ointment: Apply a very thin layer of tattoo-safe aftercare ointment (such as Bepanthen or a specialized tattoo balm). Rub it in fully—your skin should have a slight sheen, not a thick layer of grease." },
        { id: "p2-2", text: "Wash twice daily: Wash and dry your tattoo 2 to 3 times a day to prevent sweat, dirt, and bacteria build-up." },
        { id: "p2-3", text: "Expect peeling and itching: Around day 4 to 7, your tattoo will begin to peel like mild sunburn and may itch. This is completely normal. Do not scratch, pick, or peel the skin. Let the dead skin fall off naturally. Scratching can pull ink out of the skin and leave patchy spots." }
      ]
    },
    {
      number: "Phase 3",
      title: "Weeks 3 to 4 and Beyond",
      subtitle: "Long-Term Maintenance & Preservation",
      icon: Sparkles,
      instructions: [
        { id: "p3-1", text: "Switch to unscented lotion: Once the peeling stops, transition from heavy ointment to a standard, unscented daily body lotion to keep the skin hydrated." },
        { id: "p3-2", text: "Protect from the sun: UV rays fade tattoo pigments rapidly. Once your tattoo is fully healed (typically after 4 weeks), always apply a high SPF (30 or 50) sunblock when spending time outdoors." }
      ]
    }
  ];

  const doNots = [
    { title: "DO NOT pick or scratch", desc: "Let any scabbing or peeling flake off naturally to avoid ruining the design." },
    { title: "DO NOT submerge in water", desc: "Avoid baths, swimming pools, hot tubs, lakes, and the ocean for at least 3 weeks. Showers are perfectly fine." },
    { title: "DO NOT expose to direct sunlight", desc: "Keep your healing tattoo covered and out of direct sun until it is completely healed." },
    { title: "DO NOT wear tight clothing", desc: "Avoid tight straps, waistbands, or abrasive clothing over the new tattoo area. Loose cotton clothes are best." },
    { title: "DO NOT work out heavily", desc: "Avoid intense exercise that causes excessive sweating or stretches the tattooed area for the first week." }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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

  return (
    <section 
      id="aftercare-guide" 
      className="relative bg-[#000000] text-[#ffffff] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-zinc-800"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-mono uppercase tracking-wider mb-4 border border-[#D4AF37]/20">
            <ShieldCheck className="w-3.5 h-3.5" /> Essential Healing Protocol
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight uppercase font-mono text-[#FAFAFA] mb-6">
            Your Tattoo Aftercare Guide
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed font-sans">
            How you care for your new tattoo over the next few weeks is just as important as the tattooing process itself. Follow these steps carefully to ensure a perfect, vibrant heal.
          </p>
        </div>

        {/* Quick Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 mb-12">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D4AF37]"></span>
            </span>
            <p className="text-sm text-zinc-300 font-sans">
              Interactive Guide: Tap steps below to track your healing progress.
            </p>
          </div>
          <button
            onClick={printGuide}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm font-medium text-[#FAFAFA] transition-colors border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          >
            <Printer className="w-4 h-4 text-[#D4AF37]" /> Print / Save Guide
          </button>
        </div>

        {/* Interactive Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Chronological Healing Phases */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex border-b border-zinc-800 mb-6">
              {phases.map((phase, idx) => {
                const IconComponent = phase.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`flex-1 pb-4 text-center border-b-2 transition-all duration-300 focus:outline-none ${
                      activeTab === idx 
                        ? 'border-[#D4AF37] text-[#D4AF37]' 
                        : 'border-transparent text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <span className="block text-xs font-mono uppercase tracking-wider mb-1">{phase.number}</span>
                    <span className="hidden sm:inline-block text-sm font-semibold">{phase.subtitle}</span>
                    <span className="sm:hidden inline-block text-sm font-semibold">
                      {idx === 0 ? "Immediate" : idx === 1 ? "Days 1-14" : "Weeks 3+"}
                    </span>
                  </button>
                );
              })}
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 relative"
            >
              {/* Highlight Tag */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-zinc-800/60">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20 text-[#D4AF37]">
                    {React.createElement(phases[activeTab].icon, { className: "w-6 h-6" })}
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
                      {phases[activeTab].number}
                    </span>
                    <h3 className="text-2xl font-bold font-mono text-[#FAFAFA]">
                      {phases[activeTab].title}
                    </h3>
                  </div>
                </div>
                
                {/* Completed Counter Badge */}
                <span className="hidden sm:inline-flex text-xs font-mono text-zinc-400 bg-zinc-800 px-3 py-1 rounded-full">
                  {phases[activeTab].instructions.filter(i => completedSteps[i.id]).length} / {phases[activeTab].instructions.length} Done
                </span>
              </div>

              {/* Steps List */}
              <div className="space-y-4">
                {phases[activeTab].instructions.map((inst, index) => {
                  const isChecked = !!completedSteps[inst.id];
                  const [boldPart, restPart] = inst.text.split(':');
                  
                  return (
                    <div 
                      key={inst.id}
                      onClick={() => toggleStep(inst.id)}
                      className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer select-none ${
                        isChecked 
                          ? 'bg-zinc-900/80 border-emerald-900/40 text-zinc-400' 
                          : 'bg-zinc-950/60 border-zinc-800/60 hover:border-zinc-700 text-[#FAFAFA]'
                      }`}
                    >
                      <button
                        type="button"
                        className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-md border flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 ${
                          isChecked 
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                            : 'border-zinc-700 hover:border-[#D4AF37] text-transparent'
                        }`}
                        aria-label={`Mark step ${index + 1} as completed`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <div className="text-sm sm:text-base leading-relaxed">
                        <span className={`font-semibold text-zinc-200 block sm:inline ${isChecked ? 'line-through text-zinc-500' : ''}`}>
                          {boldPart}:
                        </span>
                        <span className={`text-zinc-400 ml-0 sm:ml-1 ${isChecked ? 'text-zinc-500 line-through' : ''}`}>
                          {restPart}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress Bar inside Active Phase */}
              <div className="mt-8 pt-6 border-t border-zinc-800/60">
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-2">
                  <span>Phase Progress</span>
                  <span>
                    {Math.round(
                      (phases[activeTab].instructions.filter(i => completedSteps[i.id]).length / 
                      phases[activeTab].instructions.length) * 100
                    )}%
                  </span>
                </div>
                <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
                  <div 
                    className="bg-gradient-to-r from-[#D4AF37] to-amber-500 h-full transition-all duration-500"
                    style={{ 
                      width: `${
                        (phases[activeTab].instructions.filter(i => completedSteps[i.id]).length / 
                        phases[activeTab].instructions.length) * 100
                      }%` 
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Quick Consultation Callout */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold font-mono text-[#FAFAFA]">Have healing concerns?</h4>
                  <p className="text-sm text-zinc-400">If you experience unexpected redness or swelling, reach out immediately.</p>
                </div>
              </div>
              <a 
                href="tel:07729357006"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold text-[#FAFAFA] border border-zinc-700 transition-all"
              >
                <PhoneCall className="w-4 h-4 text-[#D4AF37]" /> Call Jake
              </a>
            </div>
          </div>

          {/* Right Column: "Do Not" Warnings & Visual Anchor Card */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* The Crucial Do Not List */}
            <div className="bg-gradient-to-b from-zinc-900 to-black border-2 border-red-950/60 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-red-950/40">
                <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-red-400">Crucial Warnings</span>
                  <h3 className="text-2xl font-bold font-mono text-[#FAFAFA]">What to Avoid While Healing</h3>
                </div>
              </div>

              <div className="space-y-6">
                {doNots.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-mono text-base font-bold uppercase tracking-wider text-zinc-200">
                        {item.title}
                      </h4>
                      <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contextual Visual Card linking back to Booking */}
            <div className="relative rounded-3xl overflow-hidden group aspect-[4/3] sm:aspect-[16/10] lg:aspect-square flex flex-col justify-end p-6 sm:p-8 border border-zinc-800">
              <img 
                src="https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&q=80&w=1200"
                alt="Professional tattoo session details showing sterile equipment"
                className="absolute inset-0 w-full h-full object-cover brightness-50 contrast-125 group-hover:scale-105 transition-transform duration-700"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              
              <div className="relative z-10">
                <span className="inline-block text-xs font-mono text-[#D4AF37] uppercase tracking-widest mb-2">
                  Ready for your next piece?
                </span>
                <h3 className="text-2xl font-mono font-bold text-[#FAFAFA] mb-4">
                  Let's design something completely unique for you.
                </h3>
                <a 
                  href="#booking-enquiry-form"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#c29d2e] text-black font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37]"
                >
                  Start Your Inquiry Form
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Banner Details */}
        <div className="mt-16 pt-12 border-t border-zinc-800 text-center max-w-2xl mx-auto">
          <p className="text-xs text-zinc-500 font-mono leading-relaxed">
            These guidelines are curated by Jake Llewellyn to ensure optimal skin recovery. 
            Operating out of a fully licensed studio: 6A Gwerthonor Place, Gilfach Bargoed, CF81 8JQ. 
            For medical emergencies or symptoms of severe infection, always consult a medical professional.
          </p>
        </div>

      </div>
    </section>
  );
}