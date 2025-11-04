import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-6 text-[#cfd8dc] text-sm text-center">
      © {currentYear} Princess Amelia — Private Requests by email only • All rights reserved
    </footer>
  );
};

export default Footer;