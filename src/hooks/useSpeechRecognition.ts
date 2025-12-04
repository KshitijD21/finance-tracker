import { useCallback, useRef, useState } from "react";

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isFinal, setIsFinal] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSentTranscriptRef = useRef('');

  const startListening = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Your browser does not support speech recognition');
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let fullTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        fullTranscript += result[0].transcript;

        if (result.isFinal) {
          fullTranscript += ' ';
        }
      }

      fullTranscript = fullTranscript.trim();
      setTranscript(fullTranscript);
      setIsFinal(false);

      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      silenceTimerRef.current = setTimeout(() => {
        if (fullTranscript && fullTranscript !== lastSentTranscriptRef.current) {
          lastSentTranscriptRef.current = fullTranscript;
          setIsFinal(true);
        }
      }, 2000);
    };

    recognition.onend = () => {
      setIsListening(false);

      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };

    recognition.onerror = () => {
      // Recognition error
    };

    recognition.start();

    recognitionRef.current = recognition;
    setIsListening(true);
    setTranscript('');
    setIsFinal(false);
    lastSentTranscriptRef.current = '';
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);

      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      lastSentTranscriptRef.current = '';
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setIsFinal(false);
  }, []);

  return {
    transcript,
    isListening,
    isFinal,
    startListening,
    stopListening,
    resetTranscript
  };
}
