/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Train, Plane, Bus, Sparkles, Sliders } from 'lucide-react';

interface TravelBackgroundProps {
  opacityPreset?: 'subtle' | 'balanced' | 'vivid';
  showControls?: boolean;
}

export const TravelBackground: React.FC<TravelBackgroundProps> = ({
  opacityPreset = 'balanced',
  showControls = false
}) => {
  // Store user-selected opacity preference in local storage for persistence
  const [level, setLevel] = useState<'subtle' | 'balanced' | 'vivid'>(() => {
    try {
      const saved = localStorage.getItem('yatridesk_bg_level');
      if (saved === 'subtle' || saved === 'balanced' || saved === 'vivid') {
        return saved;
      }
    } catch {}
    return opacityPreset;
  });

  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const changeLevel = (newLevel: 'subtle' | 'balanced' | 'vivid') => {
    setLevel(newLevel);
    try {
      localStorage.setItem('yatridesk_bg_level', newLevel);
    } catch {}
  };

  // Map levels to precise, eye-tested opacity values that make the train, flight, and bus clearly visible
  const opacityConfig = {
    subtle: {
      imageOpacity: 'opacity-50',
      lightWash: 'bg-white/35',
      label: 'Soft (Eye Care)'
    },
    balanced: {
      imageOpacity: 'opacity-75',
      lightWash: 'bg-white/18',
      label: 'Balanced'
    },
    vivid: {
      imageOpacity: 'opacity-95',
      lightWash: 'bg-white/5',
      label: 'Vivid Panorama'
    }
  }[level];

  return (
    <>
      {/* Zero-Lag Hardware-Accelerated Multi-Modal Travel Canvas */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
        style={{ transform: 'translateZ(0)', willChange: 'opacity' }}
        aria-hidden="true"
      >
        {/* Base Light Travel Sky Radial Gradients */}
        <div className="absolute inset-0 bg-[#f8fafc]" />
        
        {/* Indian Railway (Vande Bharat), Flight, and Bus Master Artwork */}
        <div className={`absolute inset-0 transition-opacity duration-300 ease-out ${opacityConfig.imageOpacity}`}>
          <picture>
            <source srcSet="/assets/travel_bg.webp" type="image/webp" />
            <img
              src="/assets/travel_bg.jpg"
              alt="Indian Railways, Flight, and Luxury Bus Panorama"
              className="w-full h-full object-cover object-center filter saturate-[1.1] contrast-[1.03]"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </div>

        {/* Ambient Daylight Light-Theme Protective Shield - Guarantees 100% Readability for CRM Tables */}
        <div 
          className={`absolute inset-0 ${opacityConfig.lightWash} backdrop-blur-[0.5px] transition-colors duration-300`}
        />



        {/* Micro Multi-Modal Route Grid & GPS Navigation Accents */}
        <svg 
          className="absolute inset-0 w-full h-full text-slate-400/20" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="lightSpeedGrid" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M 120 0 L 0 0 0 120" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
              <circle cx="120" cy="0" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lightSpeedGrid)" />
        </svg>

        {/* Atmospheric Floating Badges for Multi-Modal Indian Transit - Watermarked in Corners */}
        <div className="absolute top-20 right-8 hidden xl:flex items-center gap-3 text-slate-400/50 font-mono text-[11px] font-bold tracking-wider">
          <span className="flex items-center gap-1.5 bg-white/60 px-2.5 py-1 rounded-full border border-slate-200/50 shadow-2xs backdrop-blur-xs">
            🚆 Indian Railways
          </span>
          <span className="flex items-center gap-1.5 bg-white/60 px-2.5 py-1 rounded-full border border-slate-200/50 shadow-2xs backdrop-blur-xs">
            ✈️ Sky Airways
          </span>
          <span className="flex items-center gap-1.5 bg-white/60 px-2.5 py-1 rounded-full border border-slate-200/50 shadow-2xs backdrop-blur-xs">
            🚌 Highway Express
          </span>
        </div>
      </div>

      {/* Optional Interactive Floating Wallpaper Controller for User Customization */}
      {showControls && (
        <div className="fixed bottom-4 left-4 z-40 hidden sm:block">
          <div className="relative">
            {isOpenMenu ? (
              <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-2.5 shadow-xl text-xs space-y-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between gap-3 pb-1 border-b border-slate-100 text-slate-700 font-black">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Travel Theme Wallpaper</span>
                  </span>
                  <button 
                    onClick={() => setIsOpenMenu(false)}
                    className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  {(['subtle', 'balanced', 'vivid'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => changeLevel(mode)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                        level === mode
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  Railway 🚆 • Flight ✈️ • Bus 🚌
                </p>
              </div>
            ) : (
              <button
                onClick={() => setIsOpenMenu(true)}
                title="Adjust Travel Wallpaper Intensity"
                className="flex items-center gap-1.5 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 px-2.5 py-1.5 rounded-full border border-slate-200/90 shadow-sm text-xs font-bold backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden md:inline text-[11px]">Theme Wallpaper</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
