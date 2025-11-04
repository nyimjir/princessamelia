import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Gallery from './components/Gallery';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Lightbox from './components/Lightbox';
import Chatbot from './components/Chatbot';
import ChatbotHint from './components/ChatbotHint';

const App: React.FC = () => {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showChatHint, setShowChatHint] = useState(false);

  useEffect(() => {
    // Only show the hint if the user hasn't seen it this session.
    const hasSeenHint = sessionStorage.getItem('hasSeenChatHint');
    if (!hasSeenHint) {
      setShowChatHint(true);
    }

    // Hide hint after a delay
    const timer = setTimeout(() => {
      handleCloseHint();
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const images = [
    'https://firebasestorage.googleapis.com/v0/b/genai-lhp.appspot.com/o/prompts%2F09068037-7597-4011-8051-2d7cb7698a65%2F0.jpg?alt=media&token=e9b38030-9b62-4b2a-8d7b-1172a39a25b2',
    'https://firebasestorage.googleapis.com/v0/b/genai-lhp.appspot.com/o/prompts%2F09068037-7597-4011-8051-2d7cb7698a65%2F1.jpg?alt=media&token=4458f338-f076-4d1a-8285-d0cd90b79e12',
    'https://firebasestorage.googleapis.com/v0/b/genai-lhp.appspot.com/o/prompts%2F09068037-7597-4011-8051-2d7cb7698a65%2F2.jpg?alt=media&token=e0e4b775-6c1f-4f9e-a03d-82d2f23b2c61',
  ];

  const handleCloseHint = () => {
    if (showChatHint) {
      setShowChatHint(false);
      sessionStorage.setItem('hasSeenChatHint', 'true');
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setLightboxImage(imageUrl);
    handleCloseHint();
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    handleCloseHint();
  };


  return (
    <>
      <div className="w-full max-w-[1100px] rounded-3xl p-5 sm:p-7 bg-gradient-to-b from-white/[.02] to-white/[.01] shadow-[0_6px_30px_rgba(2,6,23,0.6),inset_0_1px_0_rgba(255,255,255,0.02)] backdrop-blur-sm">
        <Header />

        <main className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-7 items-start">
          <Gallery images={images} onImageClick={handleImageClick} />
          <Sidebar />
        </main>

        <Footer />
      </div>
      {lightboxImage && <Lightbox imageUrl={lightboxImage} onClose={closeLightbox} />}

      {showChatHint && !isChatOpen && <ChatbotHint onClose={handleCloseHint} />}

      {!isChatOpen && (
        <button
          onClick={toggleChat}
          className="fixed top-8 right-8 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-[#6ee7b7] to-[#6bb1ff] text-[#042029] shadow-xl flex items-center justify-center transition-transform hover:scale-110 animate-fade-in"
          style={{ animation: 'fadeIn 0.5s ease' }}
          aria-label="Open chat assistant"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.528L16.5 21.75l-.398-1.222a2.997 2.997 0 00-2.26-2.26L12.75 18l1.222-.398a2.997 2.997 0 002.26-2.26L16.5 14.25l.398 1.222a2.997 2.997 0 002.26 2.26L20.25 18l-1.222.398a2.997 2.997 0 00-2.26 2.262z" />
          </svg>
        </button>
      )}
      <Chatbot isOpen={isChatOpen} onClose={toggleChat} />
    </>
  );
};

export default App;
