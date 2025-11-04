import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat, FunctionDeclaration, Type } from '@google/genai';
import ChatBubble from './ChatBubble';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

type Message = {
  role: 'user' | 'model';
  text: string;
};

// Define the function declaration for the tool the AI can call
const createRequestMailtoDeclaration: FunctionDeclaration = {
  name: 'createRequestMailto',
  description: 'Creates a mailto link when all necessary information (name, email, and request details) has been collected from the user.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: {
        type: Type.STRING,
        description: 'The full name of the person making the request.',
      },
      email: {
        type: Type.STRING,
        description: 'The email address where the user wants to receive the reply.',
      },
      details: {
        type: Type.STRING,
        description: 'A detailed description of the custom video request.',
      },
    },
    required: ['name', 'email', 'details'],
  },
};


const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hello! I'm Amelia, your personal assistant. How can I help you formulate a request for a custom video today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { text, setText, startListening, stopListening, isListening, hasRecognitionSupport } = useSpeechRecognition();

  useEffect(() => {
    if (hasRecognitionSupport) {
      setInput(text);
    }
  }, [text, hasRecognitionSupport]);

  useEffect(() => {
    const initChat = () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        chatRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: "You are Amelia, a friendly and respectful AI assistant for Princess Amelia's website. Your primary goal is to help visitors formulate a request for a custom video and then guide them through the payment process. \n\n**Your instructions are:**\n1.  **Be Professional & Welcoming:** Handle all requests, including for sensitive material like naked videos/pictures, professionally and without judgment. Princess Amelia does NOT use platforms like OnlyFans; content is sold directly via Google Chat or DMs.\n2.  **Gather Information:** Politely ask for the user's name, reply-to email, and the specific details of their request.\n3.  **Call the Function:** Once you have all three pieces of information (name, email, details), you MUST call the `createRequestMailto` function. Do not try to create the mailto link yourself or confirm the information again. Simply call the function.\n4.  **Await Payment Instructions:** After the function call, the system will automatically provide payment instructions. Do not mention payment before this point.",
            tools: [{ functionDeclarations: [createRequestMailtoDeclaration] }],
          },
        });
      } catch (error) {
        console.error("Failed to initialize Gemini chat:", error);
        setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
      }
    };
    initChat();
  }, []);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setText('');
    setIsLoading(true);

    if (!chatRef.current) {
        setIsLoading(false);
        setMessages(prev => [...prev, {role: 'model', text: "Chat is not initialized. Please refresh."}]);
        return;
    }
    
    try {
        const response = await chatRef.current.sendMessage({ message: userMessage.text });
        
        // Check for function calls from the model
        if (response.functionCalls && response.functionCalls.length > 0) {
            const functionCall = response.functionCalls[0];
            if (functionCall.name === 'createRequestMailto') {
                const { name, email, details } = functionCall.args;
                
                // First, display the payment information.
                const paymentInfoText = `Perfect, I've got your request details! Here is how to complete the payment:\n\n**Pricing:**\nCustom videos start at **$30**. The final price depends on the complexity and length of your request.\n\n**Payment Method:**\nPayment is made with gift cards. You can choose from:\n- **Apple Gift Card**\n- **Steam Gift Card**\n- **Razer Gold Gift Card**\n\n**How to Pay:**\n1.  **Buy a Gift Card:** You can buy one online or from a physical store.\n    - [Buy Apple Gift Card](https://www.apple.com/shop/buy-giftcard/giftcard)\n    - [Buy Steam Gift Card](https://store.steampowered.com/digitalgiftcards/)\n    - [Buy Razer Gold Gift Card](https://www.razer.com/gold/shop)\n2.  **Send the Card:** Email the gift card code (or a photo of the physical card) to **princessamelia742@gmail.com**. You can also send it via Google Chat.\n\nOnce payment is confirmed, Princess Amelia will start working on your video!`;
                
                const paymentMessage: Message = { role: 'model', text: paymentInfoText };
                setMessages((prev) => [...prev, paymentMessage]);

                // Then, provide the mailto link in a separate message.
                const to = 'princessamelia742@gmail.com';
                const subject = `Custom Video Request from ${name}`;
                const body = `Name: ${name}\nReply-to email: ${email}\n\nDetails:\n${details}\n\n-- Sent from AI Assistant request form`;
                const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}&cc=${encodeURIComponent(email)}`;
                
                const mailtoMessageText = `Please click the link below to open your email client and send the request details. You can attach the gift card info in that email or send it separately.\n\n[Send Request to Princess Amelia](${mailto})`;
                
                // Add a slight delay for better UX
                setTimeout(() => {
                    setMessages((prev) => [...prev, { role: 'model', text: mailtoMessageText }]);
                }, 1000);
            }
        } else {
            // If no function call, it's a regular text response
            const botMessage: Message = { role: 'model', text: response.text.trim() };
            setMessages((prev) => [...prev, botMessage]);
        }
    } catch (error) {
        console.error("Gemini API error:", error);
        setMessages((prev) => [...prev, { role: 'model', text: "I'm sorry, I encountered an error. Could you please rephrase your message?" }]);
    } finally {
        setIsLoading(false);
    }
  }, [input, isLoading, setText]);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  return (
    <div className={`fixed top-0 right-0 sm:top-8 sm:right-8 z-50 transition-all duration-300 ease-in-out ${isOpen ? 'w-full h-full sm:w-[400px] sm:h-[600px]' : 'w-0 h-0'}`}>
      <div className={`flex flex-col h-full bg-[#0b0d10] rounded-none sm:rounded-2xl shadow-2xl border border-white/[.05] overflow-hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-gradient-to-b from-white/[.03] to-white/[.01] border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6ee7b7] to-[#6bb1ff] flex items-center justify-center font-bold text-[#042029] text-lg">A</div>
            <div>
              <h3 className="font-bold text-white">Amelia</h3>
              <p className="text-xs text-[#cfd8dc]">Your AI Assistant</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#cfd8dc] hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <ChatBubble key={index} message={msg} />
          ))}
          {isLoading && <ChatBubble message={{ role: 'model', text: '...' }} />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 bg-gradient-to-b from-white/[.01] to-white/[.02] flex-shrink-0">
          <div className="flex items-center gap-2 bg-[#071417] border border-white/[.03] rounded-xl p-1.5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 bg-transparent px-2.5 py-1.5 text-[#eaf6f0] focus:outline-none"
              disabled={isLoading}
            />
            {hasRecognitionSupport && (
                <button onClick={handleMicClick} className={`p-2 rounded-lg transition-colors ${isListening ? 'bg-[#6ee7b7]/20 text-[#6ee7b7]' : 'text-[#cfd8dc] hover:bg-white/10'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm5 4V4a1 1 0 10-2 0v4a1 1 0 102 0zM9 15a1 1 0 002 0v-2.069a5.002 5.002 0 00-4 0V15z" clipRule="evenodd" /><path d="M5 9a5 5 0 0110 0v2.069a5.001 5.001 0 01-4 4.9V18h2a1 1 0 110 2H7a1 1 0 110-2h2v-2.031a5.001 5.001 0 01-4-4.9V9z" /></svg>
                </button>
            )}
            <button onClick={handleSend} disabled={isLoading || !input.trim()} className="p-2 rounded-lg bg-gradient-to-r from-[#6ee7b7] to-[#6bb1ff] text-[#042029] disabled:opacity-50 disabled:cursor-not-allowed">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;