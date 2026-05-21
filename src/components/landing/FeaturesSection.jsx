import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  BellRing,
  Briefcase,
  CalendarClock,
  ClipboardCheck,
  CreditCard,
  LineChart,
  ShieldCheck,
  Users,
} from "lucide-react";

const features = [
  { title: "Multi-role dashboards", icon: Briefcase },
  { title: "Real-time tracking", icon: Activity },
  { title: "Dispatch management", icon: CalendarClock },
  { title: "Smart scheduling", icon: ClipboardCheck },
  { title: "Employee management", icon: Users },
  { title: "Quote to invoice workflow", icon: LineChart },
  { title: "Secure payments", icon: CreditCard },
  { title: "Analytics and reports", icon: BarChart3 },
  { title: "AI-powered automation", icon: BellRing },
  { title: "Enterprise security", icon: ShieldCheck },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="bg-slate-50/70">
      <div className="mx-auto w-full max-w-none px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">
            Why TrakJobs
          </p>
          <h2 className="mt-2 text-3xl font-display text-brand-navy">
            Everything you need to scale field service operations
          </h2>
          <p className="mt-3 text-slate-600">
            Built for enterprise teams managing vendors, employees, schedules, and customers.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              whileHover={{ y: -6 }}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gold/15 text-brand-navy">
                <feature.icon size={20} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-brand-navy">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600">
                Streamline every workflow with unified dashboards and smart automation.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
