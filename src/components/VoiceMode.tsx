import { useEffect, useState, useCallback } from "react";
import { Mic, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceModeProps {
  isActive: boolean;
  onClose: () => void;
  onTranscript: (text: string) => void;
}

export function VoiceMode({ isActive, onClose, onTranscript }: VoiceModeProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recognition, setRecognition] = useState<any>(null);

  const handleTranscript = useCallback(
    (text: string) => {
      onTranscript(text);
      setTimeout(() => {
        onClose();
      }, 500);
    },
    [onTranscript, onClose]
  );

  useEffect(() => {
    if (!isActive) return;

    // Check if browser supports speech recognition
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      alert(
        "Speech recognition is not supported in your browser. Please use Chrome or Edge."
      );
      onClose();
      return;
    }

    const recognitionInstance = new SpeechRecognitionAPI();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = "en-US";

    recognitionInstance.onstart = () => {
      setIsListening(true);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognitionInstance.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptText = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptText;
        } else {
          interimTranscript += transcriptText;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
      if (transcript) {
        handleTranscript(transcript);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognitionInstance.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error !== "aborted") {
        alert("Could not recognize speech. Please try again.");
      }
      onClose();
    };

    setRecognition(recognitionInstance);
    recognitionInstance.start();

    return () => {
      if (recognitionInstance) {
        recognitionInstance.abort();
      }
    };
  }, [isActive, onClose, transcript, handleTranscript]);

  const handleStop = () => {
    if (recognition) {
      recognition.stop();
    }
    onClose();
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={handleStop}
      />

      {/* Voice Panel */}
      <div className="relative w-[90%] max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
        <Button
          onClick={handleStop}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 rounded-full"
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="flex flex-col items-center gap-6">
          {/* Animated Mic Circle */}
          <div className="relative">
            <div
              className={`w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center shadow-lg ${
                isListening ? "animate-pulse" : ""
              }`}
            >
              <Mic className="w-10 h-10 text-white" />
            </div>

            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
                <div
                  className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping"
                  style={{ animationDelay: "0.5s" }}
                />
              </>
            )}
          </div>

          {/* Status Text */}
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900 mb-2">
              {isListening ? "Listening..." : "Starting..."}
            </p>
            {transcript && (
              <p className="text-sm text-gray-600 max-w-xs">"{transcript}"</p>
            )}
          </div>

          {/* Hint */}
          {!transcript && (
            <p className="text-xs text-gray-400 text-center max-w-xs">
              Try saying: "I spent 50 dollars on coffee" or "How much did I
              spend on food?"
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
