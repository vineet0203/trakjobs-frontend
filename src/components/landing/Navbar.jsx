import React, { useState } from "react";
import { Hammer, Menu, Phone, X, PenTool } from "lucide-react";
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

const Navbar = ({ onBook }) => {
  const [open, setOpen] = useState(false);

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
          <div className="relative group">
            <a
              href="#services"
              className="relative transition hover:text-[#ffb800] flex items-center gap-1"
            >
              Services
              <svg
                className="w-3 h-3 text-slate-400 group-hover:text-[#ffb800]"
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

            <div className="invisible absolute left-1/2 -translate-x-[35%] top-full z-50 mt-4 w-[900px] max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-hover:mt-2">
              <div className="p-6 grid grid-cols-3 gap-x-8 gap-y-6">
                {serviceCatalog.map((category) => (
                  <div key={category.name}>
                    <p className="text-sm font-bold text-brand-navy border-b border-slate-100 pb-2 mb-3">
                      {category.name}
                    </p>

                    <ul className="space-y-1">
                      {category.services.map((service) => (
                        <li key={service.name}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              if (onBook) {
                                onBook({
                                  location: "",
                                  service: {
                                    name: service.name,
                                    category: category.name,
                                    basePrice: service.basePrice,
                                    duration: service.duration,
                                  },
                                });
                              }
                            }}
                            className="w-full text-left text-[13px] font-medium text-slate-600 hover:text-[#ffb800] hover:bg-orange-50/50 hover:pl-3 rounded-md px-2 py-1.5 transition-all duration-200"
                          >
                            {service.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 bg-slate-50/80 px-8 py-4 rounded-b-2xl flex justify-between items-center">
                <span className="text-xs font-medium text-slate-500">
                  Over 50+ services available to book instantly.
                </span>
                <a
                  href="#all-services"
                  className="text-sm font-bold text-brand-navy hover:text-[#ffb800] inline-flex items-center gap-1 transition-colors"
                >
                  View All Services <span aria-hidden="true">&rarr;</span>
                </a>
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
