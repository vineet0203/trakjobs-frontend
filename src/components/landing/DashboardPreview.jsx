import React from "react";
import { motion } from "framer-motion";
import { Calendar, CreditCard, FileText, LayoutDashboard, Users } from "lucide-react";

const widgets = [
  { title: "Vendor Dashboard", icon: LayoutDashboard, value: "2,184 active" },
  { title: "Employee App", icon: Users, value: "Live location" },
  { title: "Schedule Calendar", icon: Calendar, value: "142 jobs" },
  { title: "Invoice Management", icon: CreditCard, value: "$89k pending" },
  { title: "Quote Management", icon: FileText, value: "18 approvals" },
];

const DashboardPreview = () => {
  return (
    <section id="vendors" className="bg-slate-50/70">
      <div className="mx-auto w-full max-w-none px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid gap-10 lg:grid-cols-[1fr_1.1fr] items-center"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">
              TrakJobs
            </p>
            <h2 className="mt-2 text-3xl font-display text-brand-navy">
              A complete business operating system
            </h2>
            <p className="mt-4 text-slate-600">
              Unify vendor portals, employee tracking, customer journeys, scheduling, and
              billing in a single modern workspace.
            </p>
            <div className="mt-6 grid gap-4">
              {widgets.map((widget) => (
                <div
                  key={widget.title}
                  className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-sm backdrop-blur"
                >
                  <div className="flex items-center gap-3 text-sm font-semibold text-brand-navy">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gold/20 text-brand-navy">
                      <widget.icon size={18} />
                    </span>
                    {widget.title}
                  </div>
                  <span className="text-xs text-slate-500">{widget.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-white to-amber-50 p-6 shadow-2xl">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-brand-navy">Dispatch Board</p>
                  <span className="rounded-full bg-brand-gold/20 px-3 py-1 text-xs font-semibold text-brand-navy">
                    Live
                  </span>
                </div>
                <div className="mt-4 grid gap-3">
                  {["Emergency Plumbing", "AC Install", "Cleaning", "Electrical"].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-3 py-2 text-xs"
                    >
                      <span className="font-semibold text-brand-navy">{item}</span>
                      <span className="text-slate-500">ETA 45m</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-white p-4">
                  <p className="text-xs text-slate-500">Quote Pipeline</p>
                  <p className="mt-2 text-lg font-semibold text-brand-navy">$128k</p>
                  <div className="mt-3 h-2 rounded-full bg-slate-100">
                    <div className="h-2 w-2/3 rounded-full bg-brand-gold" />
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-4">
                  <p className="text-xs text-slate-500">Invoice Status</p>
                  <p className="mt-2 text-lg font-semibold text-brand-navy">94% paid</p>
                  <div className="mt-3 h-2 rounded-full bg-slate-100">
                    <div className="h-2 w-4/5 rounded-full bg-brand-navy" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-white/70 bg-white/60 p-4 shadow-xl backdrop-blur lg:block">
              <p className="text-xs text-slate-500">Employee Live Track</p>
              <p className="mt-1 text-sm font-semibold text-brand-navy">12 teams on duty</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardPreview;
