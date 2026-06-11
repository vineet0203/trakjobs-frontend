import React, { useRef, useState, useEffect } from "react";
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
import serviceCatalog, { fetchServiceCatalog } from "../components/landing/serviceCatalog";

const LandingPage = () => {
  const [bookingData, setBookingData] = useState(null);
  const [catalog, setCatalog] = useState(serviceCatalog);
  const workflowRef = useRef(null);

  useEffect(() => {
    const loadCatalog = async () => {
      const data = await fetchServiceCatalog();
      setCatalog(data);
    };
    loadCatalog();
  }, []);

  const handleStartBooking = ({ location, service }) => {
    setBookingData({ location, ...service });
    setTimeout(() => {
      const detailsElement = document.getElementById("booking-details-section");
      if (detailsElement) {
        detailsElement.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        workflowRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 200);
  };

  return (
    <div className="bg-white text-slate-900 font-sans">
      <Navbar onBook={handleStartBooking} catalog={catalog} />
      <main className="overflow-hidden">
        <HeroSection catalog={catalog} onBook={handleStartBooking} />
        <PopularServices onBook={handleStartBooking} catalog={catalog} />
        <TrustStripSection />
        <TrustBadgesSection />
        <div ref={workflowRef}>
          <BookingWorkflow catalog={catalog} initialSelection={bookingData} />
        </div>
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
