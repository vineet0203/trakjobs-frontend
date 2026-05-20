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

const Navbar = () => {
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
            .map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative transition hover:text-[#ffb800] group flex items-center gap-1"
              >
                {link.label}
                {link.label === "Home" && (
                  <span className="absolute -bottom-[22px] left-0 h-[3px] w-full bg-[#ffb800]" />
                )}
              </a>
            ))}

          <div className="relative group">
            <a
              href="#services"
              className="relative transition hover:text-[#ffb800] group flex items-center gap-1"
            >
              Services
              <svg
                className="w-3 h-3 text-slate-400 group-hover:text-[#ffb800]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <div className="invisible absolute left-0 top-full z-50 mt-4 w-[720px] rounded-2xl border border-slate-200 bg-white p-6 shadow-xl opacity-0 transition group-hover:visible group-hover:opacity-100">
              <div className="grid grid-cols-2 gap-6">
                {serviceCatalog.map((category) => (
                  <div key={category.name}>
                    <p className="text-sm font-semibold text-brand-navy">{category.name}</p>
                    <ul className="mt-2 space-y-1 text-xs text-slate-600">
                      {category.services.map((service) => (
                        <li key={service.name}>{service.name}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <a href="#all-services" className="text-sm font-semibold text-brand-navy hover:text-[#ffb800]">
                  View All Services
                </a>
              </div>
            </div>
          </div>
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
            href="#home"
            className="rounded-lg bg-[#ffb800] px-6 py-2.5 text-[15px] font-bold text-brand-navy shadow-sm transition hover:bg-[#e6a600]"
          >
            Book Now
          </a>
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
                href="#home"
                className="rounded-lg bg-[#ffb800] px-5 py-3 text-center font-bold text-brand-navy"
              >
                Book Now
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
