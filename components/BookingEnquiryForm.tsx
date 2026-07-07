'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface FormDataState {
  clientName: string;
  email: string;
  phone: string;
  designDescription: string;
  isCoverUp: boolean;
  colorPreference: string;
  placement: string;
  approximateSize: string;
  preferredDays: string[];
  budgetRange: string;
  referenceImages: string[];
}

const initialFormState: FormDataState = {
  clientName: '',
  email: '',
  phone: '',
  designDescription: '',
  isCoverUp: false,
  colorPreference: 'Black & Grey',
  placement: '',
  approximateSize: '',
  preferredDays: [],
  budgetRange: '',
  referenceImages: []
};

const STEPS = [
  { number: 1, title: 'Your Details', description: 'Contact info' },
  { number: 2, title: 'Your Design', description: 'Concept & style' },
  { number: 3, title: 'Placement & Size', description: 'Where & how big' },
  { number: 4, title: 'Dates & References', description: 'Timing & inspiration' }
];

const PRESET_REFERENCES = [
  {
    id: 'ref1',
    title: 'Realistic Black & Grey',
    url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'ref2',
    title: 'Delicate Fine Line',
    url: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'ref3',
    title: 'Vibrant Neo-Traditional',
    url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=600',
  }
];

export function BookingEnquiryForm() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormDataState>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormDataState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form step animations
  const stepVariants: Variants = {
    hidden: { opacity: 0, x: 15 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } },
    exit: { opacity: 0, x: -15, transition: { duration: 0.15 } }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormDataState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (day: string) => {
    setFormData((prev) => {
      const alreadySelected = prev.preferredDays.includes(day);
      const updatedDays = alreadySelected
        ? prev.preferredDays.filter((d) => d !== day)
        : [...prev.preferredDays, day];
      
      if (errors.preferredDays) {
        setErrors((err) => ({ ...err, preferredDays: undefined }));
      }
      return { ...prev, preferredDays: updatedDays };
    });
  };

  const handleCoverUpChange = (val: boolean) => {
    setFormData((prev) => ({ ...prev, isCoverUp: val }));
  };

  const handleColorPrefChange = (val: string) => {
    setFormData((prev) => ({ ...prev, colorPreference: val }));
  };

  // Add preset image as reference
  const togglePresetReference = (url: string) => {
    setFormData((prev) => {
      const exists = prev.referenceImages.includes(url);
      const updated = exists 
        ? prev.referenceImages.filter(item => item !== url)
        : [...prev.referenceImages, url].slice(0, 3); // max 3
      return { ...prev, referenceImages: updated };
    });
  };

  // Simulate local reference file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 3);
      const mockUrls = filesArray.map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        referenceImages: [...prev.referenceImages, ...mockUrls].slice(0, 3)
      }));
    }
  };

  const removeReferenceImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      referenceImages: prev.referenceImages.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormDataState, string>> = {};

    if (step === 1) {
      if (!formData.clientName.trim()) newErrors.clientName = 'Full name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    }

    if (step === 2) {
      if (!formData.designDescription.trim()) {
        newErrors.designDescription = 'Please describe your tattoo idea';
      } else if (formData.designDescription.trim().length < 10) {
        newErrors.designDescription = 'Please provide a bit more detail about your idea';
      }
    }

    if (step === 3) {
      if (!formData.placement.trim()) newErrors.placement = 'Body placement is required';
      if (!formData.approximateSize.trim()) newErrors.approximateSize = 'Estimated size is required';
    }

    if (step === 4) {
      if (formData.preferredDays.length === 0) {
        newErrors.preferredDays = 'Please select at least one preferred day';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { error } = await supabase
        .from('booking_enquiries')
        .insert([
          {
            client_name: formData.clientName,
            email: formData.email,
            phone: formData.phone,
            design_description: `${formData.designDescription} (Color Preference: ${formData.colorPreference})`,
            placement: formData.placement,
            approximate_size_cm: formData.approximateSize,
            is_cover_up: formData.isCoverUp,
            budget_range: formData.budgetRange || 'Not Specified',
            preferred_days: formData.preferredDays,
            reference_image_paths: formData.referenceImages,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      setSubmitSuccess(true);
      setFormData(initialFormState);
      setCurrentStep(1);
    } catch (err: any) {
      console.error('Submission error:', err);
      setSubmitError(err.message || 'An error occurred while submitting your enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="booking-enquiry-form" 
      className="relative bg-[#000000] text-[#ffffff] py-24 px-4 sm:px-6 lg:px-8 border-t border-[#1E1E1E] overflow-hidden"
    >
      {/* Decorative background grid and glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37] opacity-5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-[#D4AF37] font-mono text-xs tracking-[0.3em] uppercase block mb-3">
            Consultation Request
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold uppercase tracking-tight font-sans mb-4 text-[#FAFAFA]">
            Start Your Booking Inquiry
          </h2>
          <p className="text-[#A3A3A3] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Tell me about your tattoo idea below. Once you submit this form, I will review your design, sizing, and placement, and get back to you with a price estimate and available dates.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-[#121212] border border-[#1E1E1E] rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Progress Bar & Steps Indicator */}
          <div className="border-b border-[#1E1E1E] bg-[#0A0A0A] p-6 sm:px-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
                Step {currentStep} of 4
              </span>
              <span className="text-xs font-mono text-[#737373] hidden sm:inline">
                Tattoos by Jake Llewellyn
              </span>
            </div>
            
            {/* Steps Progress Track */}
            <div className="relative w-full h-[2px] bg-[#262626] rounded-full mb-8">
              <div 
                className="absolute top-0 left-0 h-full bg-[#D4AF37] transition-all duration-300 ease-out"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />
              <div className="absolute inset-0 flex justify-between -top-[5px]">
                {STEPS.map((step) => {
                  const isActive = step.number === currentStep;
                  const isCompleted = step.number < currentStep;
                  return (
                    <div key={step.number} className="flex flex-col items-center">
                      <div 
                        className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                          isActive 
                            ? 'bg-[#D4AF37] border-[#D4AF37] scale-125 shadow-[0_0_8px_rgba(212,175,55,0.6)]' 
                            : isCompleted 
                            ? 'bg-[#16A34A] border-[#16A34A]' 
                            : 'bg-[#121212] border-[#262626]'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desktop Steps Descriptive Row */}
            <div className="grid grid-cols-4 gap-2 text-center sm:text-left">
              {STEPS.map((step) => (
                <div key={step.number} className="opacity-90">
                  <p className={`text-xs font-bold uppercase tracking-wider ${step.number === currentStep ? 'text-[#FAFAFA]' : 'text-[#525252]'}`}>
                    {step.title}
                  </p>
                  <p className="text-[10px] text-[#737373] hidden sm:block mt-0.5">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content Area */}
          <div className="p-6 sm:p-10">
            {submitSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 px-4"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/30 mb-6">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide mb-4 text-[#FAFAFA]">
                  Inquiry Submitted Successfully!
                </h3>
                <p className="text-[#A3A3A3] max-w-lg mx-auto mb-8 leading-relaxed">
                  Thank you for sharing your vision. Your data is safe with me. I only use these details to evaluate your tattoo design and schedule your session. After submitting, please allow 2 to 3 business days for me to review your request and reply via email (<span className="text-[#D4AF37]">Nllewellyn975682@aol.com</span>) or phone (<span className="text-[#D4AF37]">07729357006</span>).
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="px-6 py-3 bg-transparent border border-[#D4AF37] text-[#D4AF37] rounded-lg text-sm font-mono tracking-widest uppercase hover:bg-[#D4AF37] hover:text-[#000000] transition-all duration-300"
                >
                  Submit Another Inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                
                <AnimatePresence mode="wait">
                  {/* STEP 1: YOUR DETAILS */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      <div className="border-l-2 border-[#D4AF37] pl-4 mb-6">
                        <h4 className="text-lg font-bold uppercase tracking-wider text-[#FAFAFA]">Step 1: Your Details</h4>
                        <p className="text-xs text-[#737373]">Provide your contact details so I can reach out with details and schedules.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3] mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="clientName"
                            value={formData.clientName}
                            onChange={handleInputChange}
                            placeholder="e.g., John Doe"
                            className={`w-full bg-[#1A1A1A] border ${errors.clientName ? 'border-[#DC2626]' : 'border-[#262626]'} focus:border-[#D4AF37] rounded-lg px-4 py-3.5 text-sm text-[#FAFAFA] focus:outline-none transition-all duration-200`}
                          />
                          {errors.clientName && (
                            <p className="mt-1.5 text-xs text-[#DC2626] font-mono">{errors.clientName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3] mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="e.g., john.doe@example.com"
                            className={`w-full bg-[#1A1A1A] border ${errors.email ? 'border-[#DC2626]' : 'border-[#262626]'} focus:border-[#D4AF37] rounded-lg px-4 py-3.5 text-sm text-[#FAFAFA] focus:outline-none transition-all duration-200`}
                          />
                          {errors.email && (
                            <p className="mt-1.5 text-xs text-[#DC2626] font-mono">{errors.email}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3] mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="e.g., 07729357006"
                          className={`w-full bg-[#1A1A1A] border ${errors.phone ? 'border-[#DC2626]' : 'border-[#262626]'} focus:border-[#D4AF37] rounded-lg px-4 py-3.5 text-sm text-[#FAFAFA] focus:outline-none transition-all duration-200`}
                        />
                        {errors.phone && (
                          <p className="mt-1.5 text-xs text-[#DC2626] font-mono">{errors.phone}</p>
                        )}
                      </div>

                      <div className="bg-[#1A1A1A]/50 border border-[#262626] rounded-lg p-4 flex items-start gap-3 mt-6">
                        <svg className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs text-[#8C8C8C] leading-relaxed">
                          Your email and phone are used purely for scheduling your tattoo. You will receive a direct estimate and available slots within 2-3 business days.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: YOUR DESIGN */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      <div className="border-l-2 border-[#D4AF37] pl-4 mb-6">
                        <h4 className="text-lg font-bold uppercase tracking-wider text-[#FAFAFA]">Step 2: Your Design</h4>
                        <p className="text-xs text-[#737373]">Describe the artwork you want to wear forever.</p>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3] mb-2">
                          Describe Your Tattoo Idea *
                        </label>
                        <textarea
                          name="designDescription"
                          value={formData.designDescription}
                          onChange={handleInputChange}
                          rows={5}
                          placeholder="Tell me what you want to get. Mention any specific elements, styles (e.g., black and grey realism, fine line, traditional), or meanings behind the piece."
                          className={`w-full bg-[#1A1A1A] border ${errors.designDescription ? 'border-[#DC2626]' : 'border-[#262626]'} focus:border-[#D4AF37] rounded-lg px-4 py-3.5 text-sm text-[#FAFAFA] focus:outline-none transition-all duration-200 resize-none`}
                        />
                        <p className="mt-1.5 text-xs text-[#737373]">
                          Helper: Be as descriptive as possible. E.g., &quot;A realistic wolf portrait fading into a pine forest scene.&quot;
                        </p>
                        {errors.designDescription && (
                          <p className="mt-1.5 text-xs text-[#DC2626] font-mono">{errors.designDescription}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3] mb-3">
                            Is this a Cover-up? *
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => handleCoverUpChange(false)}
                              className={`py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 border ${
                                !formData.isCoverUp
                                  ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#FAFAFA]'
                                  : 'bg-[#1A1A1A] border-[#262626] text-[#A3A3A3] hover:border-[#404040]'
                              }`}
                            >
                              No
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCoverUpChange(true)}
                              className={`py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 border ${
                                formData.isCoverUp
                                  ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#FAFAFA]'
                                  : 'bg-[#1A1A1A] border-[#262626] text-[#A3A3A3] hover:border-[#404040]'
                              }`}
                            >
                              Yes (Subject to consultation)
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3] mb-3">
                            Color Preference *
                          </label>
                          <select
                            name="colorPreference"
                            value={formData.colorPreference}
                            onChange={(e) => handleColorPrefChange(e.target.value)}
                            className="w-full bg-[#1A1A1A] border border-[#262626] focus:border-[#D4AF37] rounded-lg px-4 py-3.5 text-sm text-[#FAFAFA] focus:outline-none transition-all duration-200"
                          >
                            <option value="Black & Grey">Black & Grey</option>
                            <option value="Full Color">Full Color</option>
                            <option value="Minimal Color">Minimal Color</option>
                            <option value="Fine Line Black Only">Fine Line Black Only</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: PLACEMENT & SIZE */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      <div className="border-l-2 border-[#D4AF37] pl-4 mb-6">
                        <h4 className="text-lg font-bold uppercase tracking-wider text-[#FAFAFA]">Step 3: Placement & Size</h4>
                        <p className="text-xs text-[#737373]">Tell me where the tattoo will go and the scale of the design.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3] mb-2">
                            Body Placement *
                          </label>
                          <input
                            type="text"
                            name="placement"
                            value={formData.placement}
                            onChange={handleInputChange}
                            placeholder="e.g., Right forearm, outer side"
                            className={`w-full bg-[#1A1A1A] border ${errors.placement ? 'border-[#DC2626]' : 'border-[#262626]'} focus:border-[#D4AF37] rounded-lg px-4 py-3.5 text-sm text-[#FAFAFA] focus:outline-none transition-all duration-200`}
                          />
                          <p className="mt-1.5 text-xs text-[#737373]">
                            Where on your body do you want this tattoo? (e.g., Outer Forearm, Left Calf, Upper Back).
                          </p>
                          {errors.placement && (
                            <p className="mt-1.5 text-xs text-[#DC2626] font-mono">{errors.placement}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3] mb-2">
                            Estimated Size *
                          </label>
                          <input
                            type="text"
                            name="approximateSize"
                            value={formData.approximateSize}
                            onChange={handleInputChange}
                            placeholder="e.g., 15cm tall by 10cm wide"
                            className={`w-full bg-[#1A1A1A] border ${errors.approximateSize ? 'border-[#DC2626]' : 'border-[#262626]'} focus:border-[#D4AF37] rounded-lg px-4 py-3.5 text-sm text-[#FAFAFA] focus:outline-none transition-all duration-200`}
                          />
                          <p className="mt-1.5 text-xs text-[#737373]">
                            Please provide the approximate height and width in centimeters or inches. A rough estimate works perfectly!
                          </p>
                          {errors.approximateSize && (
                            <p className="mt-1.5 text-xs text-[#DC2626] font-mono">{errors.approximateSize}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: DATES & REFERENCES */}
                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      <div className="border-l-2 border-[#D4AF37] pl-4 mb-6">
                        <h4 className="text-lg font-bold uppercase tracking-wider text-[#FAFAFA]">Step 4: Dates & References</h4>
                        <p className="text-xs text-[#737373]">Specify when you can come in and upload any visual inspiration.</p>
                      </div>

                      {/* Day multi-select */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3] mb-3">
                          Preferred Days for Appointment * (Select all that apply)
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                          {['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => {
                            const isSelected = formData.preferredDays.includes(day);
                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => handleCheckboxChange(day)}
                                className={`py-2.5 px-3 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-150 border text-center ${
                                  isSelected
                                    ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#FAFAFA] shadow-[0_0_10px_rgba(212,175,55,0.1)]'
                                    : 'bg-[#1A1A1A] border-[#262626] text-[#A3A3A3] hover:border-[#404040]'
                                }`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                        {errors.preferredDays && (
                          <p className="mt-2 text-xs text-[#DC2626] font-mono">{errors.preferredDays}</p>
                        )}
                      </div>

                      {/* Budget Range */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3] mb-2">
                          Estimated Budget Range (Optional)
                        </label>
                        <input
                          type="text"
                          name="budgetRange"
                          value={formData.budgetRange}
                          onChange={handleInputChange}
                          placeholder="e.g., Under £150, £200-£400, No strict budget"
                          className="w-full bg-[#1A1A1A] border border-[#262626] focus:border-[#D4AF37] rounded-lg px-4 py-3.5 text-sm text-[#FAFAFA] focus:outline-none transition-all duration-200"
                        />
                      </div>

                      {/* Reference Images Section */}
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3]">
                            Reference Images (Max 3 files, up to 10MB each)
                          </label>
                          <span className="text-xs font-mono text-[#D4AF37]">
                            {formData.referenceImages.length} / 3 Selected
                          </span>
                        </div>

                        {/* Presets Selector to make it rich */}
                        <p className="text-xs text-[#737373] mb-3">
                          Quick-select from my general styles as references, or upload your own screenshots/sketches below:
                        </p>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          {PRESET_REFERENCES.map((p) => {
                            const isSelected = formData.referenceImages.includes(p.url);
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => togglePresetReference(p.url)}
                                className={`relative aspect-video rounded-lg overflow-hidden border group transition-all duration-200 ${
                                  isSelected 
                                    ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]' 
                                    : 'border-[#262626] opacity-70 hover:opacity-100'
                                }`}
                              >
                                <img 
                                  src={p.url} 
                                  alt={p.title} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                />
                                <div className="absolute inset-0 bg-[#000000]/60 flex items-end p-1.5 justify-between">
                                  <span className="text-[10px] text-white font-sans font-medium truncate max-w-[80%]">
                                    {p.title}
                                  </span>
                                  {isSelected && (
                                    <span className="w-3 h-3 bg-[#D4AF37] rounded-full flex items-center justify-center text-[8px] text-[#000000] font-bold">
                                      ✓
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* File Upload Trigger */}
                        <div className="flex gap-4 items-center">
                          <button
                            type="button"
                            disabled={formData.referenceImages.length >= 3}
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-3 bg-[#1A1A1A] border border-[#262626] hover:border-[#D4AF37] rounded-lg text-xs font-mono text-[#A3A3A3] hover:text-[#FAFAFA] transition-all duration-200 uppercase tracking-wider disabled:opacity-50 disabled:pointer-events-none"
                          >
                            Upload Custom Files
                          </button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/png, image/jpeg"
                            multiple
                            className="hidden"
                          />
                          <p className="text-xs text-[#737373]">
                            PNG/JPG formats supported.
                          </p>
                        </div>

                        {/* Selected Previews */}
                        {formData.referenceImages.length > 0 && (
                          <div className="grid grid-cols-3 gap-4 mt-4 bg-[#1A1A1A]/30 p-4 rounded-lg border border-[#262626]">
                            {formData.referenceImages.map((imgUrl, idx) => (
                              <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-[#262626]">
                                <img src={imgUrl} alt="Reference Preview" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => removeReferenceImage(idx)}
                                  className="absolute top-1 right-1 w-6 h-6 bg-[#000000]/80 hover:bg-[#DC2626] text-white rounded-full flex items-center justify-center text-xs transition-colors duration-200"
                                >
                                  &times;
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Banner */}
                {submitError && (
                  <div className="p-4 bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-lg text-sm text-[#DC2626] font-mono">
                    {submitError}
                  </div>
                )}

                {/* Navigation Controls */}
                <div className="flex justify-between items-center pt-6 border-t border-[#1E1E1E]">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-6 py-3 bg-transparent hover:bg-[#1A1A1A] text-[#FAFAFA] rounded-lg text-sm font-mono tracking-widest uppercase transition-all duration-200 border border-[#262626]"
                    >
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-3 bg-[#D4AF37] hover:bg-[#cfa730] text-[#000000] font-bold rounded-lg text-sm font-mono tracking-widest uppercase transition-all duration-200 shadow-[0_4px_20px_rgba(212,175,55,0.15)]"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-4 bg-[#D4AF37] hover:bg-[#cfa730] text-[#000000] font-bold rounded-lg text-sm font-mono tracking-widest uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_25px_rgba(212,175,55,0.25)]"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit My Booking Inquiry'}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* Form Footer Note */}
          <div className="bg-[#0A0A0A] border-t border-[#1E1E1E] px-6 py-5 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[#737373] text-center sm:text-left leading-relaxed">
              Your data is safe with me. I only use these details to evaluate your tattoo design and schedule your session.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#16A34A]">
                Secure Transmission Active
              </span>
            </div>
          </div>

        </div>

        {/* Quick Studio Policy Anchors Help Link */}
        <div className="text-center mt-10">
          <p className="text-xs text-[#737373]">
            Unsure about deposits or how to prepare? Review my{' '}
            <a 
              href="#studio-policies" 
              className="text-[#D4AF37] hover:underline underline-offset-4 font-mono font-bold transition-all"
            >
              Studio Policies & Checklist
            </a>
          </p>
        </div>

      </div>
    </section>
  );
}