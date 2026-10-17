import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initScroll() {
  if (reduceMotion() || lenis) return;
  ScrollTrigger.config({ ignoreMobileResize: true });
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.95, syncTouch: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis!.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

export function destroyScroll() {
  lenis?.destroy();
  lenis = null;
}

export { gsap, ScrollTrigger };
