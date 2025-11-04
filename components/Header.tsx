import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between gap-5 mb-6">
      <div className="flex gap-3.5 items-center">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6ee7b7] to-[#6bb1ff] flex items-center justify-center font-bold text-[#042029] text-xl">
          PA
        </div>
        <div>
          <h1 className="m-0 text-xl font-medium tracking-wide">Princess Amelia</h1>
          <p className="m-0 text-[#cfd8dc] text-sm">Private yoga • Modeling • Try-on videos</p>
        </div>
      </div>
      <nav className="hidden sm:block">
        <a href="#about" className="text-[#cfd8dc] text-sm no-underline ml-4.5">About</a>
        <a href="#request" className="text-[#6ee7b7] font-semibold text-sm no-underline ml-4.5">Request Video</a>
        <a href="#contact" className="text-[#cfd8dc] text-sm no-underline ml-4.5">Contact</a>
      </nav>
    </header>
  );
};

export default Header;