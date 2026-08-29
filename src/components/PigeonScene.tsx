'use client'

import { useEffect, useRef, useState } from 'react'

// Single pigeon SVG — wings flapping via CSS animation
const PigeonSVG = ({
  scale = 1,
  flipX = false,
  animDelay = '0s',
  flapSpeed = '0.35s',
}: {
  scale?: number
  flipX?: boolean
  animDelay?: string
  flapSpeed?: string
}) => (
  <svg
    viewBox="0 0 80 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      width: `${80 * scale}px`,
      height: `${60 * scale}px`,
      transform: flipX ? 'scaleX(-1)' : undefined,
      display: 'block',
    }}
  >
    {/* Body */}
    <ellipse cx="40" cy="38" rx="18" ry="11" fill="#b0b8c8" />
    {/* Head */}
    <circle cx="56" cy="30" r="8" fill="#c8d0de" />
    {/* Beak */}
    <path d="M63 29.5l5 1.5-5 1.5z" fill="#e8b860" />
    {/* Eye */}
    <circle cx="58" cy="29" r="2" fill="#2a2e3a" />
    <circle cx="58.8" cy="28.4" r="0.7" fill="white" />
    {/* Tail */}
    <path d="M22 38 Q16 42 14 50 Q20 44 28 41z" fill="#9aa4b8" />
    {/* Neck highlight */}
    <ellipse cx="50" cy="34" rx="7" ry="5" fill="#d4dce8" />
    {/* Wing — upper part (flaps) */}
    <g
      style={{
        transformOrigin: '42px 34px',
        animation: `wingFlap ${flapSpeed} ${animDelay} ease-in-out infinite alternate`,
      }}
    >
      <path
        d="M42 34 Q32 18 20 14 Q28 22 38 30 Q40 32 42 34z"
        fill="#8a95aa"
      />
      <path
        d="M42 34 Q38 20 30 12 Q34 22 40 30z"
        fill="#7a8598"
      />
    </g>
    {/* Feet */}
    <line x1="36" y1="48" x2="32" y2="54" stroke="#c8a040" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="32" y1="54" x2="28" y2="54" stroke="#c8a040" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="32" y1="54" x2="30" y2="57" stroke="#c8a040" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="42" y1="48" x2="38" y2="54" stroke="#c8a040" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="38" y1="54" x2="34" y2="54" stroke="#c8a040" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="38" y1="54" x2="36" y2="57" stroke="#c8a040" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

// Branch SVG
const BranchSVG = () => (
  <svg viewBox="0 0 340 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 340, height: 60 }}>
    {/* Main branch */}
    <path d="M0 48 Q80 44 170 42 Q260 40 340 38" stroke="#6b4f2a" strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Sub branches */}
    <path d="M60 45 Q55 30 50 20" stroke="#7a5c33" strokeWidth="3" strokeLinecap="round" />
    <path d="M50 20 Q44 14 38 10" stroke="#7a5c33" strokeWidth="2" strokeLinecap="round" />
    <path d="M50 20 Q56 13 60 8" stroke="#7a5c33" strokeWidth="2" strokeLinecap="round" />
    <path d="M200 42 Q196 28 192 18" stroke="#7a5c33" strokeWidth="3" strokeLinecap="round" />
    <path d="M192 18 Q186 12 180 8" stroke="#7a5c33" strokeWidth="2" strokeLinecap="round" />
    <path d="M192 18 Q198 11 202 6" stroke="#7a5c33" strokeWidth="2" strokeLinecap="round" />
    {/* Leaves */}
    {[
      [38, 10], [60, 8], [180, 8], [202, 6], [140, 43], [280, 39],
    ].map(([x, y], i) => (
      <ellipse key={i} cx={x} cy={y} rx="7" ry="4" fill="#5a9e52" opacity="0.85"
        transform={`rotate(${[-20, 25, -15, 30, -10, 20][i]} ${x} ${y})`} />
    ))}
  </svg>
)

type PigeonState = 'perched' | 'flying'

interface Props {
  className?: string
}

export function PigeonScene({ className = '' }: Props) {
  const [state, setState] = useState<PigeonState>('perched')
  const [scrollProgress, setScrollProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const ticking = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const scrollY = window.scrollY
        const viewH = window.innerHeight
        const progress = Math.min(scrollY / viewH, 1)
        setScrollProgress(progress)
        setState(progress > 0.15 ? 'flying' : 'perched')
        ticking.current = false
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Flying: pigeons move from bottom-left toward top-right
  const flyX = scrollProgress * 110  // vw units — percentage based movement
  const flyY = scrollProgress * -85  // move up
  const flyScale = 1 - scrollProgress * 0.25
  const flyOpacity = scrollProgress > 0.85 ? 1 - (scrollProgress - 0.85) / 0.15 : 1

  const isFlying = state === 'flying'

  return (
    <>
      <style>{`
        @keyframes wingFlap {
          from { transform: rotate(-8deg); }
          to   { transform: rotate(20deg); }
        }
        @keyframes wingFlapFast {
          from { transform: rotate(-20deg); }
          to   { transform: rotate(35deg); }
        }
        @keyframes pigeonBob {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-3px); }
        }
        @keyframes pigeonBob2 {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-4px); }
        }
      `}</style>

      <div
        ref={containerRef}
        className={`pointer-events-none fixed ${className}`}
        style={{
          zIndex: 40,
          // Bottom-left start position
          bottom: isFlying ? `calc(${flyY * -1}vh + 2rem)` : '2rem',
          left: isFlying ? `calc(${flyX}vw)` : '1.5rem',
          transform: `scale(${isFlying ? flyScale : 1})`,
          opacity: flyOpacity,
          transition: isFlying
            ? 'bottom 0.05s linear, left 0.05s linear, transform 0.05s linear, opacity 0.1s linear'
            : 'all 0.6s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* Pigeons on branch (perched state) */}
        {!isFlying && (
          <div style={{ position: 'relative', width: 340 }}>
            {/* Pigeon 1 — leftmost, bobbing slowly */}
            <div style={{
              position: 'absolute',
              bottom: 46,
              left: 18,
              animation: 'pigeonBob 2.8s ease-in-out infinite',
            }}>
              <PigeonSVG scale={0.9} animDelay="0s" flapSpeed="3s" />
            </div>
            {/* Pigeon 2 — middle, slightly larger */}
            <div style={{
              position: 'absolute',
              bottom: 44,
              left: 120,
              animation: 'pigeonBob2 3.4s 0.5s ease-in-out infinite',
            }}>
              <PigeonSVG scale={1} animDelay="0.3s" flapSpeed="2.8s" />
            </div>
            {/* Pigeon 3 — rightmost, facing other way */}
            <div style={{
              position: 'absolute',
              bottom: 43,
              left: 228,
              animation: 'pigeonBob 3.1s 1.1s ease-in-out infinite',
            }}>
              <PigeonSVG scale={0.85} flipX animDelay="0.6s" flapSpeed="3.2s" />
            </div>
            {/* Branch */}
            <div style={{ position: 'relative', zIndex: -1 }}>
              <BranchSVG />
            </div>
          </div>
        )}

        {/* Flying state — 3 separate pigeons scatter */}
        {isFlying && (
          <div style={{ position: 'relative', width: 260, height: 180 }}>
            {/* Lead pigeon */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 60,
              animation: 'none',
            }}>
              <PigeonSVG scale={1.1} flapSpeed="0.28s" animDelay="0s" />
            </div>
            {/* Trailing left */}
            <div style={{
              position: 'absolute',
              top: 55,
              left: 0,
              animation: 'none',
            }}>
              <PigeonSVG scale={0.85} flapSpeed="0.32s" animDelay="0.08s" />
            </div>
            {/* Trailing right */}
            <div style={{
              position: 'absolute',
              top: 90,
              left: 120,
              animation: 'none',
            }}>
              <PigeonSVG scale={0.75} flipX flapSpeed="0.3s" animDelay="0.15s" />
            </div>
          </div>
        )}
      </div>
    </>
  )
}
