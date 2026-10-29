import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';
import { wedding } from '../config/wedding';

export const CoupleDetails: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
      {/* Decorative ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-brand-gold/15 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="text-center mb-16 sm:mb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="inline-flex items-center gap-4 mb-6 mt-4">
            <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-r from-transparent to-brand-mocha/60" />
            <span className="text-brand-mocha uppercase tracking-[0.5em] text-[11px] font-semibold font-sans drop-shadow-sm">The Protagonists</span>
            <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-l from-transparent to-brand-mocha/60" />
          </div>
          <h2 className="text-5xl sm:text-7xl font-display text-brand-mocha tracking-tight drop-shadow-sm">
            {wedding.brideName} <span className="italic text-brand-mocha font-light mx-2">&</span> {wedding.groomName}
          </h2>
        </motion.div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-8 relative z-10">
        {/* Groom Details (Left on Desktop, Bottom on Mobile) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="text-center lg:text-right flex-1 lg:pr-10 order-4 lg:order-1"
        >
          <div className="mb-4 flex flex-col items-center lg:items-end">
            <span className="text-brand-mocha uppercase tracking-[0.4em] text-[10px] font-bold mb-3 block">The Groom</span>
            <h3 className="text-4xl sm:text-5xl font-display text-brand-mocha mb-2 drop-shadow-sm">{wedding.groomName}</h3>
            <p className="text-brand-sand/90 font-serif italic text-base sm:text-lg">Son of {wedding.groomParents.father}<br />& {wedding.groomParents.mother}</p>
          </div>
          <div className="hidden lg:flex justify-end mt-8">
            <Heart className="w-6 h-6 text-brand-gold/60 fill-brand-gold/20 transform hover:scale-110 transition-transform cursor-pointer" />
          </div>
        </motion.div>

        {/* Center Ampersand Medallion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative order-3 lg:order-2 flex-shrink-0"
        >
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-brand-gold/40 bg-white/70 shadow-[0_20px_50px_rgba(197,160,89,0.2)] flex items-center justify-center">
            <div className="absolute inset-2 rounded-full border border-brand-gold/20" />
            <span className="font-display italic font-light text-5xl sm:text-6xl text-brand-gold">&</span>
          </div>
          <Sparkles className="absolute -top-2 -left-2 w-6 h-6 text-brand-gold animate-pulse drop-shadow-sm" />
          <Sparkles className="absolute -bottom-1 -right-3 w-5 h-5 text-brand-gold animate-pulse delay-300 drop-shadow-sm" />
        </motion.div>

        {/* Bride Details (Right) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          className="text-center lg:text-left flex-1 lg:pl-10 order-2 lg:order-3"
        >
          <div className="mb-4 flex flex-col items-center lg:items-start">
            <span className="text-brand-mocha uppercase tracking-[0.4em] text-[10px] font-bold mb-3 block">The Bride</span>
            <h3 className="text-4xl sm:text-5xl font-display text-brand-mocha mb-2 drop-shadow-sm">{wedding.brideName}</h3>
            <p className="text-brand-sand/90 font-serif italic text-base sm:text-lg">Daughter of {wedding.brideParents.father}<br />& {wedding.brideParents.mother}</p>
          </div>
          <div className="hidden lg:flex justify-start mt-8">
            <Heart className="w-6 h-6 text-brand-gold/60 fill-brand-gold/20 transform hover:scale-110 transition-transform cursor-pointer" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
