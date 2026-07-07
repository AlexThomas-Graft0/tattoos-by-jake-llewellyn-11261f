'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseAuthed';

// Interfaces mapping database schema to TypeScript
interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image_path: string;
  description: string;
  created_at: string;
}

interface BookingEnquiry {
  id: string;
  client_name: string;
  email: string;
  phone: string;
  design_description: string;
  placement: string;
  approximate_size_cm: string;
  is_cover_up: boolean;
  budget_range: string;
  preferred_days: string[];
  reference_image_paths: string[];
  status: string;
  created_at: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  created_at: string;
}

interface StudioHour {
  id: string;
  day_of_week: string;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
  created_at: string;
}

export default function OwnerDashboard() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'enquiries' | 'portfolio' | 'hours' | 'faqs'>('enquiries');

  // Core Data Lists
  const [enquiries, setEnquiries] = useState<BookingEnquiry[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [studioHours, setStudioHours] = useState<StudioHour[]>([]);

  // Loading and feedback states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filter states
  const [enquiryFilter, setEnquiryFilter] = useState<string>('all');
  const [portfolioFilter, setPortfolioFilter] = useState<string>('all');

  // Selected items for viewing/editing
  const [selectedEnquiry, setSelectedEnquiry] = useState<BookingEnquiry | null>(null);

  // Form states - Portfolio Item (Add/Edit)
  const [portfolioId, setPortfolioId] = useState<string>('');
  const [portfolioTitle, setPortfolioTitle] = useState<string>('');
  const [portfolioCategory, setPortfolioCategory] = useState<string>('Black & Grey');
  const [portfolioImagePath, setPortfolioImagePath] = useState<string>('');
  const [portfolioDescription, setPortfolioDescription] = useState<string>('');
  const [isEditingPortfolio, setIsEditingPortfolio] = useState<boolean>(false);
  const [showPortfolioForm, setShowPortfolioForm] = useState<boolean>(false);

  // Form states - FAQ (Add/Edit)
  const [faqId, setFaqId] = useState<string>('');
  const [faqQuestion, setFaqQuestion] = useState<string>('');
  const [faqAnswer, setFaqAnswer] = useState<string>('');
  const [faqDisplayOrder, setFaqDisplayOrder] = useState<number>(0);
  const [isEditingFaq, setIsEditingFaq] = useState<boolean>(false);
  const [showFaqForm, setShowFaqForm] = useState<boolean>(false);

  // Form states - Studio Hours (Edit)
  const [selectedHour, setSelectedHour] = useState<StudioHour | null>(null);
  const [hourOpenTime, setHourOpenTime] = useState<string>('');
  const [hourCloseTime, setHourCloseTime] = useState<string>('');
  const [hourIsClosed, setHourIsClosed] = useState<boolean>(false);

  // Load all dashboard data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Enquiries
      const { data: enqs, error: enqErr } = await supabase
        .from('booking_enquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (enqErr) throw enqErr;
      setEnquiries(enqs || []);

      // 2. Fetch Portfolio
      const { data: ports, error: portErr } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('created_at', { ascending: false });
      if (portErr) throw portErr;
      setPortfolioItems(ports || []);

      // 3. Fetch FAQs
      const { data: faqList, error: faqErr } = await supabase
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true });
      if (faqErr) throw faqErr;
      setFaqs(faqList || []);

      // 4. Fetch Studio Hours
      const { data: hoursList, error: hoursErr } = await supabase
        .from('studio_hours')
        .select('*');
      if (hoursErr) throw hoursErr;

      // Sort hours by standard UK week order starting Monday
      const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const sortedHours = (hoursList || []).sort((a, b) => {
        return daysOrder.indexOf(a.day_of_week) - daysOrder.indexOf(b.day_of_week);
      });
      setStudioHours(sortedHours);

    } catch (err: any) {
      triggerAlert('error', err.message || 'Failed to pull latest studio records.');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setAlert(null);
    }, 6000);
  };

  // --- BOOKING ENQUIRIES CONTROLLERS ---
  const handleUpdateEnquiryStatus = async (id: string, newStatus: string) => {
    setActionLoading(`enquiry-${id}`);
    try {
      const { error } = await supabase
        .from('booking_enquiries')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setEnquiries(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(prev => prev ? { ...prev, status: newStatus } : null);
      }
      triggerAlert('success', `Enquiry status updated to ${newStatus.toUpperCase()}`);
    } catch (err: any) {
      triggerAlert('error', err.message || 'Failed to update status.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to permanently delete this booking enquiry? This action cannot be undone.')) return;
    setActionLoading(`delete-enquiry-${id}`);
    try {
      const { error } = await supabase
        .from('booking_enquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEnquiries(prev => prev.filter(item => item.id !== id));
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(null);
      }
      triggerAlert('success', 'Booking enquiry successfully removed.');
    } catch (err: any) {
      triggerAlert('error', err.message || 'Failed to delete enquiry.');
    } finally {
      setActionLoading(null);
    }
  };


  // --- PORTFOLIO CONTROLLERS ---
  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioTitle || !portfolioImagePath) {
      triggerAlert('error', 'Please provide at least a title and a valid image URL.');
      return;
    }

    setActionLoading('portfolio-save');
    try {
      if (isEditingPortfolio) {
        // Update
        const { error } = await supabase
          .from('portfolio_items')
          .update({
            title: portfolioTitle,
            category: portfolioCategory,
            image_path: portfolioImagePath,
            description: portfolioDescription
          })
          .eq('id', portfolioId);

        if (error) throw error;
        triggerAlert('success', 'Portfolio piece updated successfully!');
      } else {
        // Insert
        const { error } = await supabase
          .from('portfolio_items')
          .insert([{
            title: portfolioTitle,
            category: portfolioCategory,
            image_path: portfolioImagePath,
            description: portfolioDescription
          }]);

        if (error) throw error;
        triggerAlert('success', 'New portfolio piece added successfully!');
      }

      // Reset form states
      resetPortfolioForm();
      await fetchDashboardData();
    } catch (err: any) {
      triggerAlert('error', err.message || 'Failed to save portfolio item.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditPortfolioClick = (item: PortfolioItem) => {
    setPortfolioId(item.id);
    setPortfolioTitle(item.title);
    setPortfolioCategory(item.category);
    setPortfolioImagePath(item.image_path);
    setPortfolioDescription(item.description || '');
    setIsEditingPortfolio(true);
    setShowPortfolioForm(true);
  };

  const handleDeletePortfolio = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio piece?')) return;
    setActionLoading(`delete-portfolio-${id}`);
    try {
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPortfolioItems(prev => prev.filter(item => item.id !== id));
      triggerAlert('success', 'Portfolio piece removed.');
    } catch (err: any) {
      triggerAlert('error', err.message || 'Failed to delete portfolio piece.');
    } finally {
      setActionLoading(null);
    }
  };

  const resetPortfolioForm = () => {
    setPortfolioId('');
    setPortfolioTitle('');
    setPortfolioCategory('Black & Grey');
    setPortfolioImagePath('');
    setPortfolioDescription('');
    setIsEditingPortfolio(false);
    setShowPortfolioForm(false);
  };


  // --- FAQ CONTROLLERS ---
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion || !faqAnswer) {
      triggerAlert('error', 'Please fill in both the question and answer.');
      return;
    }

    setActionLoading('faq-save');
    try {
      if (isEditingFaq) {
        const { error } = await supabase
          .from('faqs')
          .update({
            question: faqQuestion,
            answer: faqAnswer,
            display_order: Number(faqDisplayOrder)
          })
          .eq('id', faqId);

        if (error) throw error;
        triggerAlert('success', 'FAQ updated successfully!');
      } else {
        const { error } = await supabase
          .from('faqs')
          .insert([{
            question: faqQuestion,
            answer: faqAnswer,
            display_order: Number(faqDisplayOrder)
          }]);

        if (error) throw error;
        triggerAlert('success', 'New FAQ added successfully!');
      }

      resetFaqForm();
      await fetchDashboardData();
    } catch (err: any) {
      triggerAlert('error', err.message || 'Failed to save FAQ.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditFaqClick = (faq: FAQ) => {
    setFaqId(faq.id);
    setFaqQuestion(faq.question);
    setFaqAnswer(faq.answer);
    setFaqDisplayOrder(faq.display_order);
    setIsEditingFaq(true);
    setShowFaqForm(true);
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    setActionLoading(`delete-faq-${id}`);
    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setFaqs(prev => prev.filter(item => item.id !== id));
      triggerAlert('success', 'FAQ removed successfully.');
    } catch (err: any) {
      triggerAlert('error', err.message || 'Failed to delete FAQ.');
    } finally {
      setActionLoading(null);
    }
  };

  const resetFaqForm = () => {
    setFaqId('');
    setFaqQuestion('');
    setFaqAnswer('');
    setFaqDisplayOrder(0);
    setIsEditingFaq(false);
    setShowFaqForm(false);
  };


  // --- STUDIO HOURS CONTROLLERS ---
  const handleEditHoursClick = (hour: StudioHour) => {
    setSelectedHour(hour);
    setHourOpenTime(hour.open_time || '10:00');
    setHourCloseTime(hour.close_time || '18:00');
    setHourIsClosed(hour.is_closed || false);
  };

  const handleSaveHours = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHour) return;

    setActionLoading(`hours-save-${selectedHour.id}`);
    try {
      const { error } = await supabase
        .from('studio_hours')
        .update({
          open_time: hourIsClosed ? null : hourOpenTime,
          close_time: hourIsClosed ? null : hourCloseTime,
          is_closed: hourIsClosed
        })
        .eq('id', selectedHour.id);

      if (error) throw error;

      triggerAlert('success', `Studio hours for ${selectedHour.day_of_week} updated!`);
      setSelectedHour(null);
      await fetchDashboardData();
    } catch (err: any) {
      triggerAlert('error', err.message || 'Failed to update studio hours.');
    } finally {
      setActionLoading(null);
    }
  };

  // Quick toggle closed state
  const handleToggleClosed = async (hour: StudioHour) => {
    setActionLoading(`hours-toggle-${hour.id}`);
    try {
      const { error } = await supabase
        .from('studio_hours')
        .update({
          is_closed: !hour.is_closed
        })
        .eq('id', hour.id);

      if (error) throw error;
      triggerAlert('success', `${hour.day_of_week} status changed.`);
      await fetchDashboardData();
    } catch (err: any) {
      triggerAlert('error', err.message || 'Failed to toggle closed state.');
    } finally {
      setActionLoading(null);
    }
  };

  // Helper counters
  const totalEnquiries = enquiries.length;
  const pendingEnquiries = enquiries.filter(e => e.status === 'pending').length;
  const approvedEnquiries = enquiries.filter(e => e.status === 'approved').length;
  const totalPortfolio = portfolioItems.length;

  // Filtered lists
  const filteredEnquiries = enquiries.filter(e => {
    if (enquiryFilter === 'all') return true;
    return e.status === enquiryFilter;
  });

  const filteredPortfolio = portfolioItems.filter(p => {
    if (portfolioFilter === 'all') return true;
    return p.category.toLowerCase() === portfolioFilter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-[#121212] text-[#ffffff] font-sans antialiased selection:bg-[#D4AF37] selection:text-[#000000]">
      {/* Top Brand Header */}
      <header className="border-b border-[#2A2A2A] bg-[#000000] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-black uppercase tracking-wider text-[#F5F5F7]">
              JAKE LLEWELLYN <span className="text-[#D4AF37]">STUDIO</span>
            </span>
            <span className="bg-[#D4AF37] text-[#000000] text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase">
              OWNER CONSOLE
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-xs tracking-wider uppercase text-gray-400 hover:text-white transition duration-150 border border-gray-800 hover:border-gray-600 px-4 py-2 rounded"
            >
              ← Return to Site
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dynamic Alerts */}
        {alert && (
          <div
            className={`mb-8 p-4 rounded-lg flex items-start space-x-3 border ${
              alert.type === 'success'
                ? 'bg-[#16A34A]/10 border-[#16A34A] text-white'
                : 'bg-[#DC2626]/10 border-[#DC2626] text-white'
            }`}
          >
            <span className="text-xl">
              {alert.type === 'success' ? '✓' : '⚠️'}
            </span>
            <div className="flex-1">
              <h4 className="font-bold uppercase tracking-wider text-sm">
                {alert.type === 'success' ? 'Action Completed' : 'Error Occurred'}
              </h4>
              <p className="text-sm text-gray-300 mt-0.5">{alert.message}</p>
            </div>
            <button onClick={() => setAlert(null)} className="text-gray-400 hover:text-white font-bold text-sm">
              ✕
            </button>
          </div>
        )}

        {/* Studio Summary Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1E1E1E] border border-[#2A2A2A] p-6 rounded-lg shadow-xl relative overflow-hidden">
            <div className="absolute right-3 top-3 opacity-10">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
            </div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Pending Enquiries</p>
            <p className="text-4xl font-extrabold text-[#D4AF37] mt-2">{pendingEnquiries}</p>
            <p className="text-xs text-gray-500 mt-1">Out of {totalEnquiries} total submissions</p>
          </div>

          <div className="bg-[#1E1E1E] border border-[#2A2A2A] p-6 rounded-lg shadow-xl relative overflow-hidden">
            <div className="absolute right-3 top-3 opacity-10">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Approved Bookings</p>
            <p className="text-4xl font-extrabold text-[#16A34A] mt-2">{approvedEnquiries}</p>
            <p className="text-xs text-gray-500 mt-1">Ready for scheduled sessions</p>
          </div>

          <div className="bg-[#1E1E1E] border border-[#2A2A2A] p-6 rounded-lg shadow-xl relative overflow-hidden">
            <div className="absolute right-3 top-3 opacity-10">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
            </div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Portfolio Showcase</p>
            <p className="text-4xl font-extrabold text-white mt-2">{totalPortfolio}</p>
            <p className="text-xs text-gray-500 mt-1">High-resolution designs live</p>
          </div>

          <div className="bg-[#1E1E1E] border border-[#2A2A2A] p-6 rounded-lg shadow-xl relative overflow-hidden">
            <div className="absolute right-3 top-3 opacity-10">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
              </svg>
            </div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Active FAQs</p>
            <p className="text-4xl font-extrabold text-white mt-2">{faqs.length}</p>
            <p className="text-xs text-gray-500 mt-1">Helpful answers listed for clients</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#2A2A2A] mb-8 overflow-x-auto space-x-1 sm:space-x-4">
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`py-4 px-6 font-bold uppercase tracking-wider text-sm transition-all duration-150 border-b-2 whitespace-nowrap ${
              activeTab === 'enquiries'
                ? 'border-[#D4AF37] text-[#D4AF37] bg-[#1E1E1E]/50'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-[#1E1E1E]/20'
            }`}
          >
            📬 Booking Enquiries ({enquiries.length})
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`py-4 px-6 font-bold uppercase tracking-wider text-sm transition-all duration-150 border-b-2 whitespace-nowrap ${
              activeTab === 'portfolio'
                ? 'border-[#D4AF37] text-[#D4AF37] bg-[#1E1E1E]/50'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-[#1E1E1E]/20'
            }`}
          >
            🎨 Portfolio Gallery ({portfolioItems.length})
          </button>
          <button
            onClick={() => setActiveTab('hours')}
            className={`py-4 px-6 font-bold uppercase tracking-wider text-sm transition-all duration-150 border-b-2 whitespace-nowrap ${
              activeTab === 'hours'
                ? 'border-[#D4AF37] text-[#D4AF37] bg-[#1E1E1E]/50'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-[#1E1E1E]/20'
            }`}
          >
            🕒 Studio Hours
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`py-4 px-6 font-bold uppercase tracking-wider text-sm transition-all duration-150 border-b-2 whitespace-nowrap ${
              activeTab === 'faqs'
                ? 'border-[#D4AF37] text-[#D4AF37] bg-[#1E1E1E]/50'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-[#1E1E1E]/20'
            }`}
          >
            ❓ FAQs Manager ({faqs.length})
          </button>
        </div>

        {/* LOADING INDICATOR */}
        {isLoading && (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D4AF37] mb-4"></div>
            <p className="text-gray-400 uppercase tracking-widest text-xs">Fetching latest database records...</p>
          </div>
        )}

        {/* TAB CONTENT */}
        {!isLoading && (
          <div>
            
            {/* 1. BOOKING ENQUIRIES TAB */}
            {activeTab === 'enquiries' && (
              <div className="space-y-6">
                
                {/* Filter & Subtitle */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#1E1E1E] p-4 rounded-lg border border-[#2A2A2A]">
                  <div>
                    <h2 className="text-lg font-bold uppercase tracking-wider text-[#F5F5F7]">Client Booking Inquiries</h2>
                    <p className="text-xs text-gray-400">Incoming requests from the online booking form.</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Filter Status:</span>
                    <select
                      value={enquiryFilter}
                      onChange={(e) => setEnquiryFilter(e.target.value)}
                      className="bg-[#121212] border border-[#2A2A2A] text-white text-xs rounded px-3 py-1.5 focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="all">All Enquiries</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Main Enquiries Split View */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left list of submissions */}
                  <div className="lg:col-span-2 space-y-3 max-h-[75vh] overflow-y-auto pr-2">
                    {filteredEnquiries.length === 0 ? (
                      <div className="bg-[#1E1E1E] rounded-lg p-10 text-center border border-[#2A2A2A]">
                        <p className="text-gray-400 text-sm">No enquiries found matching filter "{enquiryFilter}".</p>
                      </div>
                    ) : (
                      filteredEnquiries.map((enq) => (
                        <div
                          key={enq.id}
                          onClick={() => setSelectedEnquiry(enq)}
                          className={`p-4 rounded-lg border transition duration-150 cursor-pointer text-left ${
                            selectedEnquiry?.id === enq.id
                              ? 'bg-[#1E1E1E] border-[#D4AF37] shadow-lg'
                              : 'bg-[#1E1E1E] border-[#2A2A2A] hover:border-gray-500'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-[#F5F5F7] tracking-wider text-base">{enq.client_name}</h3>
                              <p className="text-xs text-gray-400">{enq.email} • {enq.phone}</p>
                            </div>
                            <span className={`text-[10px] uppercase tracking-widest font-extrabold px-2 py-1 rounded ${
                              enq.status === 'pending' ? 'bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/30' :
                              enq.status === 'approved' ? 'bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/30' :
                              enq.status === 'completed' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                              'bg-gray-800 text-gray-400'
                            }`}>
                              {enq.status}
                            </span>
                          </div>

                          <div className="mt-2 text-xs text-gray-300 line-clamp-2">
                            <strong>Design:</strong> {enq.design_description}
                          </div>

                          <div className="mt-3 pt-3 border-t border-[#2A2A2A] flex justify-between items-center text-[11px] text-gray-400">
                            <span>Placed: {enq.placement} ({enq.approximate_size_cm})</span>
                            <span>{new Date(enq.created_at).toLocaleDateString('en-GB')}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Right Detail Pane */}
                  <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6 sticky top-28 self-start shadow-xl">
                    {selectedEnquiry ? (
                      <div className="space-y-6">
                        <div className="flex justify-between items-start border-b border-[#2A2A2A] pb-4">
                          <div>
                            <span className="text-[10px] tracking-widest uppercase text-[#D4AF37] font-semibold">SELECTED ENQUIRY</span>
                            <h3 className="text-xl font-extrabold text-[#F5F5F7] mt-1">{selectedEnquiry.client_name}</h3>
                            <p className="text-xs text-gray-400 mt-1">Submitted on {new Date(selectedEnquiry.created_at).toLocaleString('en-GB')}</p>
                          </div>
                          <button
                            onClick={() => setSelectedEnquiry(null)}
                            className="text-gray-500 hover:text-white text-xs font-bold"
                          >
                            Close ✕
                          </button>
                        </div>

                        {/* Status controls */}
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Update Status</label>
                          <div className="grid grid-cols-2 gap-1.5">
                            {['pending', 'approved', 'completed', 'cancelled'].map((st) => (
                              <button
                                key={st}
                                disabled={actionLoading !== null}
                                onClick={() => handleUpdateEnquiryStatus(selectedEnquiry.id, st)}
                                className={`text-[10px] uppercase tracking-widest font-bold py-2 px-1 rounded border text-center transition duration-150 ${
                                  selectedEnquiry.status === st
                                    ? 'bg-[#D4AF37] text-[#000000] border-[#D4AF37]'
                                    : 'bg-[#121212] text-gray-300 border-[#2A2A2A] hover:bg-[#2A2A2A]'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Client Info */}
                        <div className="space-y-3 bg-[#121212] p-4 rounded border border-[#2A2A2A] text-sm">
                          <div>
                            <span className="text-xs text-gray-400 block">Email Address</span>
                            <a href={`mailto:${selectedEnquiry.email}`} className="text-[#D4AF37] hover:underline font-semibold block break-all">
                              {selectedEnquiry.email}
                            </a>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400 block">Phone Number</span>
                            <a href={`tel:${selectedEnquiry.phone}`} className="text-white hover:underline font-semibold block">
                              {selectedEnquiry.phone}
                            </a>
                          </div>
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#2A2A2A]">
                            <div>
                              <span className="text-xs text-gray-400 block">Cover-up?</span>
                              <span className="font-semibold text-white">
                                {selectedEnquiry.is_cover_up ? '⚠️ Yes (Rework)' : 'No'}
                              </span>
                            </div>
                            <div>
                              <span className="text-xs text-gray-400 block">Budget Range</span>
                              <span className="font-semibold text-white">
                                {selectedEnquiry.budget_range || 'Not specified'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Design Description */}
                        <div>
                          <h4 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Design Idea</h4>
                          <p className="text-sm bg-[#121212] p-3 rounded border border-[#2A2A2A] text-gray-200 whitespace-pre-line leading-relaxed">
                            {selectedEnquiry.design_description}
                          </p>
                        </div>

                        {/* Placement & Size */}
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="bg-[#121212] p-3 rounded border border-[#2A2A2A]">
                            <span className="text-gray-400 block uppercase tracking-widest text-[9px] mb-1">Body Placement</span>
                            <span className="font-bold text-white">{selectedEnquiry.placement}</span>
                          </div>
                          <div className="bg-[#121212] p-3 rounded border border-[#2A2A2A]">
                            <span className="text-gray-400 block uppercase tracking-widest text-[9px] mb-1">Approx. Size</span>
                            <span className="font-bold text-white">{selectedEnquiry.approximate_size_cm}</span>
                          </div>
                        </div>

                        {/* Preferred Days */}
                        <div>
                          <h4 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Preferred Workdays</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedEnquiry.preferred_days && selectedEnquiry.preferred_days.length > 0 ? (
                              selectedEnquiry.preferred_days.map((day, i) => (
                                <span key={i} className="bg-gray-800 text-gray-200 text-[10px] px-2 py-1 rounded border border-gray-700">
                                  {day}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-500 text-xs italic">No preferred days specified</span>
                            )}
                          </div>
                        </div>

                        {/* Reference Images */}
                        <div>
                          <h4 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Reference Images</h4>
                          {selectedEnquiry.reference_image_paths && selectedEnquiry.reference_image_paths.length > 0 ? (
                            <div className="grid grid-cols-3 gap-2">
                              {selectedEnquiry.reference_image_paths.map((path, index) => (
                                <a
                                  key={index}
                                  href={path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group block relative aspect-square bg-[#121212] rounded border border-[#2A2A2A] overflow-hidden hover:border-[#D4AF37] transition"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={path}
                                    alt={`Reference ${index + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-150"
                                  />
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                    <span className="text-[10px] text-[#D4AF37] font-bold">VIEW</span>
                                  </div>
                                </a>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500 italic bg-[#121212] p-3 rounded border border-[#2A2A2A]">
                              No reference images uploaded.
                            </p>
                          )}
                        </div>

                        {/* Danger zone actions */}
                        <div className="pt-4 border-t border-[#2A2A2A] flex justify-between items-center">
                          <button
                            disabled={actionLoading !== null}
                            onClick={() => handleDeleteEnquiry(selectedEnquiry.id)}
                            className="text-xs text-red-500 hover:text-red-400 font-bold uppercase tracking-wider transition"
                          >
                            {actionLoading === `delete-enquiry-${selectedEnquiry.id}` ? 'Deleting...' : 'Delete Enquiry'}
                          </button>
                        </div>

                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <p className="text-2xl mb-2">📬</p>
                        <p className="text-xs uppercase tracking-wider">Select an enquiry from the list to view complete design specifications, budget, and images.</p>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* 2. PORTFOLIO GALLERY TAB */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                
                {/* Header Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#1E1E1E] p-4 rounded-lg border border-[#2A2A2A]">
                  <div>
                    <h2 className="text-lg font-bold uppercase tracking-wider text-[#F5F5F7]">Portfolio Showcase Management</h2>
                    <p className="text-xs text-gray-400">Add, edit, or remove client-facing tattoo artwork.</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <select
                      value={portfolioFilter}
                      onChange={(e) => setPortfolioFilter(e.target.value)}
                      className="bg-[#121212] border border-[#2A2A2A] text-white text-xs rounded px-3 py-1.5 focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="all">All Styles</option>
                      <option value="Black & Grey">Black & Grey</option>
                      <option value="Vibrant Color">Vibrant Color</option>
                      <option value="Fine Line">Fine Line</option>
                      <option value="Cover-ups">Cover-ups</option>
                      <option value="Flash Designs">Flash Designs</option>
                    </select>

                    <button
                      onClick={() => {
                        resetPortfolioForm();
                        setShowPortfolioForm(true);
                      }}
                      className="bg-[#D4AF37] hover:bg-[#c19e30] text-black font-bold uppercase tracking-wider text-xs px-4 py-2 rounded transition"
                    >
                      + Add New Piece
                    </button>
                  </div>
                </div>

                {/* Create/Edit Form Collapse */}
                {showPortfolioForm && (
                  <form onSubmit={handleSavePortfolio} className="bg-[#1E1E1E] border-2 border-[#D4AF37] rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-3">
                      <h3 className="font-extrabold uppercase tracking-wider text-sm text-[#D4AF37]">
                        {isEditingPortfolio ? '✍️ Edit Portfolio Item' : '✨ Add New Portfolio Piece'}
                      </h3>
                      <button
                        type="button"
                        onClick={resetPortfolioForm}
                        className="text-gray-400 hover:text-white text-xs"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Tattoo Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Neo-Traditional Rose & Dagger"
                          value={portfolioTitle}
                          onChange={(e) => setPortfolioTitle(e.target.value)}
                          className="w-full bg-[#121212] border border-[#2A2A2A] text-white text-sm rounded p-2.5 focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Style Category *</label>
                        <select
                          value={portfolioCategory}
                          onChange={(e) => setPortfolioCategory(e.target.value)}
                          className="w-full bg-[#121212] border border-[#2A2A2A] text-white text-sm rounded p-2.5 focus:outline-none focus:border-[#D4AF37]"
                        >
                          <option value="Black & Grey">Black & Grey</option>
                          <option value="Vibrant Color">Vibrant Color</option>
                          <option value="Fine Line">Fine Line</option>
                          <option value="Cover-ups">Cover-ups</option>
                          <option value="Flash Designs">Flash Designs</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Image URL *</label>
                      <input
                        type="url"
                        required
                        placeholder="https://images.unsplash.com/... or other secure image URL"
                        value={portfolioImagePath}
                        onChange={(e) => setPortfolioImagePath(e.target.value)}
                        className="w-full bg-[#121212] border border-[#2A2A2A] text-white text-sm rounded p-2.5 focus:outline-none focus:border-[#D4AF37]"
                      />
                      <p className="text-[10px] text-gray-500 mt-1">Please provide a direct URL starting with https://</p>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Description / Healing Notes</label>
                      <textarea
                        rows={3}
                        placeholder="Detail the needles used, placement, or custom client story..."
                        value={portfolioDescription}
                        onChange={(e) => setPortfolioDescription(e.target.value)}
                        className="w-full bg-[#121212] border border-[#2A2A2A] text-white text-sm rounded p-2.5 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={resetPortfolioForm}
                        className="bg-transparent border border-gray-700 hover:border-gray-500 text-gray-300 font-bold uppercase tracking-wider text-xs px-4 py-2 rounded transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={actionLoading === 'portfolio-save'}
                        className="bg-[#D4AF37] hover:bg-[#c19e30] text-black font-bold uppercase tracking-wider text-xs px-5 py-2 rounded transition"
                      >
                        {actionLoading === 'portfolio-save' ? 'Saving...' : 'Save Portfolio Piece'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Portfolio Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredPortfolio.length === 0 ? (
                    <div className="col-span-full bg-[#1E1E1E] rounded-lg p-16 text-center border border-[#2A2A2A]">
                      <p className="text-gray-400 text-sm">No portfolio items found in this category.</p>
                    </div>
                  ) : (
                    filteredPortfolio.map((item) => (
                      <div key={item.id} className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg overflow-hidden flex flex-col justify-between">
                        <div>
                          <div className="relative aspect-square bg-black">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.image_path}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2 left-2 bg-black/80 text-[#D4AF37] border border-[#D4AF37]/40 text-[9px] uppercase tracking-widest px-2.5 py-1 rounded font-bold">
                              {item.category}
                            </span>
                          </div>
                          <div className="p-4">
                            <h4 className="font-bold text-white text-lg tracking-wide">{item.title}</h4>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                              {item.description || 'No custom description provided.'}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 pt-0 border-t border-[#2A2A2A] bg-[#1a1a1a] flex justify-between gap-2">
                          <button
                            onClick={() => handleEditPortfolioClick(item)}
                            className="flex-1 text-center py-2 text-xs font-bold text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded transition"
                          >
                            Edit
                          </button>
                          <button
                            disabled={actionLoading === `delete-portfolio-${item.id}`}
                            onClick={() => handleDeletePortfolio(item.id)}
                            className="flex-1 text-center py-2 text-xs font-bold text-red-400 hover:text-white bg-red-950/40 hover:bg-red-900/60 rounded transition"
                          >
                            {actionLoading === `delete-portfolio-${item.id}` ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

            {/* 3. STUDIO HOURS TAB */}
            {activeTab === 'hours' && (
              <div className="space-y-6">
                
                <div className="bg-[#1E1E1E] p-4 rounded-lg border border-[#2A2A2A]">
                  <h2 className="text-lg font-bold uppercase tracking-wider text-[#F5F5F7]">Studio Operating Hours</h2>
                  <p className="text-xs text-gray-400">Define your standard weekly availability. Clients will see a dynamic live OPEN badge according to these times.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Hours List */}
                  <div className="lg:col-span-2 space-y-2">
                    {studioHours.map((hour) => (
                      <div
                        key={hour.id}
                        className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center sm:justify-between transition duration-150 ${
                          selectedHour?.id === hour.id
                            ? 'bg-[#1E1E1E] border-[#D4AF37]'
                            : 'bg-[#1E1E1E] border-[#2A2A2A]'
                        }`}
                      >
                        <div>
                          <h4 className="font-bold text-white text-base tracking-wide">{hour.day_of_week}</h4>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {hour.is_closed ? (
                              <span className="text-red-400 font-semibold uppercase tracking-wider">🛑 CLOSED</span>
                            ) : (
                              <span>🟢 OPEN: {hour.open_time?.substring(0, 5) || '10:00'} – {hour.close_time?.substring(0, 5) || '18:00'}</span>
                            )}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                          <button
                            onClick={() => handleToggleClosed(hour)}
                            disabled={actionLoading !== null}
                            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded border transition ${
                              hour.is_closed
                                ? 'bg-green-950/40 border-green-800 text-green-400 hover:bg-green-900/40'
                                : 'bg-red-950/40 border-red-900 text-red-400 hover:bg-red-900/40'
                            }`}
                          >
                            {hour.is_closed ? 'Set Open' : 'Set Closed'}
                          </button>
                          <button
                            onClick={() => handleEditHoursClick(hour)}
                            className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition"
                          >
                            Modify Times
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Edit Panel */}
                  <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-6 sticky top-28 self-start shadow-xl">
                    {selectedHour ? (
                      <form onSubmit={handleSaveHours} className="space-y-4">
                        <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-3">
                          <h3 className="font-extrabold uppercase tracking-wider text-sm text-[#D4AF37]">
                            Modify {selectedHour.day_of_week}
                          </h3>
                          <button
                            type="button"
                            onClick={() => setSelectedHour(null)}
                            className="text-gray-500 hover:text-white text-xs"
                          >
                            Cancel
                          </button>
                        </div>

                        <div className="flex items-center space-x-2 bg-[#121212] p-3 rounded border border-[#2A2A2A]">
                          <input
                            type="checkbox"
                            id="edit_is_closed"
                            checked={hourIsClosed}
                            onChange={(e) => setHourIsClosed(e.target.checked)}
                            className="rounded text-[#D4AF37] focus:ring-0 cursor-pointer"
                          />
                          <label htmlFor="edit_is_closed" className="text-xs uppercase tracking-wider text-gray-300 font-bold cursor-pointer select-none">
                            Mark Studio Closed on {selectedHour.day_of_week}
                          </label>
                        </div>

                        {!hourIsClosed && (
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Open Time</label>
                              <input
                                type="time"
                                required
                                value={hourOpenTime}
                                onChange={(e) => setHourOpenTime(e.target.value)}
                                className="w-full bg-[#121212] border border-[#2A2A2A] text-white text-sm rounded p-2 focus:outline-none focus:border-[#D4AF37]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Close Time</label>
                              <input
                                type="time"
                                required
                                value={hourCloseTime}
                                onChange={(e) => setHourCloseTime(e.target.value)}
                                className="w-full bg-[#121212] border border-[#2A2A2A] text-white text-sm rounded p-2 focus:outline-none focus:border-[#D4AF37]"
                              />
                            </div>
                          </div>
                        )}

                        <div className="pt-2 flex justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => setSelectedHour(null)}
                            className="bg-transparent border border-gray-700 text-gray-300 font-bold uppercase tracking-wider text-xs px-4 py-2 rounded transition"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={actionLoading !== null}
                            className="bg-[#D4AF37] hover:bg-[#c19e30] text-black font-bold uppercase tracking-wider text-xs px-5 py-2 rounded transition"
                          >
                            Save Changes
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <p className="text-2xl mb-2">🕒</p>
                        <p className="text-xs uppercase tracking-wider">Select a weekday from the left to configure working hours or toggle closed days.</p>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* 4. FAQS TAB */}
            {activeTab === 'faqs' && (
              <div className="space-y-6">
                
                {/* Header Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#1E1E1E] p-4 rounded-lg border border-[#2A2A2A]">
                  <div>
                    <h2 className="text-lg font-bold uppercase tracking-wider text-[#F5F5F7]">Frequently Asked Questions</h2>
                    <p className="text-xs text-gray-400">Configure questions and detailed answers shown at the bottom of the landing page.</p>
                  </div>
                  <button
                    onClick={() => {
                      resetFaqForm();
                      setShowFaqForm(true);
                    }}
                    className="bg-[#D4AF37] hover:bg-[#c19e30] text-black font-bold uppercase tracking-wider text-xs px-4 py-2 rounded transition"
                  >
                    + Add New FAQ
                  </button>
                </div>

                {/* Create/Edit Form */}
                {showFaqForm && (
                  <form onSubmit={handleSaveFaq} className="bg-[#1E1E1E] border-2 border-[#D4AF37] rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-3">
                      <h3 className="font-extrabold uppercase tracking-wider text-sm text-[#D4AF37]">
                        {isEditingFaq ? '✍️ Edit FAQ Item' : '✨ Add New FAQ'}
                      </h3>
                      <button
                        type="button"
                        onClick={resetFaqForm}
                        className="text-gray-400 hover:text-white text-xs"
                      >
                        Cancel
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Question *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Do you accept card payments?"
                        value={faqQuestion}
                        onChange={(e) => setFaqQuestion(e.target.value)}
                        className="w-full bg-[#121212] border border-[#2A2A2A] text-white text-sm rounded p-2.5 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Answer *</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="State your studio policy or guidelines clearly..."
                        value={faqAnswer}
                        onChange={(e) => setFaqAnswer(e.target.value)}
                        className="w-full bg-[#121212] border border-[#2A2A2A] text-white text-sm rounded p-2.5 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Display Order Priority</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={faqDisplayOrder}
                        onChange={(e) => setFaqDisplayOrder(Number(e.target.value))}
                        className="w-32 bg-[#121212] border border-[#2A2A2A] text-white text-sm rounded p-2.5 focus:outline-none focus:border-[#D4AF37]"
                      />
                      <p className="text-[10px] text-gray-500 mt-1">Lower numbers will display first to clients.</p>
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={resetFaqForm}
                        className="bg-transparent border border-gray-700 hover:border-gray-500 text-gray-300 font-bold uppercase tracking-wider text-xs px-4 py-2 rounded transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={actionLoading === 'faq-save'}
                        className="bg-[#D4AF37] hover:bg-[#c19e30] text-black font-bold uppercase tracking-wider text-xs px-5 py-2 rounded transition"
                      >
                        {actionLoading === 'faq-save' ? 'Saving...' : 'Save FAQ'}
                      </button>
                    </div>
                  </form>
                )}

                {/* FAQs Accordion/Stack */}
                <div className="space-y-4">
                  {faqs.length === 0 ? (
                    <div className="bg-[#1E1E1E] rounded-lg p-16 text-center border border-[#2A2A2A]">
                      <p className="text-gray-400 text-sm">No FAQs stored in the system yet.</p>
                    </div>
                  ) : (
                    faqs.map((faq) => (
                      <div key={faq.id} className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg p-5">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="bg-gray-800 text-gray-400 text-[10px] px-2 py-0.5 rounded font-mono">
                                Order: {faq.display_order}
                              </span>
                            </div>
                            <h4 className="font-bold text-white text-base mt-2 leading-snug">
                              {faq.question}
                            </h4>
                            <p className="text-sm text-gray-300 mt-2 whitespace-pre-line leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditFaqClick(faq)}
                              className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold px-3 py-1.5 rounded transition"
                            >
                              Edit
                            </button>
                            <button
                              disabled={actionLoading === `delete-faq-${faq.id}`}
                              onClick={() => handleDeleteFaq(faq.id)}
                              className="bg-red-950/40 hover:bg-red-900/60 text-red-400 text-xs font-bold px-3 py-1.5 rounded transition"
                            >
                              {actionLoading === `delete-faq-${faq.id}` ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-[#000000] border-t border-[#2A2A2A] py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            © 2025 Tattoos by Jake Llewellyn • Gilfach Bargoed • All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}