import React, { useState } from "react";
import { 
  Hammer, 
  Menu, 
  Phone, 
  X, 
  PenTool, 
  Zap, 
  Droplet, 
  Paintbrush, 
  Wrench, 
  Sparkles, 
  Home, 
  Leaf, 
  Cpu, 
  Package, 
  ChevronRight,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import serviceCatalog from "./serviceCatalog";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "For Business", href: "#features" },
  { label: "About Us", href: "#about" },
  { label: "How It Works", href: "#how" },
  { label: "Contact Us", href: "#contact" },
];

const getCategoryIcon = (name) => {
  if (name.includes("Home Repair")) return Home;
  if (name.includes("Electrical")) return Zap;
  if (name.includes("Plumbing")) return Droplet;
  if (name.includes("Painting")) return Paintbrush;
  if (name.includes("Carpentry")) return Hammer;
  if (name.includes("Cleaning")) return Sparkles;
  if (name.includes("Appliance")) return Wrench;
  if (name.includes("Outdoor")) return Leaf;
  if (name.includes("Smart Home")) return Cpu;
  if (name.includes("Moving")) return Package;
  return Hammer;
};

const Navbar = ({ onBook, catalog = serviceCatalog }) => {
  const [open, setOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(catalog[0]?.name || "");
  const selectedCategoryData = catalog.find((c) => c.name === hoveredCategory) || catalog[0];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="mx-auto w-full max-w-none px-6 md:px-10 lg:px-14 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-brand-navy">
            {/* Simple logo icon simulating the FixlyHandy one */}
            <div className="relative">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 12V22H22V12L12 2Z" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 22V12" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
          <div className="leading-none pt-1">
            <span className="text-[22px] font-bold tracking-tight text-brand-navy">
              Trak<span className="text-[#ffb800]">Jobs</span>
            </span>
            <div className="mt-0.5 text-[10px] font-semibold text-slate-500 tracking-wide uppercase">
              Fix it. Right. On time.
            </div>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 text-[15px] font-semibold text-brand-navy">
          {navLinks
            .filter((link) => link.label !== "Services")
            .map((link, index) => (
              <React.Fragment key={link.label}>
                
                {/* Services after Home */}
                {index === 1 && (
                  <div
                    className="relative"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <a
                      href="#services"
                      className="relative transition hover:text-[#ffb800] flex items-center gap-1"
                    >
                      Services
                      <svg
                        className="w-3 h-3 text-slate-400 hover:text-[#ffb800]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </a>

                    <div
                      className={`absolute left-1/2 -translate-x-1/2 top-full z-50 pt-2 w-[850px] transition-all duration-200 ${
                        isDropdownOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
                      }`}
                    >
                      <div className="flex rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden min-h-[420px]">
                        {/* Left sidebar: Categories */}
                        <div className="w-[280px] bg-slate-50/80 border-r border-slate-100 p-4 flex flex-col gap-1.5">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                            Categories
                          </p>
                          {catalog.map((category) => {
                            const Icon = getCategoryIcon(category.name);
                            const isActive = hoveredCategory === category.name;
                            return (
                              <button
                                key={category.name}
                                type="button"
                                onMouseEnter={() => setHoveredCategory(category.name)}
                                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-[14px] font-bold transition-all ${
                                  isActive
                                    ? "bg-white text-brand-navy shadow-sm ring-1 ring-slate-100/50"
                                    : "text-slate-600 hover:bg-slate-100/60 hover:text-brand-navy"
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                                    isActive ? "bg-amber-50 border-amber-200 text-amber-500" : "bg-white border-slate-200 text-slate-400"
                                  }`}>
                                    <Icon size={16} />
                                  </span>
                                  <span>{category.name.replace(" Services", "")}</span>
                                </div>
                                <ChevronRight size={14} className={`transition-transform duration-200 text-slate-300 ${isActive ? "translate-x-0.5 text-amber-500" : ""}`} />
                              </button>
                            );
                          })}
                        </div>

                        {/* Right panel: Active Category Services */}
                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                              <span className="text-[15px] font-extrabold text-brand-navy">
                                {hoveredCategory}
                              </span>
                              <span className="text-xs text-slate-400 font-semibold">
                                {selectedCategoryData?.services.length || 0} Services available
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                              {selectedCategoryData?.services.map((service) => (
                                <button
                                  key={service.name}
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setIsDropdownOpen(false);
                                    if (onBook) {
                                      onBook({
                                        location: "",
                                        service: {
                                          name: service.name,
                                          category: hoveredCategory,
                                          basePrice: service.basePrice,
                                          duration: service.duration,
                                        },
                                      });
                                    }
                                  }}
                                  className="flex flex-col p-3 rounded-xl border border-slate-100 hover:border-amber-300 hover:bg-amber-50/10 text-left transition bg-slate-50/30 group"
                                >
                                  <span className="text-[13px] font-bold text-slate-800 group-hover:text-brand-navy">
                                    {service.name}
                                  </span>
                                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400 font-medium">
                                    <span className="text-slate-600 font-bold">From ${service.basePrice}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><Clock size={10} /> {service.duration}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-xs mt-4">
                            <span className="text-slate-500 font-medium">
                              Select a service to start booking.
                            </span>
                            <a
                              href="#all-services"
                              onClick={() => setIsDropdownOpen(false)}
                              className="text-xs font-bold text-brand-navy hover:text-[#ffb800] inline-flex items-center gap-1 transition-colors"
                            >
                              View All Services <span aria-hidden="true">&rarr;</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <a
                  href={link.href}
                  className="relative transition hover:text-[#ffb800] group flex items-center gap-1"
                >
                  {link.label}

                  {link.label === "Home" && (
                    <span className="absolute -bottom-[22px] left-0 h-[3px] w-full bg-[#ffb800]" />
                  )}
                </a>
      </React.Fragment>
    ))}
</nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <Phone size={18} className="fill-current" />
            </span>
            <div className="leading-tight">
              <div className="text-[15px] font-bold text-brand-navy">(833) 349-4399</div>
              <div className="text-[11px] font-medium text-slate-500">Available 24/7</div>
            </div>
          </div>
          <a
            href="/auth/login"
            className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-[15px] font-semibold text-brand-navy transition hover:border-slate-300"
          >
            Login
          </a>
          <a
            href="/auth/register"
            className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-[15px] font-semibold text-brand-navy transition hover:border-slate-300 hover:bg-slate-50"
          >
            Sign Up
          </a>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (onBook) {
                onBook({
                  location: "",
                  service: { name: "General Service", category: "General", basePrice: 0, duration: "1 hr" }
                });
              }
            }}
            className="rounded-lg bg-[#ffb800] px-6 py-2.5 text-[15px] font-bold text-brand-navy shadow-sm transition hover:bg-[#e6a600]"
          >
            Book Now
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="lg:hidden inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-600"
          aria-label="Toggle navigation"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="lg:hidden border-t border-slate-100 bg-white"
        >
          <div className="mx-auto w-full px-4 py-4 flex flex-col gap-4 text-sm font-semibold text-brand-navy">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <Phone size={18} className="fill-current" />
                </span>
                <div className="leading-tight">
                  <div className="font-bold text-brand-navy">(833) 349-4399</div>
                  <div className="text-xs text-slate-500">Available 24/7</div>
                </div>
              </div>
              <a
                href="/auth/login"
                className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-center font-semibold text-brand-navy"
              >
                Login
              </a>
              <a
                href="/auth/register"
                className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-center font-semibold text-brand-navy hover:bg-slate-50"
              >
                Sign Up
              </a>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  if (onBook) {
                    onBook({
                      location: "",
                      service: { name: "General Service", category: "General", basePrice: 0, duration: "1 hr" }
                    });
                  }
                }}
                className="w-full rounded-lg bg-[#ffb800] px-5 py-3 text-center font-bold text-brand-navy"
              >
                Book Now
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
