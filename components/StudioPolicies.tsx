'use client';

import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';

interface PolicyItem {
  number: string;
  title: string;
  detail: string;
}

interface ServiceItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
}

export function StudioPolicies() {
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({
    sleep: false,
    meal: false,
    hydration: false,
    clothing: false,
    snacks: false,
    alcohol: false,
    id: false,
  });

  const toggleTask = (id: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const checklistItems: ChecklistItem[] = [
    {
      id: 'sleep',
      title: "Get a good night’s sleep",
      description: "Being well-rested helps your body manage pain and reduces twitching."
    },
    {
      id: 'meal',
      title: "Eat a solid meal",
      description: "Eat a hearty meal 1 to 2 hours before your appointment to keep your blood sugar levels stable."
    },
    {
      id: 'hydration',
      title: "Stay hydrated",
      description: "Drink plenty of water the day before and the day of your session. Well-hydrated skin takes ink much easier."
    },
    {
      id: 'clothing',
      title: "Wear appropriate clothing",
      description: "Wear loose, comfortable clothes that easily expose the area being tattooed. Expect that ink may get on your clothes, so do not wear your favorite outfit."
    },
    {
      id: 'snacks',
      title: "Bring snacks and sugary drinks",
      description: "For longer sessions, bring snacks, fruit, or carbonated drinks to keep your energy up."
    },
    {
      id: 'alcohol',
      title: "Do NOT drink alcohol",
      description: "Avoid drinking alcohol for 24 hours before your session. Alcohol thins your blood, which causes excess bleeding and pushes the ink out of the skin."
    },
    {
      id: 'id',
      title: "Bring valid Photo ID",
      description: "You must be 18 years or older to get a tattoo. Please bring a valid driver’s license or passport to your appointment."
    }
  ];

  const services: ServiceItem[] = [
    {
      title: "Custom Tattooing",
      description: "Bespoke artwork tailored to your body. We start with your concept, reference images, and desired placement to build a unique, custom-fitted design.",
      icon: (
        <svg className="w-6 h-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )
    },
    {
      title: "Cover-ups & Reworks",
      description: "Breathe new life into old or faded tattoos. Whether you want to completely cover an old piece or restore a faded favorite, I can design a solution. Please note: All cover-ups are subject to an in-person or digital assessment of your existing tattoo.",
      icon: (
        <svg className="w-6 h-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3 3L22 4" />
        </svg>
      )
    },
    {
      title: "Flash Tattoos",
      description: "Ready-to-wear designs hand-drawn by Jake. These designs are pre-priced and can be booked with faster turnaround times.",
      icon: (
        <svg className="w-6 h-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  const policies: PolicyItem[] = [
    {
      number: "01",
      title: "Studio Minimum Charge",
      detail: "My studio minimum charge is £50. This covers the cost of medical-grade single-use setup, sanitization, and basic materials for small designs."
    },
    {
      number: "02",
      title: "Deposit Requirements",
      detail: "A non-refundable deposit is required to secure any booking date. The deposit amount is determined by the size and complexity of your tattoo and will be deducted from the final price on the day of your session."
    },
    {
      number: "03",
      title: "48-Hour Cancellation & Rescheduling",
      detail: "If you need to reschedule your appointment, you must notify me at least 48 hours before your session. Doing so allows us to transfer your deposit to a new date. Cancellations made with less than 48 hours' notice, or failing to show up, will result in the loss of your deposit."
    }
  ];

  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / checklistItems.length) * 100);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <section 
      id="studio-policies" 
      className="relative py-24 md:py-32 bg-[#000000] text-white overflow-hidden border-t border-neutral-900"
    >
      {/* Background Graphic elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.04),transparent_50%)] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#D4AF37] opacity-[0.01] blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-bold tracking-[0.25em] text-[#D4AF37] uppercase font-['JetBrains_Mono']">
            Studio Standards
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase font-['Oswald'] text-[#FAFAFA]">
            Services & Policies
          </h2>
          <div className="h-[2px] w-16 bg-[#D4AF37] mx-auto mt-6" />
        </div>

        {/* Studio Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {services.map((service, idx) => (
            <div 
              key={idx}
              className="group relative p-8 bg-neutral-950 border border-neutral-900 hover:border-[#D4AF37]/50 transition-all duration-300 rounded-lg flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold tracking-tight uppercase font-['Oswald'] text-white mb-4">
                  {service.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-neutral-900/80 flex items-center justify-between">
                <span className="text-xs font-['JetBrains_Mono'] text-neutral-500 uppercase tracking-widest">Available</span>
                <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              </div>
            </div>
          ))}
        </div>

        {/* Pricing & Deposit Policies Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          
          {/* Policies Side */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h3 className="text-3xl font-extrabold tracking-tight uppercase font-['Oswald'] text-[#FAFAFA]">
                Clear Pricing, No Surprises
              </h3>
              <p className="text-neutral-400 mt-2 text-base max-w-xl">
                Understanding deposits, session rates, and how we handle cancellations.
              </p>
            </div>

            <div className="space-y-6">
              {policies.map((policy, idx) => (
                <div 
                  key={idx} 
                  className="p-6 bg-neutral-950/80 border border-neutral-900 rounded-lg flex gap-5 items-start hover:bg-neutral-950 transition-colors"
                >
                  <span className="text-2xl font-extrabold font-['JetBrains_Mono'] text-[#D4AF37] leading-none">
                    {policy.number}
                  </span>
                  <div>
                    <h4 className="text-lg font-bold uppercase font-['Oswald'] text-white mb-2 tracking-wide">
                      {policy.title}
                    </h4>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      {policy.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Prep Checklist Side */}
          <div className="lg:col-span-5 bg-neutral-950 border border-neutral-900 rounded-xl p-8 shadow-2xl relative">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 bg-[#D4AF37] text-black text-xs font-bold font-['JetBrains_Mono'] px-3 py-1 rounded tracking-wider uppercase shadow-lg">
              Must Read
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-extrabold tracking-tight uppercase font-['Oswald'] text-[#FAFAFA]">
                How to Prepare for Your Session
              </h3>
              <p className="text-neutral-400 mt-2 text-xs leading-relaxed">
                To ensure a smooth, comfortable session and the best possible ink application, please follow this checklist:
              </p>
            </div>

            {/* Interactive Progress Indicator */}
            <div className="mb-8 bg-neutral-900 rounded-full h-2 overflow-hidden relative">
              <div 
                className="bg-[#D4AF37] h-full transition-all duration-500 ease-out" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center mb-6 text-xs font-['JetBrains_Mono'] text-neutral-400 border-b border-neutral-900 pb-4">
              <span>PREPARATION PROGRESS</span>
              <span className="text-[#D4AF37] font-bold">{completedCount} of {checklistItems.length} Complete</span>
            </div>

            {/* Checklist Items */}
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
              {checklistItems.map((item) => {
                const isCompleted = completedTasks[item.id];
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleTask(item.id)}
                    className="w-full text-left flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-900/60 transition-colors duration-150 group"
                  >
                    <div className="mt-1 flex-shrink-0">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        isCompleted 
                          ? 'bg-[#D4AF37] border-[#D4AF37]' 
                          : 'border-neutral-700 group-hover:border-neutral-500'
                      }`}>
                        {isCompleted && (
                          <svg className="w-3.5 h-3.5 text-black stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className={`block text-sm font-bold tracking-wide transition-all ${
                        isCompleted ? 'line-through text-neutral-500' : 'text-neutral-200'
                      }`}>
                        {item.title}
                      </span>
                      <span className={`block text-xs mt-1 leading-relaxed transition-all ${
                        isCompleted ? 'text-neutral-600' : 'text-neutral-400'
                      }`}>
                        {item.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {progressPercent === 100 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 bg-[#16A34A]/10 border border-[#16A34A]/30 rounded-lg text-center"
              >
                <p className="text-[#16A34A] text-xs font-bold font-['JetBrains_Mono'] uppercase tracking-wider">
                  🎉 You are fully prepared for your session!
                </p>
              </motion.div>
            )}
          </div>

        </div>

        {/* CTA & Next Steps Section */}
        <div className="mt-16 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&q=80&w=1200')] opacity-5 bg-cover bg-center pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h4 className="text-2xl sm:text-3xl font-extrabold uppercase font-['Oswald'] text-white tracking-wide mb-4">
              Ready to start your next project?
            </h4>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-8">
              Skip the messy social media DMs. Use our structured booking form to send your design ideas, placement, and reference photos directly to my workstation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="#booking-enquiry-form"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#D4AF37] hover:bg-[#c49f2e] text-black font-bold uppercase tracking-wider text-sm transition-all duration-300 rounded-sm font-['Oswald'] w-full sm:w-auto"
              >
                Start Your Inquiry Form
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              <a 
                href="#portfolio-gallery"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent hover:bg-white/5 text-white border border-neutral-700 hover:border-neutral-500 font-bold uppercase tracking-wider text-sm transition-all duration-300 rounded-sm font-['Oswald'] w-full sm:w-auto"
              >
                View Design Gallery
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}