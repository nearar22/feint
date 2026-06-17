// Fixed background layers shared across the whole kiosk: the drifting hard
// interrogation spotlight, the film-grain flicker, and a vignette to seal the
// edges into near-black. Pure presentation, no state.
export default function Atmosphere() {
  return (
    <>
      <div className="fixed inset-0 z-0 bg-ink-900" />
      <div className="spotlight-layer animate-spotlight" />
      <div className="vignette" />
      <div className="grain-layer animate-grain" />
    </>
  );
}
