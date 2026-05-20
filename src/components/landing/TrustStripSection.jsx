import React from "react";
import { Calendar, User, MapPin, ShieldCheck } from "lucide-react";

const items = [
  {
    title: "Book in Minutes",
    description: "Easy online booking\nanytime, anywhere.",
    icon: Calendar,
  },
  {
    title: "Skilled Professionals",
    description: "Experienced, vetted &\nbackground checked.",
    icon: User,
  },
  {
    title: "We Come to You",
    description: "On-time service at your\nhome or business.",
    icon: MapPin,
  },
  {
    title: "Satisfaction Guaranteed",
    description: "Quality work with a promise\nyou can count on.",
    icon: ShieldCheck,
  },
];

const TrustStripSection = () => {
  return (
    <section className="bg-white pb-12">
      <div className="mx-auto w-full max-w-none px-6 md:px-10 lg:px-14">
        <div className="rounded-2xl bg-[#1e293b] px-8 py-10 shadow-lg">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10 lg:divide-x-0">
            {items.map((item) => (
              <div key={item.title} className="flex items-start gap-4 lg:justify-center md:pl-8 lg:pl-0 first:pl-0 pt-6 md:pt-0 first:pt-0">
                <span className="flex items-center justify-center p-2 rounded-xl bg-white/5">
                  <item.icon size={26} strokeWidth={1.5} className="text-[#ffb800]" />
                </span>
                <div>
                  <h4 className="text-[15px] font-bold text-white">{item.title}</h4>
                  <p className="mt-1.5 text-sm text-slate-300 leading-relaxed whitespace-pre-line">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustStripSection;
