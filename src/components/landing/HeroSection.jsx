import React from "react";
import { motion } from "framer-motion";
import landingImage from "../../assets/Landing Image.webp";
import {
  Star,
  Building2,
  ShieldCheck,
  Clock,
  Award,
  Calendar,
  PlayCircle
} from "lucide-react";

const trustHighlights = [
  { title: "Residential & Commercial Services", icon: Building2 },
  { title: "Skilled & Background Checked Pros", icon: ShieldCheck },
  { title: "On-Time Guaranteed", icon: Clock },
  { title: "Satisfaction 100% Guaranteed", icon: Award },
];

const HeroSection = ({ onBook }) => {
  return (
    <section id="home" className="relative min-h-[600px] overflow-hidden bg-[#fafafa]">
      <div className="mx-auto w-full max-w-none px-6 md:px-10 lg:px-14 pt-12 lg:pt-16 pb-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-1 flex-col justify-center lg:flex-[0_0_45%]"
          >
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow-sm">
              <Star size={14} className="fill-brand-gold text-brand-gold" />
              Your Trusted Handyman Partner
            </div>

            <h1 className="mt-10 text-5xl font-extrabold leading-[1.1] md:text-[64px] text-brand-navy tracking-tight">
              Reliable Handyman <br />
              Services for Every
              <span className="mt-2 block text-[#ffb800]">Home & Business</span>
            </h1>

            <p className="mt-6 text-[17px] leading-relaxed text-slate-700 font-medium max-w-lg">
              Professional. Punctual. Affordable. <br />
              We handle the fixes, so you can focus on what matters.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button onClick={() => onBook && onBook({ location: "", service: { name: "General Service", category: "General", basePrice: 0, duration: "1 hr" } })}
                className="inline-flex items-center gap-2 rounded-lg bg-[#ffb800] px-7 py-3.5 text-sm font-bold text-brand-navy shadow-md transition hover:bg-[#e6a600]"
              >
                <Calendar size={18} />
                Book a Service
              </button>
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-brand-navy transition hover:border-slate-300"
              >
                <PlayCircle size={18} className="text-slate-600" />
                How It Works
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600">
              <div className="flex items-center">
                {[
                  "https://randomuser.me/api/portraits/men/32.jpg",
                  "https://randomuser.me/api/portraits/women/44.jpg",
                  "https://randomuser.me/api/portraits/men/46.jpg",
                ].map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt="Customer"
                    className="-ml-3 h-10 w-10 rounded-full border-2 border-white object-cover first:ml-0 shadow-sm"
                  />
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-[#ffb800]">
                  <Star size={14} className="fill-current" />
                  <Star size={14} className="fill-current" />
                  <Star size={14} className="fill-current" />
                  <Star size={14} className="fill-current" />
                  <Star size={14} className="fill-current" />
                  <span className="ml-2 text-brand-navy font-bold">4.9/5</span>
                  <span className="text-slate-400 font-normal"> | From 2,000+ Happy Customers</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative lg:flex-[0_0_55%] lg:max-w-[55%] min-h-[500px] hidden lg:block"
          >
            <div className="absolute inset-0 overflow-hidden after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(to_bottom,transparent_65%,#fafafa_100%)]">
              <img
                src={landingImage}
                alt="Handyman"
                className="h-full w-full object-cover object-top" style={{ transform: "translateX(-32%)" }}
              />
            </div>

            {/* Expanded Floating Card - 320px width, one line text, larger icons */}
            <div className="absolute right-0 top-4 z-20 w-[450px] rounded-2xl bg-[#1a2940] px-6 py-8 text-white shadow-2xl">
              <div className="flex flex-col gap-6">
                {trustHighlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <span className="flex items-center justify-center text-[#ffb800] flex-shrink-0">
                      <item.icon size={32} strokeWidth={1.5} />
                    </span>
                    <span className="text-[14px] font-semibold whitespace-nowrap">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;