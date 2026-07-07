'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image_path: string;
  description: string;
}

const FALLBACK_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'fallback-1',
    title: 'Realistic Wolf and Forest Sleeve',
    category: 'Black & Grey',
    image_path: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?auto=format&fit=crop&w=800&q=80',
    description: 'Smooth black and grey realistic wolf portrait fading into a pine forest scene on a client\'s outer forearm, tattooed by Jake Llewellyn.'
  },
  {
    id: 'fallback-2',
    title: 'Neo-Traditional Rose & Dagger',
    category: 'Vibrant Color',
    image_path: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=800&q=80',
    description: 'Bold neo-traditional dagger piercing a vibrant red rose with thick outer lines and rich color saturation on a calf.'
  },
  {
    id: 'fallback-3',
    title: 'Delicate Wildflower Bouquet',
    category: 'Fine Line',
    image_path: 'https://images.unsplash.com/photo-1560707303-4e980c87f846?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-fine line tattoo of a wildflower bouquet with delicate dot-work shading on an inner wrist.'
  },
  {
    id: 'fallback-4',
    title: 'Mandala Cover-up over Old Script',
    category: 'Cover-ups',
    image_path: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=800&q=80',
    description: 'Before and after shot showing a faded black script tattoo completely covered by a dense, symmetrical geometric mandala design on a shoulder.'
  },
  {
    id: 'fallback-5',
    title: 'Traditional Swallow Flash Piece',
    category: 'Flash Designs',
    image_path: 'https://images.unsplash.com/photo-1542226601-bc82e276ae0a?auto=format&fit=crop&w=800&q=80',
    description: 'Classic bold American traditional swallow tattoo with clean black shading and bright yellow accents on a thigh.'
  },
  {
    id: 'fallback-6',
    title: 'Detailed Pocket Watch & Roses',
    category: 'Black & Grey',
    image_path: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=800&q=80',
    description: 'Highly detailed pocket watch with Roman numerals surrounded by soft, realistic black and grey roses on an upper arm.'
  }
];

const CATEGORIES = [
  'All Styles',
  'Black & Grey',
  'Vibrant Color',
  'Fine Line',
  'Cover-ups',
  'Flash Designs'
];

export function PortfolioGallery() {
  const [items, setItems] = useState<PortfolioItem[]>(FALLBACK_PORTFOLIO);
  const [activeCategory, setActiveCategory] = useState<string>('All Styles');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const { data, error } = await supabase
          .from('portfolio_items')
          .select('id, title, category, image_path, description')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const formattedData: PortfolioItem[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            category: item.category,
            image_path: item.image_path,
            description: item.description || ''
          }));
          setItems(formattedData);
        }
      } catch (err) {
        console.warn('Could not fetch database items, rendering default high-quality portfolio.', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, []);

  const filteredItems = activeCategory === 'All Styles'
    ? items
    : items.filter(item => item.category.toLowerCase() === activeCategory.toLowerCase());

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedItemIndex === null) return;
    setSelectedItemIndex(prev => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedItemIndex === null) return;
    setSelectedItemIndex(prev => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 90, damping: 14 }
    }
  };

  return (
    <section id="portfolio-gallery" className="relative py-24 bg-[#121212] overflow-hidden text-[#ffffff]">
      {/* Decorative subtle ambient light */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Gallery Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/80 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-xs font-mono tracking-wider text-[#D4AF37] uppercase">Portfolio Showcase</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#FAFAFA] font-oswald uppercase mb-6">
            My Latest Work
          </h2>
          <p className="text-lg text-zinc-400 leading-relaxed font-sans">
            Filter by style to explore genuine tattoos completed by Jake Llewellyn. Click any image to view details in high resolution and begin your bespoke inquiry.
          </p>
        </div>

        {/* Interactive Filter Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-4xl mx-auto">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setSelectedItemIndex(null);
                }}
                className={`px-5 py-2.5 text-xs font-mono tracking-wider uppercase transition-all duration-300 rounded-none border ${
                  isActive
                    ? 'bg-[#D4AF37] text-[#000000] border-[#D4AF37] font-semibold shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                    : 'bg-[#1E1E1E] text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                } focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 min-h-[44px] min-w-[100px]`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Portfolio Masonry/Clean Square Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              onClick={() => setSelectedItemIndex(index)}
              className="group relative cursor-pointer overflow-hidden bg-[#1E1E1E] border border-zinc-800 hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-black">
                <img
                  src={item.image_path}
                  alt={item.description || item.title}
                  loading="lazy"
                  className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-xs font-mono text-[#D4AF37] tracking-widest uppercase mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-xl font-bold font-oswald text-white uppercase tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-300 mt-2 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
                    <span>View Resolution Details</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Mobile details block (visible always on small screens when not hovered) */}
              <div className="p-4 sm:hidden border-t border-zinc-800">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-1">
                  {item.category}
                </span>
                <h3 className="text-base font-bold font-oswald text-[#FAFAFA] uppercase">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Embedded Gallery Bottom CTA */}
        <div className="mt-16 bg-[#1E1E1E] border border-zinc-800 p-8 md:p-12 text-center max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-bl-full pointer-events-none" />
          <h3 className="text-2xl sm:text-3xl font-bold font-oswald text-white uppercase mb-3">
            Love this style?
          </h3>
          <p className="text-zinc-400 max-w-xl mx-auto mb-6 text-sm sm:text-base">
            Let’s design something custom just for you. Use any of the styles above as a reference in your booking form to start your tattoo journey.
          </p>
          <a
            href="#booking-enquiry-form"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#D4AF37] hover:bg-white text-black font-mono text-xs tracking-widest uppercase transition-all duration-300 font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] min-h-[44px]"
          >
            Inquire About This Style
          </a>
        </div>
      </div>

      {/* Swipeable / Mobile-friendly Lightbox Modal */}
      <AnimatePresence>
        {selectedItemIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItemIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
          >
            <button
              onClick={() => setSelectedItemIndex(null)}
              className="absolute top-6 right-6 z-50 text-zinc-400 hover:text-white p-2 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close Lightbox"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left navigation arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 bg-zinc-900/85 border border-zinc-800 hover:border-[#D4AF37] text-white p-3 hover:text-[#D4AF37] transition-all duration-200 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Previous Image"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right navigation arrow */}
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 bg-zinc-900/85 border border-zinc-800 hover:border-[#D4AF37] text-white p-3 hover:text-[#D4AF37] transition-all duration-200 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Next Image"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Main Lightbox Content Card */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-[#1E1E1E] border border-zinc-800 rounded-none overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              {/* Image Area with Zoom */}
              <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden aspect-square md:aspect-auto md:h-[600px]">
                <img
                  src={filteredItems[selectedItemIndex].image_path}
                  alt={filteredItems[selectedItemIndex].title}
                  className="object-contain max-h-full w-full select-none"
                />
              </div>

              {/* Sidebar Details Area */}
              <div className="w-full md:w-[350px] p-6 md:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-zinc-800 bg-[#121212]">
                <div>
                  <span className="inline-block text-xs font-mono text-[#D4AF37] tracking-widest uppercase mb-2">
                    {filteredItems[selectedItemIndex].category}
                  </span>
                  <h3 className="text-2xl font-bold font-oswald text-[#FAFAFA] uppercase leading-tight mb-4">
                    {filteredItems[selectedItemIndex].title}
                  </h3>
                  <div className="w-12 h-[2px] bg-[#D4AF37] mb-6" />
                  <p className="text-sm text-zinc-300 leading-relaxed font-sans mb-8">
                    {filteredItems[selectedItemIndex].description}
                  </p>
                </div>

                <div>
                  {/* Embedded Lightbox CTA */}
                  <div className="p-4 bg-[#1E1E1E] border border-zinc-800 mb-6">
                    <p className="text-xs text-zinc-400 font-sans mb-3">
                      Love this design? Use this style as a reference in your structured enquiry.
                    </p>
                    <a
                      href="#booking-enquiry-form"
                      onClick={() => setSelectedItemIndex(null)}
                      className="block text-center py-3 bg-[#D4AF37] hover:bg-white text-black text-xs font-mono tracking-widest uppercase font-bold transition-colors duration-200 min-h-[44px]"
                    >
                      Inquire About This Style
                    </a>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono text-zinc-500 border-t border-zinc-800 pt-4">
                    <span>Item {selectedItemIndex + 1} of {filteredItems.length}</span>
                    <span>By Jake Llewellyn</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}