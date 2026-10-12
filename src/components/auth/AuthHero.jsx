import React from 'react';
import leftHeroImg from '../../assets/left_hero_full.jpg';

export default function AuthHero() {
  return (
    <div className="relative w-full h-full min-h-[360px] lg:min-h-full overflow-hidden bg-[#edf9f5] flex items-center justify-center">
      {/* Complete Left Side Background Image */}
      <img
        src={leftHeroImg}
        alt="LibraBook - Library Management System - More Books Bigger Dreams"
        className="w-full h-full object-cover object-left-top select-none pointer-events-none"
      />
    </div>
  );
}
