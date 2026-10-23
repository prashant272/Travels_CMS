/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { soundEffects } from '../services/soundEffects';

interface FlightTakeoffAnimationProps {
  onComplete: () => void;
  pilotName?: string;
}

export const FlightTakeoffAnimation: React.FC<FlightTakeoffAnimationProps> = ({
  onComplete,
  pilotName = 'Commander'
}) => {
  const [stage, setStage] = useState<'taxi' | 'takeoff' | 'cruising' | 'landing'>('taxi');

  useEffect(() => {
    // Play airport chime on launch
    soundEffects.playFlightChime();

    // Sequence of animations
    const t1 = setTimeout(() => setStage('takeoff'), 200);
    const t2 = setTimeout(() => setStage('cruising'), 1100);
    const t3 = setTimeout(() => {
      setStage('landing');
      onComplete();
    }, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div 
      onClick={onComplete}
      className="fixed inset-0 z-50 overflow-hidden pointer-events-auto cursor-pointer bg-gradient-to-b from-sky-400 via-sky-200 to-amber-100 flex flex-col justify-between"
      style={{
        animation: 'fadeIn 0.3s ease-out forwards'
      }}
    >
      {/* Dynamic Moving Clouds Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Sun Glow */}
        <div className="absolute top-12 right-20 w-36 h-36 rounded-full bg-amber-200/80 blur-2xl animate-pulse" />

        {/* Ambient Cloud 1 */}
        <div 
          className="absolute top-1/4 -left-20 w-80 h-28 bg-white/70 rounded-full blur-xl"
          style={{ animation: 'floatCloud 4s linear infinite' }}
        />

        {/* Ambient Cloud 2 */}
        <div 
          className="absolute top-1/2 -right-20 w-96 h-32 bg-white/60 rounded-full blur-xl"
          style={{ animation: 'floatCloudReverse 5s linear infinite' }}
        />

        {/* Ambient Cloud 3 */}
        <div className="absolute bottom-1/3 left-1/3 w-72 h-24 bg-white/50 rounded-full blur-lg" />
      </div>

      {/* Runway Perspective Lines (during taxi) */}
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-slate-700/30 to-transparent flex justify-center items-end pointer-events-none">
        <div className="w-1.5 h-full bg-amber-300/60 dashed-line animate-pulse" />
      </div>

      {/* Flight Takeoff Vehicle (Animated Jet + Jetstream trails) */}
      <div 
        className="absolute z-30 transition-all duration-1000 ease-in-out"
        style={{
          left: stage === 'taxi' ? '15%' : stage === 'takeoff' ? '50%' : '110%',
          top: stage === 'taxi' ? '70%' : stage === 'takeoff' ? '38%' : '-15%',
          transform: `scale(${stage === 'taxi' ? '0.85' : stage === 'takeoff' ? '1.3' : '1.7'}) rotate(${stage === 'taxi' ? '-10deg' : '-32deg'})`,
          filter: 'drop-shadow(0 15px 25px rgba(0, 0, 0, 0.25))'
        }}
      >
        <div className="relative">
          {/* Jetstream condensation trail */}
          <div 
            className="absolute top-1/2 -left-36 w-40 h-3 bg-gradient-to-l from-white via-white/70 to-transparent rounded-full blur-xs"
            style={{
              opacity: stage === 'takeoff' || stage === 'cruising' ? 1 : 0,
              transition: 'opacity 0.4s ease'
            }}
          />

          {/* Realistic SVG Airplane */}
          <div className="text-6xl sm:text-7xl select-none filter drop-shadow-lg transform -scale-x-100">
            ✈️
          </div>

          {/* Engine Afterburner Glow */}
          <div 
            className="absolute top-1/2 -left-4 w-4 h-4 rounded-full bg-amber-400 blur-xs animate-ping"
            style={{ opacity: stage === 'takeoff' ? 1 : 0 }}
          />
        </div>
      </div>

      {/* Takeoff Status Overlay Pill */}
      <div className="relative z-40 mx-auto mt-12 px-6 py-3 rounded-full bg-white/90 backdrop-blur-md border border-sky-300 shadow-xl flex items-center gap-3 animate-bounce">
        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
        <div className="text-center">
          <span className="text-xs sm:text-sm font-black text-slate-800 tracking-wide uppercase">
            Cleared for Takeoff • Welcome aboard, {pilotName}!
          </span>
          <p className="text-[10px] text-sky-700 font-bold">
            Soaring directly to YatriDesk Travel Desk... (Tap to skip)
          </p>
        </div>
      </div>

      {/* Flight HUD Status footer */}
      <div className="relative z-40 w-full px-6 py-4 flex items-center justify-between text-xs font-mono font-bold text-slate-700 bg-white/40 backdrop-blur-xs border-t border-white/50">
        <span className="flex items-center gap-1.5">
          <span>ALT: 28,000 FT</span>
          <span>•</span>
          <span>MACH: 0.85</span>
        </span>
        <span className="bg-sky-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase">
          DESTINATION: TRAVEL CRM
        </span>
      </div>
    </div>
  );
};
