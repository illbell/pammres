import React from 'react'

/** Simple 24px line icons. They inherit color via currentColor. */
function Icon({
  children,
  className = 'size-6',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  )
}

type IconProps = { className?: string }

export const GlobeIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
  </Icon>
)

export const ImpactIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 20s-7-4.4-7-9.6A4 4 0 0 1 12 8a4 4 0 0 1 7 2.4C19 15.6 12 20 12 20z" />
    <path d="M9.5 12.5h5M12 10v5" />
  </Icon>
)

export const GrowthIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 21v-9" />
    <path d="M12 12c0-4 2.5-6.5 7-7 0 4.5-2.5 7-7 7z" />
    <path d="M12 14.5c0-3-2-5-5.5-5.5 0 3.5 2 5.5 5.5 5.5z" />
    <path d="M7 21h10" />
  </Icon>
)

export const NetworkIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="5" r="2.2" />
    <circle cx="5" cy="18" r="2.2" />
    <circle cx="19" cy="18" r="2.2" />
    <path d="M10.9 6.9 6.1 16.1M13.1 6.9l4.8 9.2M7.2 18h9.6" />
  </Icon>
)

export const ArrowRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
)

export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Icon>
)

export const MegaphoneIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 10v4a1 1 0 0 0 1 1h2l6 4V5L7 9H5a1 1 0 0 0-1 1z" />
    <path d="M17 9a4 4 0 0 1 0 6" />
  </Icon>
)
