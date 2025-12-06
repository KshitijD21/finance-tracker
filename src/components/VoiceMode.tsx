import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, PhoneOff, Volume2, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AudioVisualizer } from "./AudioVisualizer";
import { useVoiceConversation } from "@/hooks/useVoiceConversation";

interface VoiceModeProps {
  isActive: boolean;
  onClose: () => void;
  onMessageReceived: (message: string, expense?: unknown) => void;
  onUserMessage: (message: string) => void;
}

export function VoiceMode({
  isActive,
  onClose,
  onMessageReceived,
  onUserMessage,
}: VoiceModeProps) {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { phase, transcription, isListening, start, stop, error } =
    useVoiceConversation({
      onMessageReceived: (message: string, expense?: unknown) => {
        onMessageReceived(message, expense);
      },
      onUserMessage: (message: string) => {
        onUserMessage(message);
      },
    });

  // Get microphone access for audio visualization
  useEffect(() => {
    if (!isActive) {
      // Clean up audio stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setAudioStream(null);
      return;
    }

    const getMicrophoneStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        streamRef.current = stream;
        setAudioStream(stream);
      } catch {
        // Failed to get microphone access
      }
    };

    getMicrophoneStream();
  }, [isActive]);

  // Start voice conversation when active
  useEffect(() => {
    if (isActive && phase === "idle") {
      start();
    }
  }, [isActive, phase, start]);

  // Handle close
  const handleClose = () => {
    stop();
    onClose();
  };

  // Handle mute toggle
  const handleMuteToggle = () => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  };

  const getPhaseIcon = () => {
    switch (phase) {
      case "listening":
        return <Mic className="w-8 h-8 text-white" />;
      case "thinking":
        return <Loader2 className="w-8 h-8 text-white animate-spin" />;
      case "speaking":
        return <Volume2 className="w-8 h-8 text-white" />;
      case "error":
        return <X className="w-8 h-8 text-red-400" />;
      default:
        return <Mic className="w-8 h-8 text-white" />;
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case "listening":
        return "Listening...";
      case "thinking":
        return "Processing...";
      case "speaking":
        return "Speaking...";
      case "error":
        return error || "Error occurred";
      default:
        return "Starting...";
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "listening":
        return "from-emerald-400 to-teal-400";
      case "thinking":
        return "from-blue-400 to-indigo-400";
      case "speaking":
        return "from-purple-400 to-pink-400";
      case "error":
        return "from-red-400 to-orange-400";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  if (!isActive) return null;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Animated Border Effect */}
          <motion.div
            className="absolute inset-4"
            style={{
              border: "4px solid transparent",
              borderRadius: "2.5rem",
              background:
                "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899) border-box",
              WebkitMask:
                "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 backdrop-blur-xl"
            onClick={handleClose}
          />

          {/* Voice Panel */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-[90%] max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8"
          >
            <div className="flex flex-col items-center gap-6">
              {/* Animated Voice Circle with Audio Visualization */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Audio Visualizer Background */}
                {isListening && (
                  <AudioVisualizer
                    audioStream={audioStream}
                    isActive={isListening}
                  />
                )}

                {/* Main Circle */}
                <div
                  className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${getPhaseColor()} flex items-center justify-center shadow-lg z-10 ${
                    phase === "listening" || phase === "speaking"
                      ? "animate-pulse"
                      : ""
                  }`}
                >
                  {getPhaseIcon()}
                </div>

                {/* Pulse Animation */}
                {(phase === "listening" || phase === "thinking") && (
                  <>
                    <div
                      className={`absolute inset-0 rounded-full bg-gradient-to-br ${getPhaseColor()} opacity-30 animate-ping`}
                    />
                    <div
                      className={`absolute inset-0 rounded-full bg-gradient-to-br ${getPhaseColor()} opacity-20 animate-ping`}
                      style={{ animationDelay: "0.5s" }}
                    />
                  </>
                )}
              </div>

              {/* Status Text */}
              <div className="text-center">
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {getPhaseText()}
                </p>
                {transcription && (
                  <p className="text-sm text-gray-600 max-w-xs italic">
                    "{transcription}"
                  </p>
                )}
                {error && (
                  <p className="text-sm text-red-500 max-w-xs mt-2">{error}</p>
                )}
              </div>

              {/* Animated Transcription */}
              <AnimatePresence mode="wait">
                {transcription ? (
                  <motion.p
                    key={transcription}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-gray-700 italic text-center max-w-xs mb-4"
                  >
                    "{transcription}"
                  </motion.p>
                ) : (
                  phase === "listening" && (
                    <motion.div
                      key="hints"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center mb-4"
                    >
                      <p className="text-xs text-gray-400 max-w-xs mb-2">
                        Try saying:
                      </p>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">
                          "I spent $50 on coffee"
                        </p>
                        <p className="text-xs text-gray-500">
                          "How much did I spend on food?"
                        </p>
                        <p className="text-xs text-gray-500">
                          "Delete my last expense"
                        </p>
                      </div>
                    </motion.div>
                  )
                )}
              </AnimatePresence>

              {/* Voice Controls */}
              <div className="flex items-center justify-center gap-6 mt-6">
                {/* Mute/Unmute Toggle */}
                <motion.button
                  onClick={handleMuteToggle}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isListening ? (
                    <Mic className="w-6 h-6 text-white" />
                  ) : (
                    <MicOff className="w-6 h-6 text-white" />
                  )}
                </motion.button>

                {/* End Call */}
                <motion.button
                  onClick={handleClose}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 flex items-center justify-center transition-all shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PhoneOff className="w-6 h-6 text-white" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
