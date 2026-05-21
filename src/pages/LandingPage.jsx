import React, { useRef, useState } from "react";
import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import TrustBadgesSection from "../components/landing/TrustBadgesSection";
import TrustStripSection from "../components/landing/TrustStripSection";
import StatsSection from "../components/landing/StatsSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import DashboardPreview from "../components/landing/DashboardPreview";
import PopularServices from "../components/landing/PopularServices";
import VendorsSection from "../components/landing/VendorsSection";
import Testimonials from "../components/landing/Testimonials";
import MobileAppSection from "../components/landing/MobileAppSection";
import AIAutomationSection from "../components/landing/AIAutomationSection";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";
import BookingWorkflow from "../components/landing/BookingWorkflow";
import serviceCatalog from "../components/landing/serviceCatalog";

const LandingPage = () => {
  const [bookingData, setBookingData] = useState(null);
  const workflowRef = useRef(null);

  const handleStartBooking = ({ location, service }) => {
    setBookingData({ location, ...service });
    setTimeout(() => {
      workflowRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <div className="bg-white text-slate-900 font-sans">
      <Navbar onBook={handleStartBooking} />
      <main className="overflow-hidden">
        <HeroSection catalog={serviceCatalog} onBook={handleStartBooking} />
        <PopularServices onBook={handleStartBooking} catalog={serviceCatalog} />
        <TrustStripSection />
        <TrustBadgesSection />
        {bookingData && (
          <div ref={workflowRef}>
            <BookingWorkflow catalog={serviceCatalog} initialSelection={bookingData} />
          </div>
        )}
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <DashboardPreview />
        <VendorsSection />
        <Testimonials />
        <MobileAppSection />
        <AIAutomationSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
