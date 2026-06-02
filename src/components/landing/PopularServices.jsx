import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Wrench,
  Lightbulb,
  Hammer,
  Paintbrush,
  Columns,
  DoorOpen,
  Wind,
  Building,
  ArrowRight,
  ArrowLeft,
  Droplet,
  Sparkles,
  Plug,
  Leaf,
  Wifi,
  Truck,
  Monitor,
  Zap,
  Lock
} from "lucide-react";

const getCategoryIcon = (categoryName) => {
  if (categoryName.includes('Home Repair')) return Wrench;
  if (categoryName.includes('Electrical')) return Lightbulb;
  if (categoryName.includes('Plumbing')) return Droplet;
  if (categoryName.includes('Painting')) return Paintbrush;
  if (categoryName.includes('Carpentry')) return Hammer;
  if (categoryName.includes('Cleaning')) return Sparkles;
  if (categoryName.includes('Appliance')) return Plug;
  if (categoryName.includes('Outdoor')) return Leaf;
  if (categoryName.includes('Smart Home')) return Wifi;
  if (categoryName.includes('Moving')) return Truck;
  return Building;
};

const featuredServices = [
  { label: "AC Service &\nRepair", icon: Wind, serviceName: "AC Service & Repair" },
  { label: "Deep Home\nCleaning", icon: Sparkles, serviceName: "Deep Home Cleaning" },
  { label: "Pipe Leakage\nRepair", icon: Droplet, serviceName: "Pipe Leakage Repair" },
  { label: "Wiring\nRepair", icon: Zap, serviceName: "Wiring Repair" },
  { label: "Interior\nPainting", icon: Paintbrush, serviceName: "Interior Painting" },
  { label: "TV Wall\nMounting", icon: Monitor, serviceName: "TV Wall Mounting" },
  { label: "Furniture\nAssembly", icon: Hammer, serviceName: "Furniture Assembly" },
  { label: "Smart Lock\nInstallation", icon: Lock, serviceName: "Smart Lock Installation" },
];

const PopularServices = ({ onBook, catalog }) => {
  const [showAllServices, setShowAllServices] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const serviceLookup = new Map();
  if (catalog) {
    catalog.forEach((cat) => {
      cat.services.forEach((s) => {
        serviceLookup.set(s.name, { ...s, category: cat.name });
      });
    });
  }

  const handleBook = (name) => {
    const details = serviceLookup.get(name);
    setShowAllServices(false);
    if (onBook) {
      if (details) {
        onBook({
          location: "",
          service: {
            name: details.name,
            category: details.category,
            basePrice: details.basePrice,
            duration: details.duration,
          },
        });
      } else {
        onBook({
          location: "",
          service: {
            name: name,
            category: "General",
            basePrice: 0,
            duration: "Varies",
          },
        });
      }
    }
  };

  return (
    <section id="services" className="bg-white py-16">
      <div className="mx-auto w-full max-w-none px-6 md:px-10 lg:px-14">
        <h2 className="text-center text-4xl font-extrabold text-brand-navy">
          Our Most Popular Services
        </h2>

        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 lg:gap-6">
          {featuredServices.map((service) => {
            return (
              <motion.button
                key={service.label}
                whileHover={{ y: -4 }}
                className="flex flex-col items-center justify-center rounded-2xl bg-white px-4 py-10 min-h-[120px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] border border-slate-100"
                onClick={() => handleBook(service.serviceName)}
              >
                <service.icon size={42} strokeWidth={1} className="text-brand-navy mb-4" />
                <span className="text-[15px] font-bold text-brand-navy leading-tight whitespace-pre-line">
                  {service.label}
                </span>
              </motion.button>
            );
          })}

          <motion.button
            whileHover={{ y: -4 }}
            type="button"
            onClick={() => {
              setShowAllServices((prev) => !prev);
              setSelectedCategory(null);
            }}
            className="flex flex-col items-center justify-center rounded-2xl bg-white px-4 py-10 min-h-[120px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] border border-slate-100"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ffb800] text-brand-navy mb-3">
              <ArrowRight size={24} className="stroke-[2.5px]" />
            </span>
            <span className="text-[15px] font-bold text-brand-navy leading-tight">
              {showAllServices ? "Hide" : "View All"}
              <br />Services
            </span>
          </motion.button>
        </div>

        {showAllServices && (
          <div id="all-services" className="mt-12 bg-slate-50/50 rounded-3xl border border-slate-200/60 p-6 md:p-10 shadow-inner">
            
            {/* Quick Category Anchors */}
            <div className="sticky top-0 bg-white/90 backdrop-blur-md z-10 py-4 border-b border-slate-100 flex gap-3 overflow-x-auto scrollbar-none shadow-sm -mx-6 md:-mx-10 px-6 md:px-10 mb-8 rounded-t-3xl">
              {catalog?.map((category) => {
                const Icon = getCategoryIcon(category.name);
                const isSelected = selectedCategory === category.name;
                return (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(category.name);
                      const element = document.getElementById(`landing-category-${category.name.replace(/[^a-zA-Z0-9]/g, '-')}`);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    className={`flex items-center gap-2 whitespace-nowrap px-5 py-2.5 rounded-full text-[13px] font-bold transition-all ${
                      isSelected
                        ? "bg-[#ffb800] text-brand-navy shadow-sm"
                        : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200"
                    }`}
                  >
                    <Icon size={16} />
                    {category.name.replace(" Services", "")}
                  </button>
                );
              })}
            </div>

            {/* List of categories with their service grid */}
            <div className="flex flex-col gap-12">
              {catalog?.map((category) => {
                const Icon = getCategoryIcon(category.name);
                return (
                  <div 
                    key={category.name}
                    id={`landing-category-${category.name.replace(/[^a-zA-Z0-9]/g, '-')}`}
                    className="scroll-mt-28"
                  >
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-3">
                      <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 shadow-sm">
                        <Icon className="text-amber-500" size={22} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-brand-navy leading-tight">
                          {category.name}
                        </h4>
                        <p className="text-[12px] text-slate-500 mt-0.5">
                          Professional solutions for {category.name.replace(" Services", "").toLowerCase()}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {category.services.map((service) => (
                        <button
                          key={service.name}
                          onClick={() => handleBook(service.name)}
                          className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-[#ffb800] hover:shadow-sm transition bg-white hover:bg-[#fffdf8] group text-left w-full"
                        >
                          <div className="h-9 w-9 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-amber-50 group-hover:border-amber-200 shrink-0 transition-colors">
                            {React.createElement(getCategoryIcon(category.name), { size: 16, className: "text-amber-500 group-hover:text-amber-600" })}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-slate-800 text-[13px] leading-tight truncate group-hover:text-brand-navy transition-colors">
                              {service.name}
                            </h5>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              From <span className="font-bold text-slate-700">${service.basePrice}</span> • {service.duration}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularServices;
