import React from "react";
import { Star } from "lucide-react";

const badges = [
  { name: "Google", hasStars: true, bold: false },
  { name: "facebook", hasStars: true, bold: true },
  { name: "yelp", hasStars: true, bold: true, icon: "yelp" },
  { name: "Angi", hasStars: true, bold: true },
  { name: "BBB", hasStars: false, bold: true, subtitle: "ACCREDITED BUSINESS" },
];

const TrustBadgesSection = () => {
  return (
    <section className="bg-[#fafafa] pb-16 pt-4 border-b border-slate-200">
      <div className="mx-auto w-full max-w-none px-6 md:px-10 lg:px-14">
        <p className="text-center text-[15px] font-semibold text-slate-600">
          Trusted by homeowners and businesses across the country
        </p>
        <div className="mt-8 flex flex-wrap items-end justify-center gap-14 text-sm font-semibold text-slate-500">
          {badges.map((badge) => (
            <div key={badge.name} className="flex flex-col items-center">
              <div className={`text-2xl ${badge.bold ? 'font-bold' : 'font-medium'} text-slate-400 font-sans flex items-center gap-1`}>
                {badge.icon === 'yelp' && <span className="text-3xl leading-none text-slate-400 -mt-1">*</span>}
                {badge.name}
              </div>
              {badge.hasStars && (
                <div className="mt-1.5 flex items-center justify-center gap-0.5 text-slate-400">
                  <Star size={14} className="fill-current text-slate-400" />
                  <Star size={14} className="fill-current text-slate-400" />
                  <Star size={14} className="fill-current text-slate-400" />
                  <Star size={14} className="fill-current text-slate-400" />
                  <Star size={14} className="fill-current text-slate-400" />
                </div>
              )}
              {badge.subtitle && (
                <div className="mt-1 text-[10px] font-bold text-slate-400 text-center leading-tight">
                  ACCREDITED <br /> BUSINESS
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadgesSection;
