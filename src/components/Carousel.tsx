import { useRef, useState, type ReactNode } from 'react';

interface Slide {
  label: string;
  content: ReactNode;
}

/** Swipeable preview: one item per screen width, with dots to jump between them. */
export function Carousel({ slides, label }: { slides: Slide[]; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  };
  const go = (i: number) => {
    const el = track.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <section className="carousel" aria-label={label}>
      <div className="track" ref={track} onScroll={onScroll}>
        {slides.map((s) => (
          <div className="slide" key={s.label}>
            {s.content}
            <div className="item-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="dots">
        {slides.map((s, i) => (
          <button key={s.label} aria-label={`Show ${s.label}`} aria-current={i === active} onClick={() => go(i)} />
        ))}
      </div>
    </section>
  );
}
