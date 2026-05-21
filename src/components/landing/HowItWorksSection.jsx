import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const steps = [
  "Customer books service",
  "Vendor receives request",
  "Employee gets assigned",
  "Work gets completed",
  "Invoice generated",
  "Customer reviews service",
];

const HowItWorksSection = () => {
  return (
    <section id="how" className="bg-white">
      <div className="mx-auto w-full max-w-none px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">
            Workflow Automation
          </p>
          <h2 className="mt-2 text-3xl font-display text-brand-navy">
            A modern field service workflow
          </h2>
          <p className="mt-3 text-slate-600">
            TrakJobs orchestrates every step from booking to payment.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step}
              whileHover={{ y: -4 }}
              className="relative rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy text-white">
                  {index + 1}
                </span>
                <p className="text-base font-semibold text-brand-navy">{step}</p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                <CheckCircle2 size={16} className="text-brand-gold" />
                Automated status updates
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
