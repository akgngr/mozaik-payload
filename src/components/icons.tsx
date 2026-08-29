import type { ReactElement } from 'react'

type IconProps = { className?: string }

export const FacebookIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M13.5 21v-8.06h2.71l.4-3.14h-3.11V7.9c0-.91.25-1.53 1.56-1.53h1.66V3.56A22.3 22.3 0 0 0 13.9 3.4c-2.42 0-4.08 1.48-4.08 4.19v2.31H7.1v3.14h2.72V21h3.68Z" />
  </svg>
)

export const InstagramIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
)

export const YoutubeIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22 12s0-3.2-.4-4.7a2.9 2.9 0 0 0-2-2C17.9 5 12 5 12 5s-5.9 0-7.6.3a2.9 2.9 0 0 0-2 2C2 8.8 2 12 2 12s0 3.2.4 4.7a2.9 2.9 0 0 0 2 2C6.1 19 12 19 12 19s5.9 0 7.6-.3a2.9 2.9 0 0 0 2-2c.4-1.5.4-4.7.4-4.7ZM10 15.5v-7l6 3.5-6 3.5Z" />
  </svg>
)

export const TwitterIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.9 3H22l-7.6 8.7L22.9 21h-6.8l-5.3-6.5L4.7 21H1.6l8.1-9.3L1 3h7l4.8 5.9L18.9 3Zm-1.2 16.2h1.7L7 4.7H5.2l12.5 14.5Z" />
  </svg>
)

export const PhoneIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 2.9a2 2 0 0 1-.4 2.1L8 10a16 16 0 0 0 6 6l1.3-1.4a2 2 0 0 1 2.1-.4c.9.4 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
  </svg>
)

export const MailIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="m4 7 8 6 8-6" />
  </svg>
)

export const PinIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export const ClockIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
)

export const MenuIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
)

export const CloseIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const HeartIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 21s-7.5-4.6-10-9C.4 8.4 2 4.5 5.8 4c2-.3 3.8.6 6.2 3 2.4-2.4 4.2-3.3 6.2-3 3.8.5 5.4 4.4 3.8 8-2.5 4.4-10 9-10 9Z" />
  </svg>
)

export const UsersIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <circle cx="17.5" cy="9" r="2.8" />
    <path d="M15.8 13.2A5.5 5.5 0 0 1 21.5 18" />
  </svg>
)

export const SchoolIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m2 9 10-5 10 5-10 5-10-5Z" />
    <path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
  </svg>
)

export const CourseIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
  </svg>
)

export const BuildingIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="3" width="16" height="18" rx="1" />
    <path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" />
  </svg>
)

export const HelpIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.9.4-1.5 1-1.5 2.2" />
    <path d="M12 17h.01" />
  </svg>
)

export const ArrowRightIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const iconMap: Record<string, (props: IconProps) => ReactElement> = {
  school: SchoolIcon,
  users: UsersIcon,
  heart: HeartIcon,
  course: CourseIcon,
  building: BuildingIcon,
  help: HelpIcon,
}

// ── Illustrative Werte icons ──────────────────────────────────────────────

/** Begegnung — two hands reaching toward each other */
export const HandshakeIllustIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="24" cy="24" r="20" fill="currentColor" fillOpacity="0.12" />
    <path d="M14 28c0 0 2-6 5-6l5 2 5-2c3 0 5 6 5 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 22l-3-4a2 2 0 0 1 2.8-2.8l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M29 22l3-4a2 2 0 0 0-2.8-2.8l-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="24" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M17 36h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M14 32h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

/** Vielfalt — globe with orbiting dots */
export const GlobeIllustIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="24" cy="24" r="20" fill="currentColor" fillOpacity="0.12" />
    <circle cx="24" cy="24" r="11" stroke="currentColor" strokeWidth="2.2"/>
    <ellipse cx="24" cy="24" rx="5" ry="11" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M13 20h22M13 28h22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="35" cy="16" r="2.5" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="13" cy="32" r="2" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="37" cy="30" r="1.5" fill="currentColor" fillOpacity="0.6"/>
  </svg>
)

/** Dialog — two overlapping speech bubbles */
export const DialogIllustIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="24" cy="24" r="20" fill="currentColor" fillOpacity="0.12" />
    <rect x="10" y="12" width="19" height="13" rx="4" stroke="currentColor" strokeWidth="2.2"/>
    <path d="M14 25v4l5-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 18h11M14 21h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <rect x="19" y="23" width="19" height="12" rx="4" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M34 35v3l-4-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 28h11M23 31h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

/** Wachstum — sprouting plant */
export const SproutIllustIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="24" cy="24" r="20" fill="currentColor" fillOpacity="0.12" />
    <path d="M24 37V25" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
    <path d="M24 29c0 0-1-7-9-8 0 7 5 9 9 8Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M24 25c0 0 1-6 8-7 0 7-5 8-8 7Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <circle cx="24" cy="19" r="3.5" stroke="currentColor" strokeWidth="2"/>
    <path d="M17 37h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
)

/** Solidarität — heart embraced by arms */
export const SolidarityIllustIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="24" cy="24" r="20" fill="currentColor" fillOpacity="0.12" />
    <path d="M24 32s-10-5.5-10-12a6 6 0 0 1 10-4.4A6 6 0 0 1 34 20c0 6.5-10 12-10 12Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/>
    <path d="M12 33c-1.5 1-2.5 2.5-2.5 4h29c0-1.5-1-3-2.5-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="18" cy="35" r="1.2" fill="currentColor" fillOpacity="0.5"/>
    <circle cx="24" cy="36" r="1.2" fill="currentColor" fillOpacity="0.5"/>
    <circle cx="30" cy="35" r="1.2" fill="currentColor" fillOpacity="0.5"/>
  </svg>
)

/** Kreativität — starburst / spark */
export const CreativityIllustIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="24" cy="24" r="20" fill="currentColor" fillOpacity="0.12" />
    <path d="M24 11v5M24 32v5M11 24h5M32 24h5M15.5 15.5l3.5 3.5M29 29l3.5 3.5M32.5 15.5l-3.5 3.5M19 29l-3.5 3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    <circle cx="24" cy="24" r="6" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="2"/>
    <circle cx="24" cy="24" r="2.5" fill="currentColor"/>
  </svg>
)

