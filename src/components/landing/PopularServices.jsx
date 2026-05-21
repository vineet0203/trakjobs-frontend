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

        {showAllServices && !selectedCategory && (
          <div id="all-services" className="mt-12">
            <h3 className="text-2xl font-bold text-brand-navy text-center mb-8">All Service Categories</h3>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-6">
              {catalog?.map((category) => {
                const Icon = getCategoryIcon(category.name);
                return (
                  <motion.button
                    key={category.name}
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedCategory(category)}
                    className="flex flex-col items-center justify-center rounded-2xl bg-white px-4 py-8 min-h-[140px] shadow-sm transition hover:shadow-md border border-slate-200 hover:border-[#ffb800]"
                  >
                    <Icon size={38} strokeWidth={1.5} className="text-[#ffb800] mb-4" />
                    <span className="text-[15px] font-bold text-brand-navy leading-tight whitespace-pre-line text-center">
                      {category.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {showAllServices && selectedCategory && (
          <div id="all-services" className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
            <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
              <button 
                onClick={() => setSelectedCategory(null)} 
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft size={24} className="text-brand-navy" />
              </button>
              <div>
                <h3 className="text-2xl font-bold text-brand-navy">{selectedCategory.name}</h3>
                <p className="text-sm text-slate-500 mt-1">Select a service to book</p>
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {selectedCategory.services.map((service) => (
                <button
                  key={service.name}
                  onClick={() => handleBook(service.name)}
                  className="flex flex-col text-left p-5 rounded-2xl border border-slate-200 hover:border-[#ffb800] hover:shadow-md transition bg-slate-50 hover:bg-white group"
                >
                  <span className="font-semibold text-brand-navy group-hover:text-[#ffb800] transition-colors">{service.name}</span>
                  <div className="mt-4 flex items-center justify-between w-full text-sm">
                    <span className="font-medium text-slate-700">From ${service.basePrice}</span>
                    <span className="text-slate-500 bg-slate-100 px-2 py-1 rounded text-xs">{service.duration}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularServices;
