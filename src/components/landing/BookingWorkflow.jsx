import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  CloudUpload,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
} from "lucide-react";

const steps = ["Details", "Review", "Confirmation"];

const BookingWorkflow = ({ catalog, initialSelection }) => {
  const [activeStep, setActiveStep] = useState(0);
  const initialCategory = useMemo(() => {
    return catalog.find((category) => category.name === initialSelection.category)?.name ||
      catalog[0]?.name;
  }, [catalog, initialSelection.category]);

  const initialService = useMemo(() => {
    const category =
      catalog.find((item) => item.name === initialCategory) || catalog[0];
    const match = category?.services.find((service) => service.name === initialSelection.name);
    return match?.name || category?.services[0]?.name;
  }, [catalog, initialCategory, initialSelection.name]);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedService, setSelectedService] = useState(initialService);
  const [quantity, setQuantity] = useState(1);
  const [resources, setResources] = useState(1);
  const [priority, setPriority] = useState("Normal");
  const [notes, setNotes] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [files, setFiles] = useState([]);

  const categoryData = useMemo(() => {
    return catalog.find((category) => category.name === selectedCategory) || catalog[0];
  }, [catalog, selectedCategory]);

  const serviceData = useMemo(() => {
    return (
      categoryData?.services.find((service) => service.name === selectedService) ||
      categoryData?.services[0]
    );
  }, [categoryData, selectedService]);

  useEffect(() => {
    setSelectedCategory(initialCategory);
    setSelectedService(initialService);
  }, [initialCategory, initialService]);

  const basePrice = serviceData.basePrice;
  const resourceCharge = (resources - 1) * 25;
  const serviceFee = 12;
  const tax = (basePrice * quantity + resourceCharge + serviceFee) * 0.08;
  const total = basePrice * quantity + resourceCharge + serviceFee + tax;

  return (
    <section className="bg-slate-50/70">
      <div className="mx-auto w-full max-w-none px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          <div className="flex flex-wrap items-center gap-3">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                    index <= activeStep
                      ? "bg-brand-gold text-brand-navy"
                      : "border border-slate-200 text-slate-400"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="text-xs font-semibold text-slate-500">{step}</span>
                {index < steps.length - 1 && <span className="mx-2 h-px w-6 bg-slate-200" />}
              </div>
            ))}
          </div>

          {activeStep < 2 && (
            <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.4fr_0.9fr]">
              <aside className="rounded-2xl border border-slate-100 bg-white p-4">
                <p className="text-sm font-semibold text-brand-navy">Categories</p>
                <div className="mt-4 space-y-2 text-sm">
                  {catalog.map((category) => (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setSelectedService(category.services[0].name);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left ${
                        selectedCategory === category.name
                          ? "bg-brand-gold/20 text-brand-navy"
                          : "text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </aside>

              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-brand-navy">Services</p>
                    <p className="text-xs text-slate-500">{selectedCategory}</p>
                  </div>
                  <div className="text-xs text-slate-400">
                    Location: {initialSelection.location}
                  </div>
                </div>
                <div className="mt-4 grid gap-3">
                  {categoryData.services.map((service) => (
                    <button
                      key={service.name}
                      type="button"
                      onClick={() => setSelectedService(service.name)}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm ${
                        selectedService === service.name
                          ? "border-brand-gold bg-brand-gold/10 text-brand-navy"
                          : "border-slate-100 text-slate-500"
                      }`}
                    >
                      <span>{service.name}</span>
                      <span className="text-xs text-slate-400">${service.basePrice}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <p className="text-sm font-semibold text-brand-navy">Service Details</p>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>{serviceData.name}</span>
                    <span className="font-semibold text-brand-navy">${serviceData.basePrice}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin size={14} /> Estimated duration: {serviceData.duration}
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <label className="text-xs text-slate-500">
                    Preferred Start Date
                    <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
                      <Calendar size={14} />
                      <input
                        type="date"
                        value={startDate}
                        onChange={(event) => setStartDate(event.target.value)}
                        className="w-full border-none bg-transparent text-sm text-slate-700 outline-none"
                      />
                    </div>
                  </label>
                  <label className="text-xs text-slate-500">
                    Preferred Start Time
                    <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
                      <Clock size={14} />
                      <input
                        type="time"
                        value={startTime}
                        onChange={(event) => setStartTime(event.target.value)}
                        className="w-full border-none bg-transparent text-sm text-slate-700 outline-none"
                      />
                    </div>
                  </label>
                  <label className="text-xs text-slate-500">
                    Preferred End Time
                    <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
                      <Clock size={14} />
                      <input
                        type="time"
                        value={endTime}
                        onChange={(event) => setEndTime(event.target.value)}
                        className="w-full border-none bg-transparent text-sm text-slate-700 outline-none"
                      />
                    </div>
                  </label>
                  <label className="text-xs text-slate-500">
                    Priority
                    <select
                      value={priority}
                      onChange={(event) => setPriority(event.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none"
                    >
                      <option>Normal</option>
                      <option>Urgent</option>
                      <option>Emergency</option>
                    </select>
                  </label>
                  <label className="text-xs text-slate-500">
                    Notes / Description
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <p className="text-sm font-semibold text-brand-navy">Pricing Summary</p>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Base service cost</span>
                    <span>${(basePrice * quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Resource charges</span>
                    <span>${resourceCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Platform/service fee</span>
                    <span>${serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tax/GST</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 font-semibold">
                    <span>Estimated total</span>
                    <span className="text-brand-navy">${total.toFixed(2)}</span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-400">Pricing may vary after inspection.</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <p className="text-sm font-semibold text-brand-navy">Review & Confirm</p>
                <div className="mt-4 text-sm text-slate-600">
                  <p className="font-semibold">{serviceData.name}</p>
                  <p className="text-xs text-slate-500">{selectedCategory}</p>
                  <div className="mt-3 space-y-2 text-xs text-slate-500">
                    <div>Location: {initialSelection.location}</div>
                    <div>Start: {startDate || "-"} at {startTime || "-"}</div>
                    <div>End: {endTime || "-"}</div>
                    <div>Resources: {resources}</div>
                    <div>Priority: {priority}</div>
                  </div>
                  <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
                    {notes || "No notes added."}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="mt-10 flex flex-col items-center gap-4 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold/20 text-brand-navy">
                <CheckCircle2 size={28} />
              </span>
              <h3 className="text-2xl font-display text-brand-navy">Request submitted</h3>
              <p className="max-w-lg text-sm text-slate-600">
                Your request is sent to TrakJobs vendor network. Vendors can review and send a
                quotation shortly.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck size={14} /> Verified vendors are notified.
              </div>
            </div>
          )}

          {activeStep < 2 && (
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <p className="text-sm font-semibold text-brand-navy">Upload Images</p>
                <div className="mt-3 flex items-center justify-center rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-center text-xs text-slate-500">
                  <div>
                    <CloudUpload className="mx-auto" />
                    <p className="mt-2 text-sm font-semibold">Drag & drop images</p>
                    <p className="text-xs text-slate-400">PNG, JPG up to 5MB</p>
                    <label className="mt-3 inline-flex cursor-pointer rounded-full bg-brand-gold px-4 py-2 text-xs font-semibold text-brand-navy">
                      Upload Images
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => setFiles(Array.from(event.target.files || []))}
                      />
                    </label>
                  </div>
                </div>
                {files.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
                    {files.map((file) => (
                      <div key={file.name} className="rounded-xl border border-slate-200 px-3 py-2">
                        {file.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <p className="text-sm font-semibold text-brand-navy">Resources & Quantity</p>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Resources Required</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setResources((prev) => Math.max(1, prev - 1))}
                        className="rounded-full border border-slate-200 p-1"
                      >
                        <Minus size={12} />
                      </button>
                      <span>{resources}</span>
                      <button
                        type="button"
                        onClick={() => setResources((prev) => prev + 1)}
                        className="rounded-full border border-slate-200 p-1"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Quantity</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                        className="rounded-full border border-slate-200 p-1"
                      >
                        <Minus size={12} />
                      </button>
                      <span>{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity((prev) => prev + 1)}
                        className="rounded-full border border-slate-200 p-1"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            {activeStep > 0 && activeStep < 2 && (
              <button
                type="button"
                onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
                className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-500"
              >
                Back
              </button>
            )}
            {activeStep === 0 && (
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="rounded-full bg-brand-navy px-6 py-2 text-sm font-semibold text-white"
              >
                Review & Book
              </button>
            )}
            {activeStep === 1 && (
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="rounded-full bg-brand-gold px-6 py-2 text-sm font-semibold text-brand-navy"
              >
                Submit Quote Request
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingWorkflow;
