import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Square, Play, Pause, Upload, Loader2 } from "lucide-react";
import { adminFetch } from "@/lib/admin-auth";

interface CallRecorderProps {
  callSessionId: number | null;
  onRecordingComplete: (audioBlob: Blob, durationSeconds: number) => void;
  onTimerUpdate?: (seconds: number) => void;
  disabled?: boolean;
}

export default function CallRecorder({ callSessionId, onRecordingComplete, onTimerUpdate, disabled }: CallRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [micPermission, setMicPermission] = useState<"granted" | "denied" | "prompt">("prompt");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check mic permission on mount
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "microphone" as PermissionName }).then((result) => {
        setMicPermission(result.state as "granted" | "denied" | "prompt");
        result.onchange = () => setMicPermission(result.state as "granted" | "denied" | "prompt");
      }).catch(() => {
        // Permissions API may not support microphone query
      });
    }
  }, []);

  // Timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          onTimerUpdate?.(next);
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused, onTimerUpdate]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      });
      streamRef.current = stream;
      setMicPermission("granted");

      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType });
        setAudioBlob(blob);
        // Clean up stream
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setIsPaused(false);
      setElapsedSeconds(0);
      setAudioBlob(null);
    } catch (err: any) {
      console.error("Failed to start recording:", err);
      if (err.name === "NotAllowedError") {
        setMicPermission("denied");
      }
    }
  }, []);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  }, []);

  const handleSubmitRecording = useCallback(() => {
    if (audioBlob) {
      onRecordingComplete(audioBlob, elapsedSeconds);
    }
  }, [audioBlob, elapsedSeconds, onRecordingComplete]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <Card>
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-base flex items-center gap-2">
          {isRecording ? (
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              {isPaused ? "Paused" : "Recording"}
            </span>
          ) : audioBlob ? (
            "Recording Complete"
          ) : (
            "Audio Recorder"
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {micPermission === "denied" && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            Microphone access denied. Please allow microphone access in your browser settings.
          </div>
        )}

        {/* Timer display */}
        <div className="text-center mb-4">
          <p className={`text-4xl font-mono font-bold tabular-nums ${isRecording && !isPaused ? "text-red-600" : "text-slate-700"}`}>
            {formatTime(elapsedSeconds)}
          </p>
          {isRecording && (
            <p className="text-xs text-slate-500 mt-1">
              {isPaused ? "Recording paused" : "Recording in progress..."}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          {!isRecording && !audioBlob && (
            <Button
              onClick={startRecording}
              disabled={disabled || micPermission === "denied"}
              className="gap-2 bg-red-600 hover:bg-red-700"
              size="lg"
            >
              <Mic className="w-5 h-5" />
              Start Recording
            </Button>
          )}

          {isRecording && (
            <>
              {isPaused ? (
                <Button onClick={resumeRecording} variant="outline" size="lg" className="gap-2">
                  <Play className="w-5 h-5" />
                  Resume
                </Button>
              ) : (
                <Button onClick={pauseRecording} variant="outline" size="lg" className="gap-2">
                  <Pause className="w-5 h-5" />
                  Pause
                </Button>
              )}
              <Button onClick={stopRecording} variant="destructive" size="lg" className="gap-2">
                <Square className="w-4 h-4" />
                Stop
              </Button>
            </>
          )}

          {audioBlob && !isRecording && (
            <>
              <Button onClick={startRecording} variant="outline" size="lg" className="gap-2">
                <Mic className="w-5 h-5" />
                Re-record
              </Button>
              <Button onClick={handleSubmitRecording} size="lg" className="gap-2">
                <Upload className="w-5 h-5" />
                Submit Recording
              </Button>
            </>
          )}
        </div>

        {audioBlob && !isRecording && (
          <p className="text-xs text-slate-500 text-center mt-3">
            Duration: {formatTime(elapsedSeconds)} &middot; Size: {(audioBlob.size / 1024 / 1024).toFixed(1)} MB
          </p>
        )}
      </CardContent>
    </Card>
  );
}
