import type { ReactElement } from 'react'

// Decorative mosaic corner accent: the "mosaikler" artwork shown uncropped at
// its natural aspect so the shard cluster hugs the bottom-right corner.
export const MosaicPattern = ({ className = '' }: { className?: string }): ReactElement => (
  <svg
    viewBox="0 0 876 616"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    className={className}
  >
    <image
      href="/mosaic-shards.svg"
      x="0"
      y="0"
      width="876"
      height="616"
    />
  </svg>
)
