import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Amit Verma",
    company: "Northside Realty",
    quote:
      "TrakJobs unified our vendors and crews in one dashboard. Dispatching is now effortless.",
  },
  {
    name: "Priya Sharma",
    company: "Urban Living Co.",
    quote:
      "The quote to invoice workflow is a game changer. We reduced turnaround times by 40%.",
  },
  {
    name: "Neha Kapoor",
    company: "Skyline Hospitality",
    quote:
      "Reliable vendors, real-time tracking, and clean reporting for every service job.",
  },
];

const Testimonials = () => {
  return (
    <section id="about" className="bg-white">
      <div className="mx-auto w-full max-w-none px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 py-16">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">
            Testimonials
          </p>
          <h2 className="mt-2 text-3xl font-display text-brand-navy">Trusted by leading operators</h2>
          <p className="mt-3 text-slate-600">Enterprise teams scale confidently with TrakJobs.</p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.name}
              whileHover={{ y: -6 }}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-1 text-brand-gold">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} size={14} />
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-600">{testimonial.quote}</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-200" />
                <div>
                  <p className="text-sm font-semibold text-brand-navy">{testimonial.name}</p>
                  <p className="text-xs text-slate-500">{testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
