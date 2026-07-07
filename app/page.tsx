import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { PhilosophySection } from "@/components/PhilosophySection";
import { ArtistShowcase } from "@/components/ArtistShowcase";
import { PortfolioGallery } from "@/components/PortfolioGallery";
import { StudioPolicies } from "@/components/StudioPolicies";
import { BookingEnquiryForm } from "@/components/BookingEnquiryForm";
import { AftercareGuide } from "@/components/AftercareGuide";
import { ContactAndFaq } from "@/components/ContactAndFaq";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\":\"https://schema.org\",\"@type\":\"LocalBusiness\",\"name\":\"Tattoos by Jake Llewellyn\",\"description\":\"At Tattoos by jakellewellyn, I offer a range of services to cater to your individual tattoo needs. I specialise in custom designs, client-specified artwork, and cover-ups (depending on the existing design). All tattoo styles are welcome, ensuring your body art is exactly as you envision it.\",\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"6A Gwerthonor Place Gilfach Bargoed CF81 8JQ\"},\"url\":\"https://tattoos-by-jake-llewellyn-11261f.duckbyte.co\"}" }} />
      <Navbar />
      <div id="hero-section" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <HeroSection />
        </Suspense>
      </div>
      <div id="philosophy-section" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <PhilosophySection />
        </Suspense>
      </div>
      <div id="artist-showcase" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <ArtistShowcase />
        </Suspense>
      </div>
      <div id="portfolio-gallery" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <PortfolioGallery />
        </Suspense>
      </div>
      <div id="studio-policies" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <StudioPolicies />
        </Suspense>
      </div>
      <div id="booking-enquiry-form" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <BookingEnquiryForm />
        </Suspense>
      </div>
      <div id="aftercare-guide" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <AftercareGuide />
        </Suspense>
      </div>
      <div id="contact-and-faq" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <ContactAndFaq />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
