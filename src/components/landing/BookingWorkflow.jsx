import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Calendar,
  CheckCircle2,
  Clock,
  CloudUpload,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Flame,
  Zap,
  Droplet,
  Hammer,
  Paintbrush,
  Wrench,
  MoreHorizontal,
  Monitor,
  Phone,
  ChevronDown,
  X,
  Lock,
  ArrowRight,
  DoorOpen,
  AppWindow,
  Frame,
  Grid,
  ArrowUp,
  Sofa,
  Blinds,
  Layers,
  Tv,
  Lightbulb,
  Fan,
  Plug,
  Cable,
  Bell,
  Cctv,
  BatteryCharging,
  Droplets,
  Bath,
  UtensilsCrossed,
  Cylinder,
  ShowerHead,
  PaintBucket,
  Brush,
  Sparkles,
  Image as ImageIcon,
  Umbrella,
  Box,
  DoorClosed,
  Bed,
  Library,
  ChefHat,
  Utensils,
  AirVent,
  Refrigerator,
  WashingMachine,
  Microwave,
  Thermometer,
  Wind,
  TreePine,
  Scissors,
  Waves,
  Sun,
  Wifi,
  Key,
  Camera,
  Cpu,
  Package,
  Truck,
  Dumbbell,
  Briefcase,
  SprayCan
} from "lucide-react";
import { SERVICE_CATEGORIES } from "../../features/clients/constants/clientConstants";

const steps = [
  { id: 1, name: "Select Location" },
  { id: 2, name: "Select Service" },
  { id: 3, name: "Service Details" },
  { id: 4, name: "Review & Book" },
];

const categoryIcons = {
  "Home Repair Services": Hammer,
  "Electrical Services": Zap,
  "Plumbing Services": Droplet,
  "Painting & Wall Services": Paintbrush,
  "Carpentry Services": Hammer,
  "Cleaning Services": Droplet,
  "Appliance Services": Wrench,
  "Outdoor Services": MoreHorizontal,
  "Smart Home & Installation": Monitor,
  "Moving & Support Services": MoreHorizontal,
};

const serviceIcons = {
  // Home Repair
  "Door Repair & Installation": DoorOpen,
  "Window Repair": AppWindow,
  "Drywall Repair": Frame,
  "Wall Patching": Grid,
  "Ceiling Repair": ArrowUp,
  "Furniture Assembly": Sofa,
  "Curtain & Blind Installation": Blinds,
  "Lock Replacement": Lock,
  "Shelf Installation": Layers,
  "TV Wall Mounting": Tv,
  // Electrical
  "Light Installation": Lightbulb,
  "Fan Installation": Fan,
  "Switch & Socket Repair": Plug,
  "Wiring Repair": Cable,
  "Doorbell Installation": Bell,
  "CCTV Installation": Cctv,
  "Power Backup Setup": BatteryCharging,
  // Plumbing
  "Tap Repair": Droplets,
  "Pipe Leakage Repair": Droplet,
  "Toilet Repair": Bath,
  "Sink Installation": UtensilsCrossed,
  "Water Tank Cleaning": Cylinder,
  "Bathroom Fitting Installation": Bath,
  "Shower Repair": ShowerHead,
  // Painting & Wall
  "Interior Painting": PaintBucket,
  "Exterior Painting": Brush,
  "Texture Painting": Sparkles,
  "Wallpaper Installation": ImageIcon,
  "Wall Cleaning": SprayCan,
  "Waterproofing": Umbrella,
  // Carpentry
  "Modular Furniture Work": Sofa,
  "Cabinet Repair": Box,
  "Wooden Door Repair": DoorClosed,
  "Bed Repair": Bed,
  "Custom Shelves": Library,
  "Kitchen Cabinet Installation": ChefHat,
  // Cleaning
  "Deep Home Cleaning": Sparkles,
  "Sofa Cleaning": Sofa,
  "Carpet Cleaning": Sparkles,
  "Kitchen Cleaning": Utensils,
  "Bathroom Cleaning": Bath,
  // Appliance
  "AC Service & Repair": AirVent,
  "Refrigerator Repair": Refrigerator,
  "Washing Machine Repair": WashingMachine,
  "Microwave Repair": Microwave,
  "Geyser Installation": Thermometer,
  "Chimney Cleaning": Wind,
  // Outdoor
  "Garden Maintenance": TreePine,
  "Grass Cutting": Scissors,
  "Fence Repair": Grid,
  "Pressure Washing": Waves,
  "Outdoor Lighting": Sun,
  // Smart Home
  "WiFi Setup": Wifi,
  "Smart Lock Installation": Key,
  "Smart Camera Setup": Camera,
  "Home Automation Setup": Cpu,
  // Moving
  "Packing & Unpacking": Package,
  "Local Shifting Help": Truck,
  "Heavy Item Moving": Dumbbell,
  "Office Setup Assistance": Briefcase,
};

const BookingWorkflow = ({ catalog, initialSelection }) => {
  // Always treating this as step 2 (Select Service) / 3 (Service Details) combined view for now
  // We'll advance to step 4 when "Review & Book" is clicked, but the core request
  // is to build the specific "Select Service/Details" dashboard layout.
  const [activeStep, setActiveStep] = useState(2); 

  const initialCategory = useMemo(() => {
    return catalog.find((category) => category.name === initialSelection?.category)?.name ||
      catalog[0]?.name;
  }, [catalog, initialSelection?.category]);

  const initialService = useMemo(() => {
    const category = catalog.find((item) => item.name === initialCategory) || catalog[0];
    const match = category?.services.find((service) => service.name === initialSelection?.name);
    return match?.name || null; // Start with nothing selected if no direct match, to show the "No service selected" state
  }, [catalog, initialCategory, initialSelection?.name]);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedService, setSelectedService] = useState(initialService);
  const [quantity, setQuantity] = useState(1);
  const [expandedCategories, setExpandedCategories] = useState({});
  
  const toggleCategory = (catName) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };
  const [notes, setNotes] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [files, setFiles] = useState([]);
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [dynamicSubCategories, setDynamicSubCategories] = useState([]);

  useEffect(() => {
    const loadDynamicMapping = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
        const [catRes, subRes] = await Promise.all([
          axios.get(`${apiBaseUrl}/api/v1/public/service-categories`),
          axios.get(`${apiBaseUrl}/api/v1/service-sub-categories`),
        ]);
        if (catRes.data && catRes.data.success) {
          setDynamicCategories(catRes.data.data);
        }
        if (subRes.data && subRes.data.success) {
          setDynamicSubCategories(subRes.data.data);
        }
      } catch (err) {
        console.warn("Failed to fetch dynamic mappings in BookingWorkflow:", err);
      }
    };
    loadDynamicMapping();
  }, []);

  // Step 4 state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: initialSelection?.location || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [matchedProviders, setMatchedProviders] = useState(0);
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  const [matchingVendors, setMatchingVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(false);

  useEffect(() => {
    if (!selectedCategory || !selectedService) {
      setMatchingVendors([]);
      setSelectedVendors([]);
      return;
    }

    const fetchMatchingVendors = async () => {
      setLoadingVendors(true);
      try {
        let matchedCategory = dynamicCategories.find(
          c => c.name === selectedCategory || c.name === selectedCategory + " Services"
        )?.slug;

        if (!matchedCategory) {
          matchedCategory = Object.keys(SERVICE_CATEGORIES).find(key => 
            SERVICE_CATEGORIES[key].label === selectedCategory || SERVICE_CATEGORIES[key].label === selectedCategory + " Services"
          ) || 'home_repair';
        }

        const catObj = dynamicCategories.find(c => c.slug === matchedCategory);
        let matchedSubCategory = null;
        if (catObj) {
          matchedSubCategory = dynamicSubCategories.find(
            sub => sub.service_category_id === catObj.id && sub.name === selectedService
          )?.slug;
        }

        if (!matchedSubCategory) {
          matchedSubCategory = SERVICE_CATEGORIES[matchedCategory]?.subcategories.find(
            sub => sub.label === selectedService
          )?.value || selectedService.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_');
        }

        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/public/vendors`, {
          params: {
            service_category: matchedCategory,
            service_sub_category: matchedSubCategory
          }
        });

        const vendors = response.data?.data || [];
        setMatchingVendors(vendors);
        setSelectedVendors(vendors.map(v => v.id));
      } catch (err) {
        console.error("Failed to fetch matching vendors:", err);
      } finally {
        setLoadingVendors(false);
      }
    };

    fetchMatchingVendors();
  }, [selectedCategory, selectedService]);

  const categoryData = useMemo(() => {
    return catalog.find((category) => category.name === selectedCategory) || catalog[0];
  }, [catalog, selectedCategory]);

  const serviceData = useMemo(() => {
    if (!selectedService) return null;
    return categoryData?.services.find((service) => service.name === selectedService) || null;
  }, [categoryData, selectedService]);

  useEffect(() => {
    setSelectedCategory(initialCategory);
    setSelectedService(initialService);
  }, [initialCategory, initialService]);

  const basePrice = serviceData ? serviceData.basePrice : 0;
  const serviceFee = serviceData ? 10 : 0;
  const subtotal = basePrice * quantity;
  const total = subtotal + serviceFee;

  const handleServiceSelect = (serviceName) => {
    setSelectedService(serviceName === selectedService ? null : serviceName);
    setQuantity(1); // Reset quantity on new selection
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  // Mock specific styling for "Popular Services" logic
  const isPopular = selectedCategory === "Home Repair Services";

  return (
    <section className="bg-[#FAFAFA] py-16 font-sans text-slate-800">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Progress Bar */}
        <div className="mb-10 w-full">
          <div className="flex items-center justify-between relative">
            {/* Connecting lines */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-slate-200 z-0"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-brand-navy z-0 transition-all duration-300"
              style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>

            {steps.map((step, index) => {
              const isCompleted = step.id < activeStep;
              const isCurrent = step.id === activeStep;
              
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center bg-[#FAFAFA] px-2">
                  <div 
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                      isCurrent
                        ? "bg-amber-400 text-brand-navy shadow-md ring-4 ring-white"
                        : isCompleted
                        ? "bg-brand-navy text-white ring-4 ring-white"
                        : "bg-white border-2 border-slate-200 text-slate-400"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={20} /> : step.id}
                  </div>
                  <span className={`mt-3 text-[13px] font-semibold ${isCurrent ? 'text-brand-navy' : 'text-slate-500'}`}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          
          {/* LEFT COLUMN: Redesigned Service Catalog (Upfront Grid grouped by category) */}
          <div className="flex flex-col gap-8 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">

            {/* List of categories with their service grid */}
            <div className="flex flex-col gap-4">
              {catalog.map((category) => {
                const CatIcon = categoryIcons[category.name] || MoreHorizontal;
                const isExpanded = !!expandedCategories[category.name];
                
                return (
                  <div 
                    key={category.name} 
                    id={`category-${category.name.replace(/[^a-zA-Z0-9]/g, '-')}`}
                    className={`scroll-mt-24 border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 ${isExpanded ? 'bg-slate-50/50 shadow-sm' : 'bg-white hover:bg-slate-50/30'}`}
                  >
                    {/* Collapsible Header */}
                    <button
                      type="button"
                      onClick={() => toggleCategory(category.name)}
                      className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 shadow-sm shrink-0">
                          <CatIcon className="text-amber-500" size={22} />
                        </div>
                        <div>
                          <h3 className="text-[17px] font-bold text-slate-800 leading-tight">
                            {category.name}
                          </h3>
                          <p className="text-[12px] text-slate-500 mt-1">
                            Professional solutions for {category.name.replace(" Services", "").toLowerCase()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                          {category.services.length} Services
                        </span>
                        <div className={`text-slate-800 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                      </div>
                    </button>

                    {/* Expandable Body */}
                    {isExpanded && (
                      <div className="p-6 pt-0 border-t border-slate-100 bg-white">
                        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6">
                          {category.services.map((service) => {
                            const isSelected = selectedService === service.name;
                            const SvcIcon = serviceIcons[service.name] || CatIcon;
                            return (
                              <div
                                key={service.name}
                                onClick={() => {
                                  setSelectedCategory(category.name);
                                  setSelectedService(service.name === selectedService ? null : service.name);
                                  setQuantity(1);
                                  setTimeout(() => {
                                    const detailsElement = document.getElementById("booking-details-section");
                                    if (detailsElement) {
                                      detailsElement.scrollIntoView({ behavior: "smooth", block: "start" });
                                    }
                                  }, 150);
                                }}
                                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 group text-left ${
                                  isSelected
                                    ? "border-amber-400 bg-amber-50/20 shadow-sm ring-1 ring-amber-400"
                                    : "border-slate-200 hover:border-slate-300 hover:shadow-sm bg-slate-50/30 hover:bg-white"
                                }`}
                              >
                                <div className={`h-9 w-9 rounded-lg flex items-center justify-center border shrink-0 transition-all ${
                                  isSelected ? "bg-amber-100 border-amber-300 shadow-sm text-amber-600" : "bg-white border-slate-200 text-blue-500"
                                }`}>
                                  <SvcIcon size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className={`font-semibold text-[13px] leading-tight truncate transition-colors ${
                                    isSelected ? "text-brand-navy" : "text-slate-800 group-hover:text-amber-500"
                                  }`}>
                                    {service.name}
                                  </h5>
                                  <p className="text-[11px] text-slate-500 mt-0.5">
                                    From <span className="font-bold text-slate-700">${service.basePrice}</span> • {service.duration}
                                  </p>
                                </div>
                                <div className={`flex h-4 w-4 items-center justify-center rounded-full border shrink-0 transition-colors ${
                                  isSelected ? "bg-[#ffb800] border-transparent text-slate-900" : "border-slate-300 bg-white"
                                }`}>
                                  {isSelected && <CheckCircle2 size={10} className="stroke-[2.5]" />}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Selection & Help */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-[320px] flex flex-col sticky top-24">
              <h3 className="text-[15px] font-bold text-slate-800 mb-6">Your Selection</h3>
              
              {!serviceData ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="h-20 w-20 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                    <CheckCircle2 size={32} className="text-slate-300" />
                  </div>
                  <h4 className="text-[15px] font-bold text-slate-700">No service selected yet</h4>
                  <p className="text-[13px] text-slate-500 mt-2 max-w-[200px]">Please select a service from the list to continue.</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                   <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
                      <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                         {serviceIcons[serviceData.name] ? React.createElement(serviceIcons[serviceData.name], {size: 24, className: "text-blue-500"}) : (categoryIcons[selectedCategory] ? React.createElement(categoryIcons[selectedCategory], {size: 24, className: "text-blue-500"}) : <Monitor size={24} className="text-blue-500" />)}
                      </div>
                      <div>
                        <h4 className="text-[14px] font-bold text-slate-800 leading-tight">{serviceData.name}</h4>
                        <p className="text-[12px] text-slate-500 mt-1">${serviceData.basePrice}</p>
                      </div>
                   </div>
                   <div className="mt-auto">
                     <p className="text-[12px] text-slate-500 text-center">Ready to proceed to details below.</p>
                   </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sticky top-[420px]">
              <h3 className="text-[15px] font-bold text-slate-800 mb-2">Need help?</h3>
              <p className="text-[13px] text-slate-500 mb-5">Our support team is ready to assist you.</p>
              <a href="tel:+18001234567" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors font-bold text-[14px] text-slate-800">
                <Phone size={16} /> (800) 123-4567
              </a>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: Details, Upload, Pricing (Only fully active if service selected and step is not 4 or success) */}
        <div 
          id="booking-details-section"
          className={`scroll-mt-24 mt-6 grid gap-6 lg:grid-cols-[1.5fr_1.5fr_1fr] transition-opacity duration-300 ${!serviceData ? 'opacity-50 pointer-events-none' : 'opacity-100'} ${(activeStep === 4 || submitSuccess) ? 'hidden' : ''}`}
        >
          
          {/* Service Details Config */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
             <h3 className="text-[15px] font-bold text-slate-800 mb-6">Service Details</h3>
             
             <div className="flex items-center justify-between mb-6">
                <div className="w-2/3">
                  <p className="text-[12px] font-bold text-slate-500 mb-2">Selected Service</p>
                  <div className="flex items-center justify-between border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-white flex items-center justify-center border border-slate-200 shrink-0 shadow-sm">
                        {serviceData && serviceIcons[serviceData.name] ? React.createElement(serviceIcons[serviceData.name], {size: 16, className: "text-blue-500"}) : <Monitor size={14} className="text-slate-600" />}
                      </div>
                      <span className="text-[14px] font-bold text-slate-800">{serviceData?.name || "None"}</span>
                    </div>
                    <span className="text-[14px] font-bold text-green-600">${serviceData?.basePrice || "0"}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-[12px] font-bold text-slate-500 mb-2">Quantity</p>
                  <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden h-[42px]">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 h-full hover:bg-slate-50 text-slate-500 flex items-center justify-center border-r border-slate-200"><Minus size={14} /></button>
                    <div className="w-10 text-center text-[14px] font-bold">{quantity}</div>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-3 h-full hover:bg-slate-50 text-slate-500 flex items-center justify-center border-l border-slate-200"><Plus size={14} /></button>
                  </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-[12px] font-bold text-slate-500 mb-2">Preferred Date</p>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-[14px] text-slate-700 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400" 
                    />
                  </div>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-slate-500 mb-2">Preferred Time</p>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select 
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-[14px] text-slate-700 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 appearance-none bg-white"
                    >
                      <option value="" disabled>Select time</option>
                      <option value="morning">Morning (8 AM - 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                      <option value="evening">Evening (4 PM - 8 PM)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
             </div>

             <div>
                <p className="text-[12px] font-bold text-slate-500 mb-2">Add Notes (Optional)</p>
                <textarea 
                  rows={3}
                  placeholder="Please share any specific instructions or details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 text-[14px] text-slate-700 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 resize-none"
                />
                <div className="text-right mt-1 text-[11px] text-slate-400">{notes.length}/250</div>
             </div>
          </div>

          {/* Upload Pictures */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
             <div className="mb-4">
               <h3 className="text-[15px] font-bold text-slate-800">Upload Pictures (Optional)</h3>
               <p className="text-[13px] text-slate-500 mt-1">Help us understand your requirement better</p>
             </div>
             
             <div className="flex-1 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-100 bg-blue-50/30 p-6 text-center cursor-pointer hover:bg-blue-50/60 transition-colors relative">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={(e) => setFiles(prev => [...prev, ...Array.from(e.target.files)])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 mb-3">
                  <CloudUpload size={24} className="text-blue-600" />
                </div>
                <p className="text-[14px] font-bold text-slate-800"><span className="text-blue-600">Click to upload</span> or drag & drop</p>
                <p className="text-[12px] text-slate-500 mt-1">PNG, JPG, JPEG up to 5MB each</p>
             </div>

             {files.length > 0 && (
               <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                 {files.map((file, i) => (
                   <div key={i} className="relative h-20 w-20 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                     <img src={URL.createObjectURL(file)} alt={`upload-${i}`} className="w-full h-full object-cover" />
                     <button 
                       onClick={() => removeFile(i)}
                       className="absolute top-1 right-1 h-5 w-5 rounded-full bg-white shadow flex items-center justify-center hover:bg-slate-100"
                     >
                       <X size={12} className="text-slate-600" />
                     </button>
                   </div>
                 ))}
               </div>
             )}
          </div>

          {/* Price Summary */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
            <h3 className="text-[15px] font-bold text-slate-800 mb-6">Price Summary</h3>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[14px] font-bold text-slate-800">{serviceData?.name || "No Service"}</p>
                  <p className="text-[13px] text-slate-500 mt-1">Quantity</p>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-bold text-slate-800">${basePrice.toFixed(2)}</p>
                  <p className="text-[13px] text-slate-500 mt-1">x{quantity}</p>
                </div>
              </div>
              
              <div className="my-4 border-t border-slate-100"></div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[14px]">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-bold text-slate-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-slate-600 flex items-center gap-1">Service Fee <div className="h-3 w-3 rounded-full border border-slate-300 text-[9px] flex items-center justify-center text-slate-400">i</div></span>
                  <span className="font-bold text-slate-800">${serviceFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="my-4 border-t border-slate-200 border-dashed"></div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-[16px] font-bold text-slate-800">Total</span>
                <span className="text-[20px] font-black text-green-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-[15px] transition-transform active:scale-[0.98] ${
                serviceData 
                  ? "bg-amber-400 hover:bg-amber-500 text-slate-900 shadow-sm" 
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
              disabled={!serviceData}
              onClick={() => setActiveStep(4)}
            >
              Review & Book <ArrowRight size={18} />
            </button>
            <div className="flex items-center justify-center gap-1.5 mt-4 text-[12px] text-slate-500">
              <Lock size={12} /> Secure booking. No hidden charges.
            </div>
          </div>

        </div>

        {/* Step 4: Final Booking Form */}
        {activeStep === 4 && !submitSuccess && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm max-w-3xl mx-auto">
            <h3 className="text-[18px] font-bold text-slate-800 mb-6 text-center">Complete Your Booking</h3>

            {/* Vendor Selection Section */}
            <div className="mb-8 border-b border-slate-100 pb-6">
              <h4 className="text-[15px] font-bold text-slate-800 mb-3">Select Service Providers</h4>
              <p className="text-[13px] text-slate-500 mb-4">Select the vendors you want to receive your quote request (Select 1 to 5):</p>
              
              {loadingVendors ? (
                <div className="text-center py-4 text-slate-500 text-sm">Searching for matching service providers...</div>
              ) : matchingVendors.length === 0 ? (
                <div className="text-center py-4 text-amber-700 bg-amber-50 rounded-xl border border-amber-200 text-sm font-medium px-4">
                  We currently do not have matching service providers in your area for this service. You can still submit your request, and our support/admin team will assign one manually.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {matchingVendors.map((vendor) => {
                    const isSelected = selectedVendors.includes(vendor.id);
                    return (
                      <div 
                        key={vendor.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedVendors(selectedVendors.filter(id => id !== vendor.id));
                          } else {
                            if (selectedVendors.length < 5) {
                              setSelectedVendors([...selectedVendors, vendor.id]);
                            } else {
                              alert('You can select up to 5 vendors.');
                            }
                          }
                        }}
                        className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                          isSelected
                            ? "border-amber-400 bg-amber-50/20 shadow-sm"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <input 
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // handled by parent onClick
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 pointer-events-none"
                        />
                        <div>
                          <h5 className="text-[14px] font-bold text-slate-800">{vendor.business_name}</h5>
                          {vendor.service_description && (
                            <p className="text-[12px] text-slate-500 mt-1 line-clamp-2">{vendor.service_description}</p>
                          )}
                          <p className="text-[11px] text-slate-400 mt-1">{vendor.mobile_number || 'No phone'} • {vendor.email}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-700 outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-700 outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-700 outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Service Address</label>
                <input 
                  type="text" 
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-700 outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                  placeholder="123 Main St, City"
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-8">
              <button 
                type="button"
                onClick={() => setActiveStep(2)}
                className="px-6 py-3 text-slate-500 font-bold hover:text-slate-700"
                disabled={isSubmitting}
              >
                Back
              </button>
              <button 
                onClick={async () => {
                  if (matchingVendors.length > 0 && selectedVendors.length === 0) {
                    alert('Please select at least one vendor.');
                    return;
                  }
                  if (selectedVendors.length > 5) {
                    alert('Please select up to 5 vendors.');
                    return;
                  }
                  if (!formData.name || !formData.email || !formData.phone || !formData.address) {
                    alert('Please fill out all contact details.');
                    return;
                  }
                  if (!startDate || !startTime) {
                    alert('Please select a preferred date and time in the previous step.');
                    return;
                  }
                  
                  setIsSubmitting(true);
                  try {
                    let matchedCategory = dynamicCategories.find(
                      c => c.name === selectedCategory || c.name === selectedCategory + " Services"
                    )?.slug;

                    if (!matchedCategory) {
                      matchedCategory = Object.keys(SERVICE_CATEGORIES).find(key => 
                        SERVICE_CATEGORIES[key].label === selectedCategory || SERVICE_CATEGORIES[key].label === selectedCategory + " Services"
                      ) || 'home_repair';
                    }

                    const catObj = dynamicCategories.find(c => c.slug === matchedCategory);
                    let matchedSubCategory = null;
                    if (catObj) {
                      matchedSubCategory = dynamicSubCategories.find(
                        sub => sub.service_category_id === catObj.id && sub.name === selectedService
                      )?.slug;
                    }

                    if (!matchedSubCategory) {
                      matchedSubCategory = SERVICE_CATEGORIES[matchedCategory]?.subcategories.find(
                        sub => sub.label === selectedService
                      )?.value || selectedService.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_');
                    }

                    const payload = new FormData();
                    payload.append('name', formData.name);
                    payload.append('email', formData.email);
                    payload.append('phone', formData.phone);
                    payload.append('location', formData.address);
                    payload.append('service_category', matchedCategory);
                    payload.append('service_sub_category', matchedSubCategory);
                    if (startDate) payload.append('date', startDate);
                    if (startTime) payload.append('time', startTime);
                    if (notes) payload.append('notes', notes);
                    
                    selectedVendors.forEach((id) => {
                      payload.append('vendor_ids[]', id);
                    });
                    
                    if (serviceData?.name) payload.append('service_name', serviceData.name);
                    if (serviceData?.basePrice) payload.append('unit_price', serviceData.basePrice);
                    payload.append('quantity', quantity);
                    
                    files.forEach((file) => {
                      payload.append('images[]', file);
                    });

                    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/public/bookings`, payload);
                    
                    setMatchedProviders(response.data.data.matched_providers);
                    setIsNewCustomer(response.data.data.is_new_customer);
                    setSubmitSuccess(true);
                  } catch (error) {
                    console.error('Booking failed:', error);
                    alert(error.response?.data?.message || 'Failed to submit booking. Please try again.');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting || (matchingVendors.length > 0 && selectedVendors.length === 0)}
                className="px-8 py-3 bg-brand-navy text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 disabled:opacity-50"
              >
                {isSubmitting ? 'Confirming...' : 'Confirm Booking'} <CheckCircle2 size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Success State */}
        {submitSuccess && (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-10 shadow-sm max-w-2xl mx-auto text-center flex flex-col items-center">
            <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Booking Confirmed!</h2>
            <p className="text-slate-600 text-[15px] mb-6 max-w-md">
              We have successfully received your booking. We found <strong>{matchedProviders}</strong> verified service providers in your area for this service.
            </p>
            <p className="text-slate-500 text-[14px]">
              They have been notified and will send you their quotes shortly.{' '}
              {isNewCustomer
                ? `A password setup link has been sent to ${formData.email}. Please set your password and login to your customer panel to review incoming quotes.`
                : `Please login to your customer panel at customer.trakjobs.com to review incoming quotes.`}
            </p>
          </div>
        )}

      </div>
    </section>
  );
};

export default BookingWorkflow;
