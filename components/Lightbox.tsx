import React from 'react';

interface LightboxProps {
  imageUrl: string;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ imageUrl, onClose }) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      style={{ animation: 'fadeIn 0.3s ease' }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      <div className="w-[90%] max-w-4xl max-h-[90%] flex items-center justify-center">
        <img
          src={imageUrl}
          alt="Enlarged view"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image itself
          className="w-auto h-auto max-w-full max-h-full rounded-xl object-contain shadow-[0_10px_40px_rgba(2,6,23,0.8)]"
        />
      </div>
    </div>
  );
};

export default Lightbox;
