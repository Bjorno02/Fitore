/**
 * Editorial-technical SVG primitives + richness layer.
 * Every mark here should feel drafted, measured, and restrained.
 * No hand-drawn flourishes, no color freelancing.
 */

import { useId } from "react"

type OrnamentProps = {
  color?: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Organic blob paths — used by SvgBlob below.
 * Each is a handcrafted shape in 0-120 viewBox, designed to read as
 * "ambient stain" rather than geometric.
 */
const BLOB_PATHS = [
  "M54 8 Q 92 4 106 44 Q 116 86 74 102 Q 28 110 14 70 Q 4 22 54 8 Z",
  "M28 30 Q 68 12 110 38 Q 132 82 96 110 Q 40 116 18 82 Q 6 50 28 30 Z",
  "M40 14 Q 86 8 108 48 Q 118 92 70 112 Q 22 108 12 64 Q 6 26 40 14 Z",
  "M62 10 Q 102 24 108 66 Q 98 110 50 112 Q 8 96 14 50 Q 20 14 62 10 Z",
  "M24 42 Q 50 8 92 16 Q 122 50 106 92 Q 70 118 32 98 Q 6 74 24 42 Z",
]

/**
 * SVG radial blob — one ambient stain.
 * Strong at center, fades to transparent edges.
 *
 * `pathIndex` picks one of several organic shapes (0-4).
 * Position absolutely inside a relative/overflow-hidden parent.
 */
export function SvgBlob({
  color = "var(--color-ink)",
  size = 400,
  pathIndex = 0,
  opacity = 0.3,
  rotate = 0,
  className,
  style,
}: {
  size?: number
  pathIndex?: number
  opacity?: number
  rotate?: number
} & OrnamentProps) {
  const id = useId()
  const path = BLOB_PATHS[pathIndex % BLOB_PATHS.length]
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      style={{
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        ...style,
      }}
    >
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="55%">
          <stop offset="0%" style={{ stopColor: color, stopOpacity: opacity }} />
          <stop offset="55%" style={{ stopColor: color, stopOpacity: opacity * 0.5 }} />
          <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      <path d={path} fill={`url(#${id})`} />
    </svg>
  )
}

/**
 * Strategically placed ambient blob field — dusty rose, gold, and a single
 * rare emerald accent. Use as a page backdrop. Position: absolute, pointer-events: none.
 *
 * `variant` sets the weight / placement preset:
 * - "ambient" (default): quiet, scattered
 * - "hero": denser, for marketing hero sections
 * - "inverted": for dark oxblood sections (uses cream/emerald tones)
 */
export function BlobField({
  variant = "ambient",
  className,
  style,
}: {
  variant?: "ambient" | "hero" | "inverted"
} & Omit<OrnamentProps, "color">) {
  const presets = {
    ambient: [
      { color: "var(--color-rose-pale)", size: 620, pathIndex: 0, opacity: 0.55, rotate: -12, pos: { top: "-15%", left: "-12%" } },
      { color: "var(--color-gold-light)", size: 520, pathIndex: 1, opacity: 0.4, rotate: 24, pos: { top: "30%", right: "-8%" } },
      { color: "var(--color-rose)", size: 460, pathIndex: 2, opacity: 0.35, rotate: 60, pos: { bottom: "5%", left: "15%" } },
      { color: "var(--color-gold)", size: 420, pathIndex: 3, opacity: 0.3, rotate: -30, pos: { bottom: "-8%", right: "18%" } },
    ],
    hero: [
      { color: "var(--color-rose-pale)", size: 760, pathIndex: 4, opacity: 0.6, rotate: -8, pos: { top: "-20%", left: "-15%" } },
      { color: "var(--color-gold)", size: 600, pathIndex: 1, opacity: 0.35, rotate: 18, pos: { top: "5%", right: "-12%" } },
      { color: "var(--color-rose-deep)", size: 460, pathIndex: 2, opacity: 0.3, rotate: 45, pos: { bottom: "10%", left: "8%" } },
      { color: "var(--color-ink-whisper)", size: 380, pathIndex: 0, opacity: 0.25, rotate: 0, pos: { bottom: "-10%", right: "25%" } },
      { color: "var(--color-gold-light)", size: 340, pathIndex: 3, opacity: 0.35, rotate: -40, pos: { top: "40%", left: "35%" } },
    ],
    inverted: [
      { color: "var(--color-canvas)", size: 600, pathIndex: 0, opacity: 0.08, rotate: -10, pos: { top: "-12%", left: "-10%" } },
      { color: "var(--color-gold-light)", size: 500, pathIndex: 2, opacity: 0.14, rotate: 30, pos: { top: "20%", right: "-8%" } },
      { color: "var(--color-accent)", size: 420, pathIndex: 3, opacity: 0.22, rotate: 0, pos: { bottom: "-10%", left: "20%" } },
      { color: "var(--color-rose-pale)", size: 400, pathIndex: 4, opacity: 0.12, rotate: 45, pos: { bottom: "-5%", right: "15%" } },
    ],
  }

  const blobs = presets[variant]

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        ...style,
      }}
    >
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...b.pos,
          }}
        >
          <SvgBlob
            color={b.color}
            size={b.size}
            pathIndex={b.pathIndex}
            opacity={b.opacity}
            rotate={b.rotate}
          />
        </div>
      ))}
    </div>
  )
}

/**
 * Double-headed eagle — heraldic brand mark.
 *
 * Source: "Displayed double head eagle" from Wikimedia Commons, CC BY-SA 3.0.
 * https://commons.wikimedia.org/wiki/File:Displayed_double_head_eagle.svg
 *
 * Rendered as a CSS mask so the color follows the `color` prop (any ink shade,
 * canvas on dark bg, etc). The SVG file itself lives at /public/double-headed-eagle.svg.
 *
 * Aspect ratio is ~1.08:1 (viewBox 167x155). The container is sized from `size`;
 * mask-size: contain preserves the native ratio so the eagle renders proportionally.
 */
export function DoubleHeadedEagle({
  size = 24,
  color = "currentColor",
  className,
  style,
}: { size?: number } & OrnamentProps) {
  const url = 'url("/double-headed-eagle.svg")'
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        display: "inline-block",
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        ...style,
      }}
    />
  )
}

/**
 * Crossed swords — retained for backward compat / alternate usage.
 */
export function CrossedSwords({
  size = 24,
  color = "currentColor",
  strokeWidth = 1.5,
  className,
  style,
}: { size?: number; strokeWidth?: number } & OrnamentProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      style={style}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* First sword — top-left to bottom-right */}
      <g>
        {/* blade */}
        <path d="M14 14 L 46 46" />
        {/* tip */}
        <path d="M14 14 L 10 18 L 14 22" fill={color} fillOpacity="0.15" />
        {/* crossguard */}
        <path d="M42 46 L 46 42 M 50 50 L 46 46" />
        <path d="M44 44 L 52 52" />
        {/* grip */}
        <path d="M48 48 L 54 54" strokeWidth={strokeWidth * 1.5} />
        {/* pommel */}
        <circle cx="56" cy="56" r="2.5" fill={color} />
      </g>
      {/* Second sword — top-right to bottom-left */}
      <g>
        {/* blade */}
        <path d="M50 14 L 18 46" />
        {/* tip */}
        <path d="M50 14 L 54 18 L 50 22" fill={color} fillOpacity="0.15" />
        {/* crossguard */}
        <path d="M22 46 L 18 42 M 14 50 L 18 46" />
        <path d="M20 44 L 12 52" />
        {/* grip */}
        <path d="M16 48 L 10 54" strokeWidth={strokeWidth * 1.5} />
        {/* pommel */}
        <circle cx="8" cy="56" r="2.5" fill={color} />
      </g>
    </svg>
  )
}

/**
 * Single vertical sword — for section ornaments, margins, or tall accents.
 */
export function Sword({
  size = 32,
  color = "currentColor",
  strokeWidth = 1.5,
  className,
  style,
}: { size?: number; strokeWidth?: number } & OrnamentProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size * 3}
      viewBox="0 0 24 72"
      className={className}
      style={style}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* tip */}
      <path d="M12 2 L 9 6 L 12 10 L 15 6 Z" fill={color} fillOpacity="0.15" />
      {/* blade */}
      <path d="M12 2 L 12 48" />
      <path d="M10 10 L 10 46" opacity="0.5" />
      <path d="M14 10 L 14 46" opacity="0.5" />
      {/* crossguard */}
      <path d="M4 48 L 20 48" strokeWidth={strokeWidth * 1.6} />
      {/* grip wrap detail */}
      <path d="M10 52 L 14 52 M 10 56 L 14 56 M 10 60 L 14 60" opacity="0.6" />
      <path d="M12 48 L 12 66" strokeWidth={strokeWidth * 1.4} />
      {/* pommel */}
      <circle cx="12" cy="68" r="3" fill={color} />
    </svg>
  )
}

/**
 * Atmospheric background blobs — soft radial-gradient ellipses at low opacity.
 * Use as ambient decoration on page-level, position absolutely inside a relative parent.
 * `variant` controls the palette hint: "ink" (oxblood), "accent" (emerald), or "mixed".
 */
export function AtmosphericBlobs({
  variant = "mixed",
  className,
  style,
}: {
  variant?: "ink" | "accent" | "mixed"
} & Omit<OrnamentProps, "color">) {
  const inkColor = "rgba(77, 30, 20, 0.08)"
  const accentColor = "rgba(199, 86, 34, 0.10)"

  const blobs = (() => {
    if (variant === "ink") {
      return [
        { left: "-10%", top: "-8%", w: "55%", h: "50%", color: inkColor },
        { right: "-15%", top: "12%", w: "45%", h: "60%", color: inkColor },
        { left: "15%", bottom: "-10%", w: "40%", h: "45%", color: inkColor },
      ]
    }
    if (variant === "accent") {
      return [
        { left: "5%", top: "10%", w: "50%", h: "55%", color: accentColor },
        { right: "-10%", bottom: "-5%", w: "55%", h: "60%", color: accentColor },
      ]
    }
    return [
      { left: "-8%", top: "-5%", w: "55%", h: "50%", color: inkColor },
      { right: "-12%", top: "8%", w: "45%", h: "55%", color: accentColor },
      { left: "20%", bottom: "-15%", w: "50%", h: "50%", color: inkColor },
      { right: "10%", bottom: "-8%", w: "38%", h: "42%", color: accentColor },
    ]
  })()

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        ...style,
      }}
    >
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: b.w,
            height: b.h,
            background: `radial-gradient(ellipse at center, ${b.color} 0%, transparent 70%)`,
            filter: "blur(40px)",
            left: (b as { left?: string }).left,
            right: (b as { right?: string }).right,
            top: (b as { top?: string }).top,
            bottom: (b as { bottom?: string }).bottom,
          }}
        />
      ))}
    </div>
  )
}

/**
 * A measured rule with a small emerald mark embedded in it.
 * Use as a section separator that's slightly more decorative than DashedRule.
 */
export function MarkedRule({
  color = "var(--color-rule-strong)",
  markColor = "var(--color-accent)",
  thickness = 1,
  markSize = 6,
  className,
  style,
}: {
  markColor?: string
  thickness?: number
  markSize?: number
} & OrnamentProps) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: "relative",
        height: `${thickness}px`,
        width: "100%",
        backgroundColor: color,
        ...style,
      }}
    >
      <span
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%) rotate(45deg)",
          width: `${markSize}px`,
          height: `${markSize}px`,
          backgroundColor: markColor,
        }}
      />
    </div>
  )
}

/**
 * Halftone dot field — for faint, deliberate texture.
 * Default opacity is intentionally low. Crank `gap` for sparser patterns.
 */
export function DotGrid({
  cols = 8,
  rows = 4,
  size = 2,
  gap = 10,
  color = "currentColor",
  className,
  style,
}: {
  cols?: number
  rows?: number
  size?: number
  gap?: number
} & OrnamentProps) {
  const w = cols * gap
  const h = rows * gap
  const dots = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push(
        <circle
          key={`${r}-${c}`}
          cx={c * gap + gap / 2}
          cy={r * gap + gap / 2}
          r={size / 2}
          fill={color}
        />,
      )
    }
  }
  return (
    <svg
      aria-hidden="true"
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      style={style}
    >
      {dots}
    </svg>
  )
}

/**
 * L-shaped corner brackets for precisely framing a hero or section block.
 * Hairline only. Position absolutely inside a relative parent.
 */
export function CornerBrackets({
  color = "var(--color-rule-strong)",
  size = 20,
  thickness = 1,
  inset = 0,
  className,
  style,
}: {
  size?: number
  thickness?: number
  inset?: number
} & OrnamentProps) {
  const b = `${thickness}px solid ${color}`
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: inset,
          left: inset,
          width: size,
          height: size,
          borderTop: b,
          borderLeft: b,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: inset,
          right: inset,
          width: size,
          height: size,
          borderTop: b,
          borderRight: b,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: inset,
          left: inset,
          width: size,
          height: size,
          borderBottom: b,
          borderLeft: b,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: inset,
          right: inset,
          width: size,
          height: size,
          borderBottom: b,
          borderRight: b,
        }}
      />
    </div>
  )
}

/**
 * Dashed hairline rule — gentler than a solid line, more technical than plain.
 */
export function DashedRule({
  color = "var(--color-rule-dashed)",
  className,
  style,
}: OrnamentProps) {
  return (
    <hr
      aria-hidden="true"
      className={className}
      style={{
        border: "none",
        height: "1px",
        backgroundImage: `repeating-linear-gradient(90deg, ${color} 0px, ${color} 4px, transparent 4px, transparent 9px)`,
        ...style,
      }}
    />
  )
}

/**
 * Tick-marked ruler — a thin line with measurement marks.
 * Useful as a decorative left-margin column ruler or section underline.
 * `orientation="vertical"` makes it run top-to-bottom.
 */
export function TickRuler({
  length = 120,
  orientation = "horizontal",
  ticks = 10,
  color = "var(--color-rule-strong)",
  className,
  style,
}: {
  length?: number
  orientation?: "horizontal" | "vertical"
  ticks?: number
} & OrnamentProps) {
  const step = length / ticks
  const marks = []
  for (let i = 0; i <= ticks; i++) {
    const isMajor = i % 5 === 0
    const tickLength = isMajor ? 6 : 3
    if (orientation === "horizontal") {
      marks.push(
        <line
          key={i}
          x1={i * step}
          y1={0}
          x2={i * step}
          y2={tickLength}
          stroke={color}
          strokeWidth="1"
        />,
      )
    } else {
      marks.push(
        <line
          key={i}
          x1={0}
          y1={i * step}
          x2={tickLength}
          y2={i * step}
          stroke={color}
          strokeWidth="1"
        />,
      )
    }
  }
  const width = orientation === "horizontal" ? length : 8
  const height = orientation === "horizontal" ? 8 : length
  return (
    <svg
      aria-hidden="true"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={style}
    >
      {/* Main axis line */}
      {orientation === "horizontal" ? (
        <line x1="0" y1="0" x2={length} y2="0" stroke={color} strokeWidth="1" />
      ) : (
        <line x1="0" y1="0" x2="0" y2={length} stroke={color} strokeWidth="1" />
      )}
      {marks}
    </svg>
  )
}
