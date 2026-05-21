import React from "react";
import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";

const MobileAppSection = () => {
  return (
    <section className="bg-slate-50/70">
      <div className="mx-auto w-full max-w-none px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">
              Mobile Experience
            </p>
            <h2 className="mt-2 text-3xl font-display text-brand-navy">
              Customer app, employee app, vendor dashboard
            </h2>
            <p className="mt-4 text-slate-600">
              TrakJobs keeps every stakeholder in sync with mobile-first experiences, live
              updates, and secure payments.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white">
                App Store
              </button>
              <button className="rounded-full border border-brand-navy px-5 py-2.5 text-sm font-semibold text-brand-navy">
                Google Play
              </button>
            </div>
          </motion.div>

          <div className="relative">
            <div className="absolute -top-6 left-6 h-32 w-32 rounded-full bg-brand-gold/30 blur-2xl" />
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold/20 text-brand-navy">
                    <Smartphone size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-brand-navy">TrakJobs Mobile</p>
                    <p className="text-xs text-slate-500">Live job tracking</p>
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">v3.2</span>
              </div>
              <div className="mt-6 space-y-3">
                {["Dispatch alert", "Job completed", "Invoice issued"].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-3 py-2 text-xs"
                  >
                    <span className="font-semibold text-brand-navy">{item}</span>
                    <span className="text-slate-400">Now</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;
