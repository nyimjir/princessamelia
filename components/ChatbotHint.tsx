import React from 'react';

interface ChatbotHintProps {
  onClose: () => void;
}

const ChatbotHint: React.FC<ChatbotHintProps> = ({ onClose }) => {
  return (
    <div
      className="fixed top-28 right-8 z-30 w-max animate-fade-in-down cursor-pointer"
      onClick={onClose}
      role="tooltip"
      aria-hidden="true"
    >
      <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out forwards;
        }
      `}</style>
      <div className="bg-[#0f1114] border border-white/10 text-white text-sm rounded-lg px-4 py-2.5 shadow-lg relative">
        <p className="m-0 font-medium">Have a request? Chat with me!</p>
        {/* Arrow pointing up */}
        <div className="absolute -top-2 right-6 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-[#0f1114]"></div>
      </div>
    </div>
  );
};

export default ChatbotHint;
