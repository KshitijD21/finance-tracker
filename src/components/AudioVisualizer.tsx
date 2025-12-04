import { useEffect, useRef } from "react";
import { useAudioVisualization } from "@/hooks/useAudioVisualization";

interface AudioVisualizerProps {
  audioStream: MediaStream | null;
  isActive: boolean;
}

export function AudioVisualizer({
  audioStream,
  isActive,
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { getFrequencyData } = useAudioVisualization(audioStream);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const draw = () => {
      const frequencyData = getFrequencyData();
      if (!frequencyData) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Create gradient
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.min(width, height) / 2
      );
      gradient.addColorStop(0, "rgba(16, 185, 129, 0.8)");
      gradient.addColorStop(0.5, "rgba(16, 185, 129, 0.4)");
      gradient.addColorStop(1, "rgba(16, 185, 129, 0.1)");

      // Calculate average amplitude
      const average =
        frequencyData.reduce((sum, value) => sum + value, 0) /
        frequencyData.length;
      const normalizedAverage = average / 255;

      // Draw pulsing circle
      const baseRadius = 30;
      const pulseRadius = baseRadius + normalizedAverage * 20;

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, pulseRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw frequency bars around the circle
      const barCount = 32;
      const angleStep = (Math.PI * 2) / barCount;

      for (let i = 0; i < barCount; i++) {
        const angle = angleStep * i;
        const freqIndex = Math.floor((i / barCount) * frequencyData.length);
        const amplitude = frequencyData[freqIndex] / 255;

        const barLength = amplitude * 15;
        const startX = width / 2 + Math.cos(angle) * (baseRadius + 5);
        const startY = height / 2 + Math.sin(angle) * (baseRadius + 5);
        const endX = width / 2 + Math.cos(angle) * (baseRadius + 5 + barLength);
        const endY =
          height / 2 + Math.sin(angle) * (baseRadius + 5 + barLength);

        ctx.strokeStyle = `rgba(16, 185, 129, ${0.3 + amplitude * 0.7})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive, getFrequencyData]);

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={120}
      className="absolute inset-0"
    />
  );
}
