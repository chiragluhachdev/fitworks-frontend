"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  MapPin,
  Maximize2,
} from "lucide-react";

/**
 * A twenty-second explainer of how FitWorks hires for a gym.
 *
 * Drawn rather than filmed: three animated scenes in CSS and SVG over real
 * photography. That keeps it a few kilobytes instead of a few megabytes, it
 * stays sharp at any size, and the copy can be corrected without re-recording.
 *
 * It behaves like a video because that is what people expect of it — a chapter
 * scrubber, play/pause, arrows, and a replay at the end.
 */

/* Stock portraits already used elsewhere on the site for placeholder trainers. */
const FACES = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
];

const face = (i: number, w = 160) => `${FACES[i]}?w=${w}&h=${w}&fit=crop&crop=faces&auto=format&q=80`;
const GYM_PHOTO =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop&auto=format&q=80";

/**
 * The FitWorks wordmark on a light pill, so it reads on the dark stage.
 *
 * A pill rather than a square: the logo is a wordmark with a tagline under it,
 * and squeezing that into a 60px box turns the tagline into grey mush.
 */
function Mark({ width = 116 }: { width?: number }) {
  return (
    <span
      className="relative flex items-center justify-center rounded-2xl bg-white px-3.5 py-2.5 shadow-[0_12px_44px_-10px_rgba(233,46,61,0.6)] ring-1 ring-white/25"
      style={{ width }}
    >
      <Image
        src="/images/logo.png"
        alt="FitWorks"
        width={width - 28}
        height={Math.round((width - 28) / 3.6)}
        className="object-contain"
        priority
      />
    </span>
  );
}

function Portrait({ src, size = 52 }: { src: string; size?: number }) {
  return (
    <span
      className="relative block rounded-full overflow-hidden ring-2 ring-white/70 shadow-[0_6px_20px_-6px_rgba(0,0,0,0.6)]"
      style={{ width: size, height: size }}
    >
      <Image src={src} alt="" fill sizes="64px" className="object-cover" />
    </span>
  );
}

interface Scene {
  id: string;
  chapter: string;
  title: string;
  caption: string;
  ms: number;
  Body: React.FC;
}

/* ─────────────────────────── Scene 1 ─────────────────────────── */

const FIELDS = [
  { label: "Role", value: "Senior Personal Trainer" },
  { label: "Location", value: "Indiranagar, Bangalore" },
  { label: "Salary", value: "₹30,000 – ₹45,000" },
];

function PostScene() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className="fw-anim fw-handoff w-[236px] rounded-2xl bg-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] p-4"
        style={{ animationDelay: "0ms" }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10.5px] font-extrabold text-gray-900 tracking-tight">New vacancy</span>
          <span className="text-[8.5px] font-bold uppercase tracking-[0.12em] text-gray-300">Draft</span>
        </div>

        <div className="space-y-2.5">
          {FIELDS.map((f, i) => (
            <div key={f.label}>
              <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-1">
                {f.label}
              </p>
              <div className="h-[26px] rounded-lg bg-gray-50 ring-1 ring-gray-200/80 overflow-hidden relative">
                <span
                  className="fw-anim fw-type absolute inset-y-0 left-0 flex items-center pl-2 text-[9.5px] font-semibold text-gray-800 whitespace-nowrap"
                  style={{ animationDelay: `${450 + i * 520}ms` }}
                >
                  {f.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div
          className="fw-anim fw-press mt-4 h-8 rounded-lg bg-[#E92E3D] text-white text-[10px] font-extrabold flex items-center justify-center shadow-[0_6px_18px_-6px_rgba(233,46,61,0.9)]"
          style={{ animationDelay: "2200ms" }}
        >
          Post Vacancy
        </div>
      </div>

      {/* It arrives with us. */}
      <div
        className="fw-anim fw-receive absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ animationDelay: "3300ms" }}
      >
        <Mark />
      </div>
    </div>
  );
}

/* ─────────────────────────── Scene 2 ─────────────────────────── */

const RING = [
  { i: 0, keep: true },
  { i: 1, keep: false },
  { i: 2, keep: true },
  { i: 3, keep: false },
  { i: 4, keep: true },
  { i: 5, keep: false },
];

function SearchScene() {
  const radius = 98;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* The orbit they arrive on. */}
      <span
        className="absolute left-1/2 top-1/2 rounded-full border border-white/[0.07]"
        style={{ width: radius * 2, height: radius * 2, marginLeft: -radius, marginTop: -radius }}
      />

      <span className="fw-anim fw-halo absolute left-1/2 top-1/2 w-[116px] h-[46px] -ml-[58px] -mt-[23px] rounded-2xl border border-[#E92E3D]/40" />
      <span
        className="fw-anim fw-halo absolute left-1/2 top-1/2 w-[116px] h-[46px] -ml-[58px] -mt-[23px] rounded-2xl border border-[#E92E3D]/40"
        style={{ animationDelay: "1100ms" }}
      />

      <div className="relative z-20">
        <Mark />
      </div>

      {RING.map(({ i, keep }, idx) => {
        const angle = (idx / RING.length) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return (
          <div
            key={i}
            className={`fw-anim absolute left-1/2 top-1/2 z-10 ${keep ? "fw-keep" : "fw-drop"}`}
            style={{
              ["--fw-x" as string]: `${x}px`,
              ["--fw-y" as string]: `${y}px`,
              animationDelay: `${250 + idx * 130}ms`,
            }}
          >
            <span className="relative block -ml-[26px] -mt-[26px]">
              <Portrait src={face(i)} />
              {keep && (
                <span
                  className="fw-anim fw-pop absolute -right-1 -bottom-0.5 w-[18px] h-[18px] rounded-full bg-emerald-500 ring-2 ring-[#101014] flex items-center justify-center"
                  style={{ animationDelay: `${2100 + idx * 110}ms` }}
                >
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />
                </span>
              )}
            </span>
          </div>
        );
      })}

      {/* The sweep that does the checking. */}
      <span
        className="fw-anim fw-sweep absolute left-1/2 top-1/2 rounded-full"
        style={{
          width: radius * 2 + 56,
          height: radius * 2 + 56,
          marginLeft: -(radius + 28),
          marginTop: -(radius + 28),
          animationDelay: "1600ms",
        }}
      />
    </div>
  );
}

/* ─────────────────────────── Scene 3 ─────────────────────────── */

function ConnectScene() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div className="relative flex items-center gap-[92px]">
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none overflow-visible"
          width="188"
          height="10"
          viewBox="0 0 188 10"
          fill="none"
          aria-hidden
        >
          <path
            d="M6 5 H182"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M6 5 H182"
            stroke="#E92E3D"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="176"
            className="fw-anim fw-draw"
            style={{ animationDelay: "500ms" }}
          />
          <circle
            r="3.5"
            fill="#fff"
            className="fw-anim fw-travel"
            style={{ animationDelay: "500ms" }}
            cy="5"
          />
        </svg>

        <div className="fw-anim fw-slide-in-l relative z-10 flex flex-col items-center gap-2.5">
          <span className="relative w-[62px] h-[62px] rounded-2xl overflow-hidden ring-2 ring-white/70 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]">
            <Image src={GYM_PHOTO} alt="" fill sizes="80px" className="object-cover" />
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white/70">
            <MapPin className="w-2.5 h-2.5" /> Your gym
          </span>
        </div>

        <div className="fw-anim fw-slide-in-r relative z-10 flex flex-col items-center gap-2.5">
          <span className="relative block">
            <Portrait src={face(0, 200)} size={62} />
            <span
              className="fw-anim fw-pop absolute -right-1 -bottom-0.5 w-[20px] h-[20px] rounded-full bg-emerald-500 ring-2 ring-[#101014] flex items-center justify-center"
              style={{ animationDelay: "1700ms" }}
            >
              <Check className="w-3 h-3 text-white" strokeWidth={4} />
            </span>
          </span>
          <span className="text-[10px] font-bold text-white/70">Verified trainer</span>
        </div>
      </div>

      <div
        className="fw-anim fw-rise mt-9 px-4 py-1.5 rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/40 text-emerald-300 text-[11px] font-extrabold tracking-wide"
        style={{ animationDelay: "2400ms" }}
      >
        Hired
      </div>
    </div>
  );
}

/* ─────────────────────────── Scenes ─────────────────────────── */

const SCENES: Scene[] = [
  {
    id: "post",
    chapter: "Step 1",
    title: "Post your vacancy",
    caption: "Tell us the role, the experience you want and what you're paying. About a minute.",
    ms: 6000,
    Body: PostScene,
  },
  {
    id: "search",
    chapter: "Step 2",
    title: "We find suitable trainers",
    caption: "Our team searches the network, checks every certificate and speaks to each trainer.",
    ms: 6800,
    Body: SearchScene,
  },
  {
    id: "connect",
    chapter: "Step 3",
    title: "Connect & hire",
    caption: "We introduce you to the ones worth meeting, and stay with you until the role is filled.",
    ms: 5800,
    Body: ConnectScene,
  },
];

/* ─────────────────────── Shared clock & pieces ─────────────────────── */

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

/**
 * Drives the scene sequence.
 *
 * Shared by the modal and the inline card so there is one definition of how
 * long a scene runs and what happens at the end of one.
 */
function useSceneClock({ active, loop }: { active: boolean; loop: boolean }) {
  const [scene, setScene] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [ended, setEnded] = useState(false);
  const reduced = useReducedMotion();

  // The bar renders from state; the clock resumes from the ref. One setter
  // keeps them from drifting apart.
  const progressRef = useRef(0);
  const setProgressBoth = useCallback((p: number) => {
    progressRef.current = p;
    setProgress(p);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setScene(index);
      setProgressBoth(0);
      setEnded(false);
    },
    [setProgressBoth]
  );

  // Every activation starts from the beginning and plays.
  useEffect(() => {
    if (active) {
      goTo(0);
      setPlaying(true);
    }
  }, [active, goTo]);

  useEffect(() => {
    if (!active || !playing || ended || reduced) return;

    const duration = SCENES[scene].ms;
    let frame = 0;
    let origin: number | null = null;

    const tick = (t: number) => {
      // Resume from wherever we paused rather than restarting the scene.
      if (origin === null) origin = t - progressRef.current * duration;
      const p = Math.min(1, (t - origin) / duration);
      setProgressBoth(p);

      if (p < 1) {
        frame = requestAnimationFrame(tick);
      } else if (scene < SCENES.length - 1) {
        goTo(scene + 1);
      } else if (loop) {
        goTo(0);
      } else {
        setEnded(true);
        setPlaying(false);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, playing, scene, ended, reduced, loop, goTo, setProgressBoth]);

  return { scene, progress, playing, setPlaying, ended, reduced, goTo };
}

/** Chapter segments. Clickable when the caller has somewhere to jump to. */
function Scrubber({
  scene,
  progress,
  playing,
  onJump,
}: {
  scene: number;
  progress: number;
  playing: boolean;
  onJump?: (index: number) => void;
}) {
  return (
    <div className="flex gap-1.5">
      {SCENES.map((s, i) => {
        const fill = (
          <span
            className="block h-full bg-white rounded-full"
            style={{
              width: i < scene ? "100%" : i === scene ? `${progress * 100}%` : "0%",
              transition: i === scene && !playing ? "width 150ms linear" : "none",
            }}
          />
        );
        const shell = "flex-1 h-[3px] rounded-full bg-white/15 overflow-hidden";

        return onJump ? (
          <button
            key={s.id}
            onClick={() => onJump(i)}
            aria-label={`${s.chapter}: ${s.title}`}
            className={`${shell} cursor-pointer`}
          >
            {fill}
          </button>
        ) : (
          <span key={s.id} className={shell} aria-hidden>
            {fill}
          </span>
        );
      })}
    </div>
  );
}

/** The lit box the scenes play in. */
function Stage({ scene, ended, className = "" }: { scene: number; ended: boolean; className?: string }) {
  const current = SCENES[scene];
  const Body = current.Body;

  return (
    <div
      key={`${current.id}-${ended ? "end" : "run"}`}
      className={`relative overflow-hidden rounded-[20px] bg-[#101014] ring-1 ring-white/[0.06] ${className}`}
    >
      {/* One warm light source behind everything. */}
      <span
        aria-hidden
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[320px] h-[320px] rounded-full bg-[#E92E3D] opacity-[0.16] blur-[70px] pointer-events-none"
      />
      <span
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: "inset 0 0 90px 20px rgba(0,0,0,0.55)" }}
      />
      <Body />
    </div>
  );
}

/* ─────────────────────────── Inline card ─────────────────────────── */

/**
 * The explainer playing in place, on loop.
 *
 * Meant for a panel that would otherwise hold the same three steps as text.
 * It pauses itself when scrolled out of view — an animation nobody is looking
 * at should not be spending their battery — and hands off to the modal for
 * anyone who wants the transport controls.
 */
export function HowItWorksInline({
  onExpand,
  className = "",
}: {
  onExpand?: () => void;
  className?: string;
}) {
  const [visible, setVisible] = useState(true);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.25,
    });
    io.observe(host);
    return () => io.disconnect();
  }, []);

  const { scene, progress, playing, ended, goTo } = useSceneClock({ active: visible, loop: true });
  const current = SCENES[scene];

  return (
    <div ref={hostRef} className={`flex flex-col ${className}`}>
      <style>{KEYFRAMES}</style>

      <div className="rounded-[20px] bg-[#0b0b0d] p-3">
        {/* The orbit in step two spans 2 × (radius + half an avatar) — 248px —
            so anything shorter clips the top and bottom faces. */}
        <Stage scene={scene} ended={ended} className="h-[300px]" />
        <div className="px-1 pt-3">
          <Scrubber scene={scene} progress={progress} playing={playing} onJump={goTo} />
        </div>

        <div key={`inline-cap-${current.id}`} className="fw-anim fw-cap px-1 pt-3.5 pb-1.5 min-h-[92px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#E92E3D]">
            {current.chapter}
          </p>
          <h3 className="text-[15px] font-extrabold text-white tracking-[-0.01em] mt-1">
            {current.title}
          </h3>
          <p className="text-[12px] text-white/55 leading-relaxed mt-1">{current.caption}</p>
        </div>
      </div>

      {onExpand && (
        <button
          onClick={onExpand}
          className="mt-3 inline-flex items-center justify-center gap-2 h-10 rounded-xl text-[12.5px] font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" /> Watch full size
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────── Modal player ─────────────────────────── */

export default function HowItWorksPlayer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { scene, progress, playing, setPlaying, ended, reduced, goTo } = useSceneClock({
    active: open,
    loop: false,
  });

  /* ── Keyboard and scroll ── */
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      }
      if (e.key === "ArrowRight" && scene < SCENES.length - 1) goTo(scene + 1);
      if (e.key === "ArrowLeft" && scene > 0) goTo(scene - 1);
    };

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, scene, goTo, setPlaying]);

  if (!open) return null;

  const current = SCENES[scene];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="How FitWorks works"
    >
      <style>{KEYFRAMES}</style>

      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Dark, like a player. The stage is the brightest thing in the room. */}
      <div className="relative w-full sm:max-w-[480px] bg-[#0b0b0d] text-white rounded-t-[28px] sm:rounded-[28px] overflow-hidden ring-1 ring-white/10 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
        <div className="px-5 pt-5">
          <Scrubber scene={scene} progress={progress} playing={playing} onJump={goTo} />
        </div>

        <div className="flex items-center justify-between px-5 pt-3.5">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-white/40">
            How FitWorks works
          </p>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 -mr-1.5 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>

        <Stage scene={scene} ended={ended} className="h-[280px] sm:h-[300px] mx-4 mt-3" />

        <div key={`cap-${current.id}`} className="fw-anim fw-cap px-5 pt-5 pb-1 min-h-[108px]">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#E92E3D]">
            {current.chapter}
          </p>
          <h2 className="text-[20px] font-extrabold tracking-[-0.015em] mt-1.5">{current.title}</h2>
          <p className="text-[13px] text-white/55 leading-relaxed mt-1.5">{current.caption}</p>
        </div>

        <div className="flex items-center gap-2 px-4 pb-5 pt-2">
          <button
            onClick={() => goTo(Math.max(0, scene - 1))}
            disabled={scene === 0}
            aria-label="Previous step"
            className="w-11 h-11 rounded-xl ring-1 ring-white/15 text-white/70 flex items-center justify-center hover:bg-white/10 hover:text-white disabled:opacity-25 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-[18px] h-[18px]" />
          </button>

          {ended ? (
            <button
              onClick={() => {
                goTo(0);
                setPlaying(true);
              }}
              className="flex-1 h-11 rounded-xl bg-white text-gray-900 text-[13.5px] font-extrabold inline-flex items-center justify-center gap-2 hover:bg-white/90 active:scale-[0.99] transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Watch again
            </button>
          ) : (
            <button
              onClick={() => setPlaying((p) => !p)}
              disabled={reduced}
              className="flex-1 h-11 rounded-xl bg-[#E92E3D] text-white text-[13.5px] font-extrabold inline-flex items-center justify-center gap-2 hover:bg-[#d42936] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none shadow-[0_8px_24px_-10px_rgba(233,46,61,0.9)]"
            >
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              {playing ? "Pause" : "Play"}
            </button>
          )}

          <button
            onClick={() => goTo(Math.min(SCENES.length - 1, scene + 1))}
            disabled={scene === SCENES.length - 1}
            aria-label="Next step"
            className="w-11 h-11 rounded-xl ring-1 ring-white/15 text-white/70 flex items-center justify-center hover:bg-white/10 hover:text-white disabled:opacity-25 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronRight className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Scoped keyframes.
 *
 * Kept next to the scenes that use them rather than in globals.css — nothing
 * else on the site animates like this, and a stylesheet that only one modal
 * reads is easier to delete than to find.
 */
const KEYFRAMES = `
.fw-anim { animation-duration: 700ms; animation-fill-mode: both; animation-timing-function: cubic-bezier(.22,1,.36,1); }
@media (prefers-reduced-motion: reduce) { .fw-anim { animation: none !important; opacity: 1 !important; transform: none !important; } }

@keyframes fw-cap { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.fw-cap { animation-name: fw-cap; animation-duration: 450ms; }

@keyframes fw-rise { from { opacity: 0; transform: translateY(14px) scale(.94); } to { opacity: 1; transform: none; } }
.fw-rise { animation-name: fw-rise; }

@keyframes fw-type { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
.fw-type { animation-name: fw-type; animation-duration: 480ms; animation-timing-function: steps(20, end); }

@keyframes fw-press {
  0% { opacity:0; transform: scale(.92); }
  40% { opacity:1; transform: scale(1); }
  56% { transform: scale(.94); }
  100% { opacity:1; transform: scale(1); }
}
.fw-press { animation-name: fw-press; animation-duration: 900ms; }

/* The card is handed over: it lifts, tilts, then shrinks away into us. */
@keyframes fw-handoff {
  0% { opacity: 0; transform: translateY(18px) scale(.95); }
  14% { opacity: 1; transform: none; }
  72% { opacity: 1; transform: none; }
  100% { opacity: 0; transform: translateY(-34px) scale(.72) rotate(-4deg); }
}
.fw-handoff { animation-name: fw-handoff; animation-duration: 5000ms; animation-timing-function: cubic-bezier(.65,0,.35,1); }

@keyframes fw-receive {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(.5); }
  60% { opacity: 1; transform: translate(-50%, -50%) scale(1.06); }
  100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
.fw-receive { animation-name: fw-receive; animation-duration: 900ms; }

@keyframes fw-halo { 0% { opacity: .8; transform: scale(1); } 100% { opacity: 0; transform: scale(3.4); } }
.fw-halo { animation-name: fw-halo; animation-duration: 2200ms; animation-iteration-count: infinite; animation-timing-function: ease-out; }

@keyframes fw-keep {
  0% { opacity: 0; transform: translate(0,0) scale(.3); }
  32% { opacity: 1; transform: translate(var(--fw-x), var(--fw-y)) scale(1); }
  72% { transform: translate(var(--fw-x), var(--fw-y)) scale(1); }
  100% { opacity: 1; transform: translate(var(--fw-x), var(--fw-y)) scale(1.14); }
}
.fw-keep { animation-name: fw-keep; animation-duration: 3400ms; }

@keyframes fw-drop {
  0% { opacity: 0; transform: translate(0,0) scale(.3); }
  26% { opacity: 1; transform: translate(var(--fw-x), var(--fw-y)) scale(1); }
  62% { opacity: .95; filter: grayscale(0); }
  100% { opacity: .1; filter: grayscale(1); transform: translate(calc(var(--fw-x) * 1.3), calc(var(--fw-y) * 1.3)) scale(.82); }
}
.fw-drop { animation-name: fw-drop; animation-duration: 3400ms; }

@keyframes fw-sweep {
  0% { opacity: 0; transform: scale(.25); }
  35% { opacity: .9; }
  100% { opacity: 0; transform: scale(1.06); }
}
.fw-sweep { animation-name: fw-sweep; animation-duration: 1600ms; border: 1.5px solid rgba(233,46,61,.5); box-shadow: 0 0 34px rgba(233,46,61,.28); }

@keyframes fw-pop { 0% { opacity: 0; transform: scale(0); } 68% { transform: scale(1.3); } 100% { opacity: 1; transform: scale(1); } }
.fw-pop { animation-name: fw-pop; animation-duration: 420ms; }

@keyframes fw-draw { from { stroke-dashoffset: 176; } to { stroke-dashoffset: 0; } }
.fw-draw { animation-name: fw-draw; animation-duration: 1100ms; }

/* A pulse running along the line we just drew. */
@keyframes fw-travel {
  0% { opacity: 0; transform: translateX(6px); }
  12% { opacity: 1; }
  88% { opacity: 1; }
  100% { opacity: 0; transform: translateX(182px); }
}
.fw-travel { animation-name: fw-travel; animation-duration: 1300ms; animation-timing-function: cubic-bezier(.45,0,.55,1); }

@keyframes fw-slide-in-l { from { opacity: 0; transform: translateX(-34px) scale(.92); } to { opacity: 1; transform: none; } }
.fw-slide-in-l { animation-name: fw-slide-in-l; animation-duration: 850ms; }

@keyframes fw-slide-in-r { from { opacity: 0; transform: translateX(34px) scale(.92); } to { opacity: 1; transform: none; } }
.fw-slide-in-r { animation-name: fw-slide-in-r; animation-duration: 850ms; animation-delay: 120ms; }
`;
