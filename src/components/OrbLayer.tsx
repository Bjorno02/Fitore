export default function OrbLayer() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div className="frost-orb frost-orb-a" />
      <div className="frost-orb frost-orb-b" />
      <div className="frost-orb frost-orb-c" />
      <div className="frost-orb frost-orb-d" />
      <div className="frost-orb frost-orb-e" />
    </div>
  )
}
