import { useEffect, useState, useRef } from "react";
import { Search, ThumbsUp, Shield, Sparkles, CheckCircle2, ShieldCheck, Key } from "lucide-react";

function hasBeenShown(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

export function SplashScreen({
  onComplete,
  forceShow = false,
  variant = "general",
}: {
  onComplete?: () => void;
  forceShow?: boolean;
  variant?: "general" | "admin";
}) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const storageKey = variant === "admin" ? "ug_admin_splash_shown" : "ug_splash_shown";

  // Start hidden on SSR; the client useEffect below decides whether to show
  const [hidden, setHidden] = useState(true);
  const [stage, setStage] = useState<"enter" | "scanning" | "resolved" | "dismiss">("enter");
  const [checked, setChecked] = useState(false);

  // Client-only hydration-safe check
  useEffect(() => {
    if (forceShow) {
      setHidden(false);
    } else if (hasBeenShown(storageKey)) {
      setHidden(true);
      if (onCompleteRef.current) onCompleteRef.current();
    } else {
      setHidden(false);
    }
    setChecked(true);
  }, [forceShow, storageKey]);

  // Animation + auto-dismiss timer
  useEffect(() => {
    if (!checked || hidden) return;

    // Mark as shown so it never appears again
    try {
      localStorage.setItem(storageKey, "true");
    } catch {
      // storage fallback
    }

    const t1 = setTimeout(() => setStage("scanning"), 400);
    const t2 = setTimeout(() => setStage("resolved"), 1800);
    const t3 = setTimeout(() => setStage("dismiss"), 2900);
    const t4 = setTimeout(() => {
      setHidden(true);
      if (onCompleteRef.current) onCompleteRef.current();
    }, 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [checked, hidden, storageKey]);

  if (hidden) return null;

  const isAdmin = variant === "admin";

  const handleDismissEarly = () => {
    setHidden(true);
    if (onCompleteRef.current) onCompleteRef.current();
  };

  return (
    <div
      onClick={handleDismissEarly}
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-[#0b092b] text-white select-none transition-all duration-600 ease-in-out transform-gpu cursor-pointer ${
        stage === "dismiss" ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Top Formal Gold Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-ug-gold/20 via-ug-gold to-ug-gold/20 shadow-[0_0_15px_rgba(197,165,90,0.8)]" />

      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1B1754]/90 via-[#0b092b] to-black pointer-events-none" />

      {/* Center Container */}
      <div className="relative z-10 my-auto flex flex-col items-center px-6 text-center max-w-lg w-full">
        {/* Crest Badge */}
        <div className="relative mb-6 flex flex-col items-center">
          <div
            className={`relative flex h-22 w-22 items-center justify-center rounded-2xl border p-4 transition-all duration-500 ease-in-out transform-gpu ${
              stage === "resolved"
                ? "border-ug-gold bg-gradient-to-b from-ug-gold/25 via-ug-navy to-ug-navy/90 shadow-[0_0_35px_rgba(197,165,90,0.6)] scale-105"
                : "border-ug-gold/40 bg-ug-navy/80 shadow-lg scale-100"
            }`}
          >
            {isAdmin ? (
              <ShieldCheck
                className={`h-11 w-11 text-ug-gold transition-all duration-500 ${
                  stage === "scanning" ? "scale-110 animate-pulse" : "scale-100"
                }`}
              />
            ) : (
              <>
                <Search
                  className={`h-10 w-10 text-ug-gold transition-all duration-500 ease-in-out transform-gpu absolute ${
                    stage === "resolved"
                      ? "opacity-0 scale-50 rotate-90 pointer-events-none"
                      : "opacity-100 scale-100 rotate-0"
                  } ${stage === "scanning" ? "animate-pulse" : ""}`}
                />
                <ThumbsUp
                  className={`h-11 w-11 text-ug-gold transition-all duration-500 ease-in-out transform-gpu absolute drop-shadow-[0_0_10px_rgba(197,165,90,0.8)] ${
                    stage === "resolved"
                      ? "opacity-100 scale-100 rotate-0"
                      : "opacity-0 scale-50 -rotate-45 pointer-events-none"
                  }`}
                />
              </>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs font-bold tracking-widest text-ug-gold uppercase">
            {isAdmin ? <Key className="h-3.5 w-3.5" /> : <Shield className="h-3.5 w-3.5" />}
            <span>{isAdmin ? "University of Ghana — Portal" : "University of Ghana"}</span>
          </div>
        </div>

        {/* Title Block */}
        <div className="w-full">
          {isAdmin ? (
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Admin &amp; Security <span className="text-ug-gold">Portal</span>
            </h1>
          ) : (
            <h1 className="flex items-center justify-center gap-3 text-3xl sm:text-5xl font-bold tracking-tight">
              <span className="relative flex items-center justify-center font-playfair min-h-[48px]">
                <span
                  className={`transition-all duration-500 ease-in-out transform-gpu text-white ${
                    stage === "resolved"
                      ? "opacity-0 -translate-y-3 absolute pointer-events-none"
                      : "opacity-100 translate-y-0 relative"
                  }`}
                >
                  Lost
                </span>
                <span
                  className={`transition-all duration-500 ease-in-out transform-gpu text-ug-gold font-bold ${
                    stage === "resolved"
                      ? "opacity-100 translate-y-0 relative"
                      : "opacity-0 translate-y-3 absolute pointer-events-none"
                  }`}
                >
                  Recovered
                </span>
              </span>

              <span className="text-ug-gold/90 font-serif font-light text-2xl sm:text-4xl">
                &amp;
              </span>
              <span className="font-playfair text-white">Found</span>
            </h1>
          )}

          <p className="mt-2 text-xs font-semibold tracking-wider text-white/50 uppercase">
            {isAdmin
              ? "Claim Moderation & Handover Control Center"
              : "Official Campus Lost & Found Register"}
          </p>
        </div>

        {/* Progress Line */}
        <div className="mt-7 w-full max-w-xs overflow-hidden rounded-full bg-white/10 h-1 relative">
          <div
            className={`h-full bg-gradient-to-r from-ug-gold/50 via-ug-gold to-yellow-200 transition-all duration-700 ease-out ${
              stage === "enter"
                ? "w-0 opacity-30"
                : stage === "scanning"
                  ? "w-3/4 opacity-80"
                  : "w-full opacity-100 shadow-[0_0_10px_rgba(197,165,90,0.8)]"
            }`}
          />
        </div>

        {/* Status Text */}
        <div className="mt-3.5 h-6 flex items-center justify-center">
          {stage === "resolved" ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ug-gold animate-fade-in">
              <CheckCircle2 className="h-4 w-4 text-ug-gold" />
              {isAdmin ? "Admin Security Verified" : "Verification Complete &bull; Item Recovered"}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/70">
              <Sparkles className="h-3.5 w-3.5 text-ug-gold animate-pulse" />
              {isAdmin ? "Loading Audit Logs & Claims..." : "Verifying Campus Database..."}
            </span>
          )}
        </div>

        <div className="mt-4 text-[10px] font-medium text-white/30">Click anywhere to skip</div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-8 flex flex-col items-center gap-1">
        <div className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
          INTEGRI PROCEDAM &bull; UNIVERSITY OF GHANA
        </div>
        <div className="h-1 w-12 bg-ug-gold/40 rounded-full mt-1" />
      </div>

      <div className="h-1.5 w-full bg-gradient-to-r from-ug-gold/20 via-ug-gold to-ug-gold/20 shadow-[0_0_15px_rgba(197,165,90,0.8)]" />
    </div>
  );
}
