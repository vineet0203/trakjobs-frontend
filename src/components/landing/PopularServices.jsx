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
  ArrowRight
} from "lucide-react";

const featuredServices = [
  { label: "Plumbing", icon: Wrench, serviceName: "Plumbing Inspection" },
  { label: "Electrical", icon: Lightbulb, serviceName: "Electrical Wiring" },
  { label: "Carpentry", icon: Hammer, serviceName: "Carpentry Work" },
  { label: "Painting", icon: Paintbrush, serviceName: "Interior Painting" },
  { label: "Flooring", icon: Columns, serviceName: "Laminate Flooring" },
  { label: "Door & Window \n Repair", icon: DoorOpen, serviceName: "Hardware Repair" },
  { label: "HVAC", icon: Wind, serviceName: "AC Maintenance" },
  { label: "Commercial \n Maintenance", icon: Building, serviceName: "Commercial Cleaning" },
];

const PopularServices = ({ onBook, catalog }) => {
  const [showAllServices, setShowAllServices] = useState(false);
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
    if (details && onBook) {
      onBook({
        location: "",
        service: {
          name: details.name,
          category: details.category,
          basePrice: details.basePrice,
          duration: details.duration,
        },
      });
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
            const details = serviceLookup.get(service.serviceName);
            return (
              <motion.button
                key={service.label}
                whileHover={{ y: -4 }}
                className="flex flex-col items-center justify-center rounded-2xl bg-white px-4 py-10 min-h-[120px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] border border-slate-100"
                onClick={() => handleBook(service.serviceName)}
                disabled={!details}
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
            onClick={() => setShowAllServices((prev) => !prev)}
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
          <div id="all-services" className="mt-16 rounded-3xl border border-slate-200 bg-[#1f2937] px-8 py-10 text-white">
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {catalog?.map((category) => (
                <div key={category.name}>
                  <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                  <ul className="mt-3 space-y-1.5 text-sm text-slate-200">
                    {category.services.map((service) => (
                      <li key={service.name}>• {service.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularServices;
