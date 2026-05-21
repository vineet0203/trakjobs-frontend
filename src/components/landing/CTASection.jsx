import React from "react";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section id="cta" className="bg-brand-navy">
      <div className="mx-auto w-full max-w-none px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <h2 className="text-3xl font-display text-white">Ready to Scale Your Service Business?</h2>
          <p className="max-w-2xl text-sm text-slate-200">
            Launch your service marketplace, dispatch, and vendor network with TrakJobs.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button className="rounded-full bg-brand-gold px-6 py-2.5 text-sm font-semibold text-brand-navy">
              Start Free
            </button>
            <button className="rounded-full border border-white/60 px-6 py-2.5 text-sm font-semibold text-white">
              Book Demo
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
