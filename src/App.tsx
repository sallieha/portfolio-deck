import React, { useState, useEffect } from 'react';

const BASE = import.meta.env.BASE_URL;

const slides = Array.from({ length: 31 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return {
    id: i + 1,
    label: num,
    src: `${BASE}slides/slide-${num}.png`,
    srcHD: `${BASE}slides/slide-${num}@2x.png`,
  };
});

export default function App() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [closing, setClosing] = useState(false);
  const ANIM = 200;

  const closeLightbox = () => {
    setClosing(true);
    setTimeout(() => { setActive(null); setClosing(false); }, ANIM);
  };

  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('[data-slide]');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    );
    cards.forEach(card => obs.observe(card));

    const footerLine = document.querySelector<HTMLElement>('[data-footer-line]');
    const footerObs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.transform = 'scaleX(1)';
            footerObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    if (footerLine) footerObs.observe(footerLine);

    return () => { obs.disconnect(); footerObs.disconnect(); };
  }, []);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setActive(a => (a && a > 1 ? a - 1 : a));
      if (e.key === 'ArrowRight') setActive(a => (a && a < slides.length ? a + 1 : a));
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f6f3ec', fontFamily: '"Inter", system-ui, sans-serif' }}>
      <style>{`
        @keyframes lineIn     { from { transform: scaleX(0) } to { transform: scaleX(1) } }
        @keyframes headerIn   { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes eyebrowIn  { from { opacity:0 } to { opacity:1 } }
      `}</style>
      <header>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 64px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: '32px' }}>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#010103', marginBottom: '6px', fontFamily: '"Azeret Mono", monospace', opacity: 0, animation: 'eyebrowIn 0.5s ease 0.1s forwards' }}>
                Sallie Harrison Presentation Deck
              </p>
              <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#010103', margin: 0, letterSpacing: '-0.02em', opacity: 0, animation: 'headerIn 0.55s ease 0.2s forwards' }}>
                Red Bull + Habit Tracker App
              </h1>
            </div>
            <p style={{ fontSize: '13px', color: '#010103', margin: 0, fontFamily: '"Azeret Mono", monospace', textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0, animation: 'eyebrowIn 0.5s ease 0.3s forwards' }}>
              {slides.length} slides
            </p>
          </div>
          <div style={{ height: '1px', backgroundColor: '#b8b2a7', transformOrigin: 'left', transform: 'scaleX(0)', animation: 'lineIn 1.4s ease 0.15s forwards' }} />
        </div>
      </header>

      <main>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 64px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '40px 32px' }}>
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              data-slide
              onClick={() => setActive(active === slide.id ? null : slide.id)}
              onMouseEnter={() => setHovered(slide.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                cursor: 'pointer',
                opacity: 0,
                transform: 'translateY(18px)',
                transition: `opacity 0.45s ease ${(i % 5) * 55}ms, transform 0.45s ease ${(i % 5) * 55}ms`,
              }}
            >
              <div style={{
                position: 'relative',
                aspectRatio: '16 / 9',
                borderRadius: '4px',
                overflow: 'hidden',
                backgroundColor: '#e8e4da',
                boxShadow: hovered === slide.id ? '0 8px 28px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.07)',
                transform: hovered === slide.id ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                outline: active === slide.id ? '2px solid #3d49f2' : 'none',
                outlineOffset: '2px',
              }}>
                <img
                  src={slide.src}
                  alt={`Slide ${slide.id}`}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: '#f6f3ec',
                  opacity: hovered !== null && hovered !== slide.id ? 0.72 : 0,
                  transition: 'opacity 0.2s ease',
                  pointerEvents: 'none',
                }} />
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '11px', color: '#9e9a91', letterSpacing: '0.04em', fontFamily: '"Azeret Mono", monospace' }}>
                {slide.label}.
              </p>
            </div>
          ))}
        </div>
        </div>
      </main>

      <footer>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 64px 64px' }}>
          <div
            data-footer-line
            style={{ height: '1px', backgroundColor: '#b8b2a7', transformOrigin: 'left', transform: 'scaleX(0)', transition: 'transform 1.4s ease' }}
          />
        </div>
      </footer>

      <style>{`
        @keyframes lbIn  { from { opacity:0; transform:scale(0.97) } to { opacity:1; transform:scale(1) } }
        @keyframes lbOut { from { opacity:1; transform:scale(1) } to { opacity:0; transform:scale(0.97) } }
        @keyframes lbBgIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes lbBgOut { from { opacity:1 } to { opacity:0 } }
      `}</style>
      {active !== null && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px',
            animation: `${closing ? 'lbBgOut' : 'lbBgIn'} ${ANIM}ms ease forwards`,
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', borderRadius: '8px', overflow: 'hidden', animation: `${closing ? 'lbOut' : 'lbIn'} ${ANIM}ms ease forwards` }}>
            <img
              src={slides[active - 1].srcHD}
              alt={`Slide ${active}`}
              data-lightbox-img
              style={{ display: 'block', maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }}
            />
            <button onClick={closeLightbox} style={{ position: 'absolute', top: '12px', left: '12px', ...btnStyle }} title="Close">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1L11 11M11 1L1 11" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button onClick={() => setActive(active > 1 ? active - 1 : active)} disabled={active <= 1} style={{ ...btnStyle, opacity: active <= 1 ? 0.3 : 1 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <div style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '12px', padding: '4px 12px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
                {active} / {slides.length}
              </div>
              <button
                onClick={() => {
                  const el = document.querySelector('[data-lightbox-img]') as HTMLElement;
                  if (el) { if (!document.fullscreenElement) el.requestFullscreen(); else document.exitFullscreen(); }
                }}
                style={btnStyle} title="Fullscreen"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 5V1H5M9 1H13V5M13 9V13H9M5 13H1V9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button onClick={() => setActive(active < slides.length ? active + 1 : active)} disabled={active >= slides.length} style={{ ...btnStyle, opacity: active >= slides.length ? 0.3 : 1 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff',
  width: '32px', height: '32px', borderRadius: '50%',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
};
