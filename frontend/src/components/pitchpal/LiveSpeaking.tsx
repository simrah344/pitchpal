import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Mic,
  Square,
  Video,
  PersonStanding,
  Eye,
  Smile,
  AudioLines,
  Gauge,
} from "lucide-react";

type Status = "good" | "warn";

export interface LiveFeedbackData {
  text: string;
  posture_status: string;
  eye_contact: string;
  confidence: string;
  clarity: string;
  speed: string;
  fillers?: number;
  wps?: number;
}

export interface FinalReport {
  summary: string;
  overall_score: number;
  body_score: number;
  speech_score: number;
  content_score: number;
  confidence_score: number;
  suggestions: string[];
}

interface MetricDisplay {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  key: keyof Pick<LiveFeedbackData, "posture_status" | "eye_contact" | "confidence" | "clarity" | "speed">;
  goodValues: string[];
}

const METRIC_DEFS: MetricDisplay[] = [
  { icon: PersonStanding, label: "Posture", key: "posture_status", goodValues: ["Upright", "Good"] },
  { icon: Eye, label: "Eye Contact", key: "eye_contact", goodValues: ["Good"] },
  { icon: Smile, label: "Confidence", key: "confidence", goodValues: ["Strong"] },
  { icon: AudioLines, label: "Speech Clarity", key: "clarity", goodValues: ["Clear"] },
  { icon: Gauge, label: "Speaking Speed", key: "speed", goodValues: ["Good"] },
];

function StatusBadge({ status, value }: { status: Status; value: string }) {
  const good = status === "good";
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold " +
        (good
          ? "bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/30"
          : "bg-orange-500/15 text-orange-700 ring-1 ring-orange-500/30")
      }
    >
      <span
        className={
          "h-1.5 w-1.5 rounded-full " +
          (good ? "bg-emerald-500" : "bg-orange-500 animate-pulse")
        }
      />
      {value}
    </span>
  );
}

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

function useSpeechRecognition() {
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  const start = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalParts = "";
      let interimParts = "";

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalParts += result[0].transcript + " ";
        } else {
          interimParts += result[0].transcript;
        }
      }

      setTranscript(finalParts.trim());
      setInterimText(interimParts);
    };

    recognition.onerror = (e: any) => {
      if (e.error !== "aborted") {
        console.warn("Speech recognition error:", e.error);
      }
    };

    recognition.onend = () => {
      if (recognitionRef.current) {
        try {
          recognition.start();
        } catch {
          // ignore
        }
      }
    };

    recognitionRef.current = recognition;
    setTranscript("");
    setInterimText("");
    setIsListening(true);

    try {
      recognition.start();
    } catch {
      // ignore
    }
  }, []);

  const stop = useCallback(() => {
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }, []);

  return { transcript, interimText, isListening, supported, start, stop };
}

export function LiveSpeaking({
  topic,
  onAnalyze,
  onFinalReport,
}: {
  topic: string;
  onAnalyze: () => void;
  onFinalReport: (report: FinalReport) => void;
}) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [liveData, setLiveData] = useState<LiveFeedbackData | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const speech = useSpeechRecognition();
  const transcriptBoxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Timer
  useEffect(() => {
    if (recording) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [recording]);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptBoxRef.current) {
      transcriptBoxRef.current.scrollTop = transcriptBoxRef.current.scrollHeight;
    }
  }, [speech.transcript, speech.interimText]);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera/mic access denied:", err);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startPolling = () => {
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/live-feedback");

        if (res.ok) {
          const data = await res.json();
        
        //if (data.status === "stopped") return;  
        if (data.posture === "Idle") return;

        setLiveData({
          posture_status: data.posture,
          eye_contact: data.eye_contact,
          confidence: data.confidence,
          clarity: data.clarity,
          speed: data.speed,
          text: data.transcript,
        });
      }
      } catch {
        // silently ignore polling errors
      }
    }, 3000);
  };


  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const start = async () => {
  setSeconds(0);
  setLiveData(null);
  setRecording(true);
  try {
    await fetch("http://127.0.0.1:8000/start-session", {
      method: "POST",
    });
  } catch (err) {
    console.error("Failed to start backend session", err);
  }

  speech.start();
  await startCamera();
  startPolling();
  };

  const stop = async () => {
    setRecording(false);
    speech.stop();
    stopCamera();
    stopPolling();

    // Call stop-session endpoint
    try {
      const res = await fetch("http://127.0.0.1:8000/stop-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          transcript: speech.transcript,
          duration: seconds,
        }),
      });
      if (res.ok) {
        const report: FinalReport = await res.json();
        onFinalReport(report);
      }
    } catch (err) {
      console.error("Failed to fetch final report:", err);
    }

    onAnalyze();
  };

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const displayTranscript = speech.transcript || (liveData?.text ?? "");
  const displayInterim = speech.interimText || "";

  const hasCamera = !!streamRef.current;

  return (
    <section id="practice" className="py-20">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
            Live Speaking Studio
          </h2>
          <p className="mt-3 text-muted-foreground">
            {topic
              ? `Topic: "${topic}"`
              : "Pick a topic above, then start your live practice session."}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* LEFT — Camera */}
          <div className="lg:col-span-3">
            <div className="glass rounded-[2rem] p-4 md:p-5 shadow-elegant">
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 to-primary-glow/80 flex items-center justify-center">
                {/* Live video feed */}
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className={
                    "absolute inset-0 w-full h-full object-cover rounded-2xl " +
                    (recording ? "block" : "hidden")
                  }
                />

                {/* Placeholder when not recording */}
                {!recording && (
                  <>
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_60%)]" />
                    <div className="relative z-10 text-center text-primary-foreground">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                        <Video className="h-10 w-10" />
                      </div>
                      <p className="text-lg font-medium opacity-90">
                        Live Camera / Recording Area
                      </p>
                      <p className="mt-1 text-sm opacity-70">
                        Your live preview will appear here
                      </p>
                    </div>
                  </>
                )}

                {recording && (
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full bg-destructive/90 px-3 py-1.5 text-sm font-semibold text-destructive-foreground">
                    <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse-ring" />
                    REC {fmt(seconds)}
                  </div>
                )}
              </div>

              {/* Recording controls */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <Button
                  variant="moonstone"
                  size="lg"
                  onClick={start}
                  disabled={recording}
                >
                  <Mic className="h-5 w-5" />
                  Start Recording
                </Button>
                <Button
                  variant="white"
                  size="lg"
                  onClick={stop}
                  disabled={!recording}
                >
                  <Square className="h-5 w-5" />
                  Stop Recording
                </Button>
              </div>

              {/* Optional extra metrics */}
              {recording && liveData && (liveData.wps !== undefined || liveData.fillers !== undefined) && (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                  {liveData.wps !== undefined && (
                    <span>Words/sec: <strong className="text-primary">{liveData.wps.toFixed(1)}</strong></span>
                  )}
                  {liveData.fillers !== undefined && (
                    <span>Fillers: <strong className="text-primary">{liveData.fillers}</strong></span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Live feedback + transcript */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="glass rounded-3xl p-6 shadow-elegant">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl font-bold text-primary">
                  Real-Time Feedback
                </h3>
                <span
                  className={
                    "text-xs font-semibold uppercase tracking-wider " +
                    (recording ? "text-emerald-600" : "text-muted-foreground")
                  }
                >
                  {recording ? "● Live" : "Idle"}
                </span>
              </div>
              <ul className="space-y-3">
                {METRIC_DEFS.map(({ icon: Icon, label, key, goodValues }) => {
                  const value = liveData ? (liveData[key] as string) : "—";
                  const status: Status =
                    liveData && goodValues.includes(liveData[key] as string)
                      ? "good"
                      : liveData
                        ? "warn"
                        : "good";
                  return (
                    <li
                      key={label}
                      className="flex items-center justify-between rounded-xl bg-white/70 px-4 py-3 ring-1 ring-white/60"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-soft">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-primary">{label}</span>
                      </div>
                      <StatusBadge status={status} value={value} />
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="glass rounded-3xl p-6 shadow-elegant">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-lg font-bold text-primary">
                  Live Transcript
                </h3>
                {recording && (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Transcribing
                  </span>
                )}
              </div>
              <div
                ref={transcriptBoxRef}
                className="min-h-[110px] max-h-[200px] overflow-y-auto rounded-xl bg-white/70 ring-1 ring-white/60 p-4 text-sm leading-relaxed text-foreground/80"
              >
                {!recording && !displayTranscript && (
                  <span className="text-muted-foreground">
                    {!speech.supported
                      ? "Speech recognition is not supported in this browser. Please use Chrome or Edge."
                      : "Press Start Recording to begin live transcription."}
                  </span>
                )}
                {displayTranscript && <span>{displayTranscript} </span>}
                {displayInterim && (
                  <span className="text-muted-foreground/60">{displayInterim}</span>
                )}
                {recording && (
                  <span className="ml-1 inline-block h-4 w-1 align-middle bg-primary animate-pulse" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
