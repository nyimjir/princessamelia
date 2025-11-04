import { useState, useEffect, useRef, useCallback } from 'react';

// FIX: Define interfaces for the Web Speech API to resolve TypeScript errors.
// These types are not included in standard DOM typings.
interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: { transcript: string };
}
interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
}

interface SpeechRecognitionHook {
  text: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  hasRecognitionSupport: boolean;
  setText: (text: string) => void;
}

// FIX: Update function signature to use the defined interface and implementation to bypass missing window properties.
const getSpeechRecognition = (): (new () => ISpeechRecognition) | null => {
  if (typeof window !== 'undefined') {
    // FIX: Cast window to any to access vendor-prefixed properties for SpeechRecognition.
    return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
  }
  return null;
};

export const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  // FIX: Use ISpeechRecognition interface to avoid a name collision with the SpeechRecognition variable defined below.
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const SpeechRecognition = getSpeechRecognition();

  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      setText(prev => prev + finalTranscript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    recognitionRef.current = recognition;

    return () => {
        if(recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };
  }, [SpeechRecognition]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setText(''); // Clear previous text
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return {
    text,
    setText,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport: !!SpeechRecognition,
  };
};
