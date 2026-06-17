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
  Lock,
  Search,
  X
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
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategory = (catName) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };
  
  const serviceLookup = new Map();
  if (catalog) {
    catalog.forEach((cat) => {
      cat.services.forEach((s) => {
        serviceLookup.set(s.name, { ...s, category: cat.name });
      });
    });
  }

  const allServices = React.useMemo(() => {
    const list = [];
    if (catalog) {
      catalog.forEach((cat) => {
        cat.services.forEach((s) => {
          list.push({ ...s, category: cat.name });
        });
      });
    }
    return list;
  }, [catalog]);

  const filteredServices = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return allServices.filter((s) => s.name.toLowerCase().includes(query));
  }, [allServices, searchQuery]);

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
        
        {/* Real-time Search Box */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-[600px]">
            <input
              type="text"
              placeholder="Search for a service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3.5 pl-12 rounded-2xl border border-slate-200 focus:border-[#ffb800] focus:ring-2 focus:ring-orange-100 outline-none text-[15px] font-medium transition shadow-sm text-slate-800"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <h2 className="text-center text-4xl font-extrabold text-brand-navy">
          Book a Service Online
        </h2>

        {searchQuery.trim() !== "" ? (
          filteredServices.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-semibold text-lg">
              No services found
            </div>
          ) : (
            <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-6 justify-center">
              {filteredServices.map((service) => {
                const featured = featuredServices.find((f) => f.serviceName === service.name);
                const Icon = featured ? featured.icon : getCategoryIcon(service.category);
                return (
                  <motion.button
                    key={service.name}
                    whileHover={{ y: -4 }}
                    className="flex flex-col items-center justify-center rounded-2xl bg-white px-4 py-8 min-h-[120px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] border border-slate-100"
                    onClick={() => {
                      handleBook(service.name);
                      setSearchQuery("");
                    }}
                  >
                    <Icon size={36} strokeWidth={1.5} className="text-brand-navy mb-3" />
                    <span className="text-[14px] font-bold text-brand-navy leading-tight text-center">
                      {service.name}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1.5 font-semibold">
                      From ${service.basePrice}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          )
        ) : (
          <div className="mt-14 flex overflow-x-auto gap-5 md:gap-6 pb-4 scrollbar-none justify-start">
            {featuredServices.map((service) => {
              return (
                <motion.button
                  key={service.label}
                  whileHover={{ y: -4 }}
                  className="flex flex-col items-center justify-center rounded-2xl bg-white px-4 py-8 min-h-[120px] w-[140px] md:w-[155px] shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] border border-slate-100"
                  onClick={() => handleBook(service.serviceName)}
                >
                  <service.icon size={42} strokeWidth={1} className="text-brand-navy mb-4" />
                  <span className="text-[14px] font-bold text-brand-navy leading-tight whitespace-pre-line text-center">
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
              className="flex flex-col items-center justify-center rounded-2xl bg-white px-4 py-8 min-h-[120px] w-[140px] md:w-[155px] shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] border border-slate-100"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ffb800] text-brand-navy mb-3">
                <ArrowRight size={24} className="stroke-[2.5px]" />
              </span>
              <span className="text-[14px] font-bold text-brand-navy leading-tight text-center">
                {showAllServices ? "Hide" : "View All"}
                <br />Services
              </span>
            </motion.button>
          </div>
        )}

        {showAllServices && (
          <div id="all-services" className="mt-12 bg-slate-50/50 rounded-3xl border border-slate-200/60 p-6 md:p-10 shadow-inner">
            {/* List of categories with their service grid */}
            <div className="flex flex-col gap-4">
              {catalog?.map((category) => {
                const Icon = getCategoryIcon(category.name);
                const isExpanded = !!expandedCategories[category.name];
                return (
                  <div 
                    key={category.name}
                    id={`landing-category-${category.name.replace(/[^a-zA-Z0-9]/g, '-')}`}
                    className={`scroll-mt-28 border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 ${isExpanded ? 'bg-slate-50/50 shadow-sm' : 'bg-white hover:bg-slate-50/30'}`}
                  >
                    {/* Collapsible Header */}
                    <button
                      type="button"
                      onClick={() => toggleCategory(category.name)}
                      className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 shadow-sm shrink-0">
                          <Icon className="text-amber-500" size={24} />
                        </div>
                        <div>
                          <h4 className="text-[17px] font-bold text-brand-navy leading-tight">
                            {category.name}
                          </h4>
                          <p className="text-[12px] text-slate-500 mt-1">
                            Professional solutions for {category.name.replace(" Services", "").toLowerCase()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                          {category.services.length} Services
                        </span>
                        <div className={`text-brand-navy transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                      </div>
                    </button>

                    {/* Expandable Body */}
                    {isExpanded && (
                      <div className="p-6 pt-0 border-t border-slate-100 bg-white">
                        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-6">
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
                    )}
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
