'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

export default function GameTooltips() {
  const id = useId();
  const [tip, setTip] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    let active = null;
    let dismissed = null;
    let previousDescription = null;
    let timer;
    function hide() {
      clearTimeout(timer);
      if (active) {
        if (previousDescription === null) active.removeAttribute('aria-describedby');
        else active.setAttribute('aria-describedby', previousDescription);
      }
      active = null;
      setTip(null);
    }
    function show(event) {
      const target = event.target instanceof Element ? event.target.closest('[data-tooltip]') : null;
      if (!target) return;
      if (event.type === 'focusin') dismissed = null;
      if (target === dismissed) return;
      dismissed = null;
      clearTimeout(timer);
      if (active !== target) {
        hide();
        active = target;
        previousDescription = target.getAttribute('aria-describedby');
        target.setAttribute('aria-describedby', [previousDescription, id].filter(Boolean).join(' '));
      }
      const rect = target.getBoundingClientRect();
      setTip({ text: target.dataset.tooltip, x: rect.left + rect.width / 2, y: rect.bottom, top: rect.top });
    }
    function leave(event) {
      if (event.type === 'pointerout' && active === document.activeElement) return;
      if (event.relatedTarget instanceof Element
        && (event.relatedTarget.closest('[data-tooltip]') === active || event.relatedTarget.closest('[role="tooltip"]'))) return;
      clearTimeout(timer);
      timer = setTimeout(hide, 120);
    }
    function over(event) {
      if (event.target instanceof Element && event.target.closest('[role="tooltip"]')) clearTimeout(timer);
      else show(event);
    }
    function move(event) {
      if (dismissed && (event.movementX || event.movementY)) dismissed = null;
    }
    function escape(event) {
      if (event.key === 'Escape') {
        dismissed = active;
        hide();
      }
    }
    function scroll() {
      if (active && active === document.activeElement) {
        const rect = active.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          show({ target: active, type: 'focusin' });
          return;
        }
      }
      hide();
    }
    document.addEventListener('pointerover', over);
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerout', leave);
    document.addEventListener('focusin', show);
    document.addEventListener('focusout', leave);
    document.addEventListener('keydown', escape);
    document.addEventListener('pointerdown', hide);
    document.addEventListener('scroll', scroll, true);
    window.addEventListener('resize', hide);
    return () => {
      hide();
      document.removeEventListener('pointerover', over);
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerout', leave);
      document.removeEventListener('focusin', show);
      document.removeEventListener('focusout', leave);
      document.removeEventListener('keydown', escape);
      document.removeEventListener('pointerdown', hide);
      document.removeEventListener('scroll', scroll, true);
      window.removeEventListener('resize', hide);
    };
  }, [id]);

  useLayoutEffect(() => {
    if (!tip || !ref.current) return;
    const node = ref.current;
    const { width, height } = node.getBoundingClientRect();
    node.style.left = `${Math.max(8, Math.min(tip.x - width / 2, window.innerWidth - width - 8))}px`;
    const below = tip.y + 8;
    node.style.top = `${Math.max(8, below + height <= window.innerHeight - 8 ? below : tip.top - height - 8)}px`;
  }, [tip]);

  return tip && <div ref={ref} id={id} role="tooltip" className="game-tooltip">{tip.text}</div>;
}
