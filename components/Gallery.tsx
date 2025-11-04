import React from 'react';

interface GalleryProps {
  images: string[];
  onImageClick: (imageUrl: string) => void;
}

const Photo: React.FC<{ src: string; alt: string; onClick: () => void }> = ({ src, alt, onClick }) => (
  <a
    href={src}
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    className="block relative overflow-hidden bg-[rgba(255,255,255,0.04)] rounded-2xl aspect-[4/5] shadow-[0_6px_22px_rgba(2,6,23,0.6)] transition-all duration-300 ease-in-out hover:-translate-y-1.5 hover:scale-[1.02]"
  >
    <img src={src} alt={alt} className="w-full h-full object-cover block" />
  </a>
);

const Gallery: React.FC<GalleryProps> = ({ images, onImageClick }) => {
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {images.map((img, index) => (
          <Photo key={index} src={img} alt={`Photo ${index + 1}`} onClick={() => onImageClick(img)} />
        ))}
        <div className="flex items-center justify-center p-4.5 text-[#cfd8dc] text-sm bg-[rgba(255,255,255,0.04)] rounded-2xl aspect-[4/5] shadow-[0_6px_22px_rgba(2,6,23,0.6)]">
          <div className="text-center">
            <strong className="text-[#6ee7b7] block mb-1">Limited / Private</strong>
            <div className="text-[#cfd8dc]">Book a private request for yoga classes and try-on videos.</div>
          </div>
        </div>
      </div>

      <div id="about" className="mt-7 text-[#cfd8dc] text-sm leading-relaxed">
        <h3 className="text-lg font-medium text-white mt-3.5 mb-2">About me</h3>
        <p className="m-0">
          I create private yoga sessions, private (sensitive) content delivered securely, and try-on / modelling videos for clients. I prioritize privacy and a respectful booking process. If you'd like a custom video, use the request form to ask for details — I will reply by email or Google Chat if provided.
        </p>
      </div>
    </section>
  );
};

export default Gallery;