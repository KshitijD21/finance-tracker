import { useState, useRef, useCallback } from 'react';

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';
const DEFAULT_VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Adam voice
const DEFAULT_MODEL_ID = 'eleven_monolingual_v1';

export function useElevenLabs() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback(async (text: string, onAudioStart?: () => void) => {
    if (!text.trim()) return;

    // Get ElevenLabs API configuration from environment variables
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    const voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;
    const modelId = import.meta.env.VITE_ELEVENLABS_MODEL_ID || DEFAULT_MODEL_ID;

    console.log('🎤 Speaking:', text);
    setIsSpeaking(true);
    setError(null);

    try {
      // If no API key, fall back to browser speech synthesis
      if (!apiKey) {
        console.log('📢 No API key: Using browser Speech Synthesis');

        // Fallback to browser speech synthesis
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;

        utterance.onstart = () => {
          console.log('🔊 Speech started');
          if (onAudioStart) {
            onAudioStart();
          }
        };

        utterance.onend = () => {
          console.log('✅ Finished speaking');
          setIsSpeaking(false);
        };

        utterance.onerror = (e) => {
          console.error('❌ Speech synthesis error:', e);
          setError('Failed to synthesize speech');
          setIsSpeaking(false);
        };

        speechSynthesis.speak(utterance);
        return;
      }

      // Actual ElevenLabs API call
      const response = await fetch(`${ELEVENLABS_API_URL}/${voiceId}`, {
        method: 'POST',
        headers: {
          Accept: 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: modelId,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      console.log('✅ Audio received from ElevenLabs');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      await new Promise<void>((resolve, reject) => {
        audio.onended = () => {
          console.log('✅ Finished speaking');
          URL.revokeObjectURL(audioUrl);
          resolve();
        };

        audio.onerror = (e) => {
          console.error('❌ Audio playback error:', e);
          setError('Failed to play audio');
          reject(e);
        };

        audio.onplay = () => {
          console.log('🔊 Audio started playing');
          if (onAudioStart) {
            onAudioStart();
          }
        };

        audio.play().catch(reject);
      });

      setIsSpeaking(false);
    } catch (err) {
      console.error('❌ Speech synthesis error:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to generate speech'
      );
      setIsSpeaking(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }

    // Also stop browser speech synthesis
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    error,
  };
}
