import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoMark from '../components/LogoMark';
import { useGSAP } from '@gsap/react';
import { gsap, reduceMotion } from '../lib/scroll';
import './landing-v2.css';

/* ============================================================
   PLACEHOLDER TESTIMONIALS - DEMO DATA.
   The owner chose to ship these demo quotes on production for
   now (2026-10-17) and will swap in real, collected quotes.
   Every rendered node carries data-placeholder so the set is
   greppable: [data-placeholder="testimonial"].
   ============================================================ */
type Tile = {
  q: string;
  name: string;
  tag: string;
  size: string;
  fill: string;
  hl?: { t: string; c: string };
  sc?: { t: string; c: string };
  circ?: { t: string; c: string };
  dd?: ({ k: 'tape'; st: React.CSSProperties } | { k: 'star' | 'squig'; st: React.CSSProperties; c: string })[];
};

const QUOTES: { pull: { q: string; mark: string; name: string; tag: string }; clusterA: Tile[]; clusterB: Tile[] } = {
  pull: {
    q: 'I used to open three PDFs and a spreadsheet to figure out what to study. Now I open one tab and the decision is already made.',
    mark: 'one tab',
    name: 'Aditi',
    tag: 'sem 5',
  },
  clusterA: [
    { q: 'I stopped rewriting my timetable every Sunday. The list just meets me in the morning.', name: 'Priya', tag: 'sem 5', size: 't-tall', fill: 't-cream',
      hl: { t: 'meets me in the morning', c: 'hl-y' }, dd: [{ k: 'tape', st: { left: 18 } }] },
    { q: 'Streak at 11. I have never kept anything alive for 11 days.', name: 'Karan', tag: 'sem 7', size: 't-wide t-big', fill: 't-red',
      sc: { t: '11 days', c: 'rgba(247,245,242,.9)' }, dd: [{ k: 'star', st: { top: -7, right: -6, width: 24, transform: 'rotate(12deg)' }, c: '#F7F5F2' }] },
    { q: 'Two minutes to set up. I spent longer choosing a pen.', name: 'Ishita', tag: 'sem 3', size: '', fill: 't-ink',
      dd: [{ k: 'star', st: { bottom: -6, right: -5, width: 20, transform: 'rotate(-8deg)' }, c: '#F63C49' }] },
    { q: 'Eleven days out, and I already know what Tuesday looks like.', name: 'Rohan', tag: 'sem 3', size: '', fill: 't-ink',
      circ: { t: 'Tuesday', c: '#F63C49' }, dd: [{ k: 'squig', st: { bottom: 36, right: 12, width: 38, transform: 'rotate(-6deg)' }, c: '#F63C49' }] },
    { q: 'PYQs next to the units they belong to. Whoever thought of that, thank you.', name: 'Neha', tag: 'sem 7', size: '', fill: 't-cream',
      sc: { t: 'thank you', c: '#D61A40' } },
    { q: 'Offline in the reading hall, no account, no ads. It respects the grind.', name: 'Dev', tag: 'sem 7', size: '', fill: 't-cream',
      dd: [{ k: 'tape', st: { right: 16, left: 'auto', transform: 'rotate(6deg)' } }] },
  ],
  clusterB: [
    { q: 'It is the first app that tells me what is left instead of what I should feel guilty about.', name: 'Vikram', tag: 'sem 5', size: 't-tall', fill: 't-cream',
      hl: { t: 'what is left', c: 'hl-y' } },
    { q: 'The syllabus finally looks finite. That alone lowered my blood pressure.', name: 'Sneha', tag: 'sem 3', size: '', fill: 't-cream',
      circ: { t: 'finite', c: '#D61A40' } },
    { q: 'The countdown used to scare me. Now it just plans for me.', name: 'Rahul', tag: 'sem 1', size: 't-wide t-big', fill: 't-ink',
      sc: { t: 'plans for me', c: '#F63C49' }, dd: [{ k: 'star', st: { top: -7, right: -6, width: 22, transform: 'rotate(-10deg)' }, c: '#F63C49' }] },
    { q: 'Ticked one unit, watched the bar move, felt weirdly calm. Then ticked another.', name: 'Arjun', tag: 'sem 1', size: '', fill: 't-red',
      sc: { t: 'weirdly calm', c: 'rgba(247,245,242,.9)' }, dd: [{ k: 'star', st: { top: -7, right: -5, width: 18, transform: 'rotate(14deg)' }, c: '#F7F5F2' }] },
    { q: 'I know exactly what is left. That sentence used to be a joke.', name: 'Anaya', tag: 'sem 3', size: '', fill: 't-cream',
      hl: { t: 'exactly what is left', c: 'hl-y' } },
    { q: 'My group chat still argues about portions. I just open one tab.', name: 'Tanvi', tag: 'sem 5', size: '', fill: 't-cream',
      sc: { t: 'one tab', c: '#D61A40' }, dd: [{ k: 'tape', st: { left: 16 } }] },
  ],
};

const DD_SVG: Record<'star' | 'squig', (c: string) => React.ReactNode> = {
  star: (c) => (
    <svg viewBox="0 0 40 40" fill="none"><path d="M20 4 L23.5 16 L36 20 L23.5 24 L20 36 L16.5 24 L4 20 L16.5 16 Z" stroke={c} strokeWidth="3" strokeLinejoin="round" /></svg>
  ),
  squig: (c) => (
    <svg viewBox="0 0 60 20" fill="none"><path d="M4 12 C 12 4, 20 18, 28 10 C 36 2, 44 18, 56 8" stroke={c} strokeWidth="3" strokeLinecap="round" /></svg>
  ),
};

const tileDoodles = (t: Tile) =>
  (t.dd || []).map((d, i) =>
    d.k === 'tape' ? (
      <span key={i} className="tape" style={d.st}></span>
    ) : (
      <span key={i} className="dd" style={d.st}>{DD_SVG[d.k](d.c)}</span>
    )
  );

const tileQuote = (t: Tile) => {
  let deco: { t: string; node: React.ReactNode } | null = null;
  if (t.hl) deco = { t: t.hl.t, node: <span className={`hl ${t.hl.c}`}>{t.hl.t}</span> };
  else if (t.sc) deco = { t: t.sc.t, node: (
    <span className="scu">{t.sc.t}<svg viewBox="0 0 100 12" preserveAspectRatio="none" fill="none"><path d="M2 8 C 20 3, 40 11, 60 6 C 75 3, 88 9, 98 6" stroke={t.sc.c} strokeWidth="3.5" strokeLinecap="round" /></svg></span>
  ) };
  else if (t.circ) deco = { t: t.circ.t, node: (
    <span className="circ">{t.circ.t}<svg viewBox="0 0 100 46" preserveAspectRatio="none" fill="none"><path d="M50 5 C 80 3, 97 11, 95 24 C 93 37, 70 43, 46 41 C 20 39, 3 31, 6 19 C 9 8, 30 4, 52 6" stroke={t.circ.c} strokeWidth="3.5" strokeLinecap="round" /></svg></span>
  ) };
  if (!deco) return t.q;
  const parts = t.q.split(deco.t);
  return parts.map((p, i) => (
    <React.Fragment key={i}>{p}{i < parts.length - 1 ? deco!.node : null}</React.Fragment>
  ));
};

const VIEWS = [
  { key: 'dash', label: 'Dashboard', desktop: '/landing/v2/dash.png', mobile: '/landing/v2/dash-m.png', alt: 'PrepTracker dashboard' },
  { key: 'subject', label: 'Subjects', desktop: '/landing/v2/app-subject.png', mobile: '/landing/v2/app-subject-m.png', alt: 'Subject view with units and topics' },
  { key: 'tasks', label: 'Tasks', desktop: '/landing/v2/app-tasks.png', mobile: '/landing/v2/app-tasks-m.png', alt: "Today's tasks" },
  { key: 'library', label: 'Library', desktop: '/landing/v2/app-library.png', mobile: '/landing/v2/app-library-m.png', alt: 'Question paper library' },
];

const TICKER = ['Every topic accounted for', 'Every day counted', 'Know exactly what\u2019s left', 'Walk in ready'];
const STRIP = ['Every subject as units & topics', 'Previous-year questions', 'Daily tasks & streaks', 'SGPA calculator', 'Works offline'];

const LandingPage: React.FC = () => {
  const [view, setView] = useState(0);
  const pullParts = QUOTES.pull.q.split(QUOTES.pull.mark);

  // Sliding pill under the active view tab: re-measured on tab change,
  // mount, font load and resize; first paint is instant, later moves slide.
  const switcherRef = React.useRef<HTMLDivElement>(null);
  const pillRef = React.useRef<HTMLSpanElement>(null);
  const firstPill = React.useRef(true);
  const movePill = (instant: boolean) => {
    const sw = switcherRef.current;
    const pill = pillRef.current;
    if (!sw || !pill) return;
    const b = sw.querySelectorAll('button')[view] as HTMLElement | undefined;
    if (!b) return;
    if (instant) pill.style.transition = 'none';
    pill.style.left = `${b.offsetLeft}px`;
    pill.style.width = `${b.offsetWidth}px`;
    if (instant) {
      void pill.offsetHeight;
      pill.style.transition = '';
    }
  };
  React.useLayoutEffect(() => {
    movePill(firstPill.current);
    firstPill.current = false;
  });
  React.useEffect(() => {
    const sync = () => movePill(true);
    window.addEventListener('resize', sync);
    window.addEventListener('load', sync);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sync);
    return () => {
      window.removeEventListener('resize', sync);
      window.removeEventListener('load', sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Paper background while the landing is mounted; restore the app shell theme on unmount.
  useEffect(() => {
    const prevBg = document.body.style.backgroundColor;
    const prevImg = document.body.style.backgroundImage;
    document.body.style.backgroundColor = '#F7F5F2';
    document.body.style.backgroundImage = 'none';
    return () => {
      document.body.style.backgroundColor = prevBg;
      document.body.style.backgroundImage = prevImg;
    };
  }, []);

  // Nav hide-on-scroll, CTA hot swap, scrollspy, scene parallax, scroll reveals.
  useEffect(() => {
    const reduced = reduceMotion();
    const navEl = document.getElementById('lp2-nav');
    const navCta = document.getElementById('lp2-navCta');
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (navEl) {
        navEl.classList.toggle('hide', y > lastY + 4 && y > 340);
        if (y < lastY - 4) navEl.classList.remove('hide');
      }
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const heroCta = document.querySelector('.lp2 .hero .cta-main');
    let ctaObs: IntersectionObserver | null = null;
    if (heroCta && navCta) {
      ctaObs = new IntersectionObserver((es) => navCta.classList.toggle('hot', !es[0].isIntersecting), { threshold: 0 });
      ctaObs.observe(heroCta);
    }

    const spy = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        document.querySelectorAll('.lp2 .nav-link').forEach((l) => l.classList.remove('act'));
        const link = document.querySelector(`.lp2 .nav-link[data-sec="${e.target.id}"]`);
        if (link) link.classList.add('act');
      });
    }, { rootMargin: '-38% 0px -55% 0px' });
    ['problem', 'features', 'how'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });

    const scene = document.querySelector('.lp2 .scene');
    let sceneScroll: (() => void) | null = null;
    if (scene && !reduced) {
      const vil = scene.querySelector('.villain') as HTMLElement | null;
      const sheets = Array.from(scene.querySelectorAll('.sheet')) as HTMLElement[];
      let tick = false;
      sceneScroll = () => {
        if (tick) return;
        tick = true;
        requestAnimationFrame(() => {
          const r = scene.getBoundingClientRect();
          const p = Math.min(1, Math.max(0, 1 - (r.top + r.height * 0.5) / window.innerHeight)) - 0.5;
          if (vil) vil.style.transform = `translateY(calc(-50% + ${p * 56}px))`;
          sheets.forEach((el, i) => el.style.setProperty('--py', `${p * (i - 1) * 26}px`));
          tick = false;
        });
      };
      window.addEventListener('scroll', sceneScroll, { passive: true });
    }

    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }), { threshold: 0.18 });
    document.querySelectorAll('.lp2 .reveal, .lp2 .reveal-fl').forEach((el) => {
      if (reduced) el.classList.add('in');
      else io.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (sceneScroll) window.removeEventListener('scroll', sceneScroll);
      ctaObs?.disconnect();
      spy.disconnect();
      io.disconnect();
    };
  }, []);

  // Intro motion (skipped under reduced motion).
  useGSAP(() => {
    if (reduceMotion()) return;
    gsap.fromTo('.lp2 .line', { yPercent: 112 }, { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.1, delay: 0.15 });
    gsap.fromTo(['.lp2 .sub', '.lp2 .cta-row', '.lp2 .fud'], { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.35 });
    gsap.fromTo(['.lp2 .try', '.lp2 .switcher'], { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out', delay: 0.75 });
    gsap.fromTo('.lp2 .window', { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, ease: 'power3.out', delay: 0.85 });
    gsap.fromTo('.lp2 .strip', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, delay: 1.5 });
    if (window.matchMedia('(pointer:fine)').matches) {
      const onMove = (e: MouseEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        gsap.to('.lp2 .window', { x: nx * 6, duration: 1.2, ease: 'power2.out' });
      };
      window.addEventListener('mousemove', onMove);
      return () => window.removeEventListener('mousemove', onMove);
    }
  });

  return (
    <div className="lp2">
      <nav id="lp2-nav" aria-label="Main">
        <Link className="brand" to="/landing" aria-label="PrepTracker home">
          <LogoMark size={27} />
          <b>PrepTracker</b>
        </Link>
        <div className="nav-links">
          <a className="nav-link" href="#problem" data-sec="problem">Problem</a>
          <a className="nav-link" href="#features" data-sec="features">Features</a>
          <a className="nav-link" href="#how" data-sec="how">How it works</a>
        </div>
        <Link className="nav-cta" id="lp2-navCta" to="/onboarding">Start</Link>
      </nav>

      <main>
        <section className="hero" aria-label="Hero">
          <div className="copyband">
            <div className="copy-left">
              <h1 aria-label="Know exactly what's left before your exam.">
                <span className="mask" aria-hidden="true"><span className="line">Know exactly</span></span>
                <span className="mask" aria-hidden="true"><span className="line">what&rsquo;s <em>left.</em></span></span>
              </h1>
              <p className="sub">PrepTracker breaks the syllabus into units and topics, counts the days to your exam, and tells you what to study today.</p>
              <div className="cta-row">
                <Link className="cta-main" to="/onboarding">Start tracking
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
                <p className="fud">Free &middot; No account &middot; Data stays in your browser</p>
              </div>
            </div>
          </div>

          <div className="try reveal-x"><span className="live"></span>Try the app<span className="try-sub">four real views, captured inside it</span></div>
          <div className="switchwrap">
            <div className="switcher" role="tablist" aria-label="Preview the app" ref={switcherRef}>
              <span className="sw-pill" ref={pillRef} aria-hidden="true"></span>
              {VIEWS.map((v, i) => (
                <button key={v.key} type="button" role="tab" aria-selected={view === i} className={view === i ? 'on' : ''} onClick={() => setView(i)}>{v.label}</button>
              ))}
            </div>
          </div>

          <div className="stage" id="stage">
            <div className="window-back" aria-hidden="true"></div>
            <div className="window">
              <div className="screen" id="screen">
                {VIEWS.map((v, i) => (
                  <picture key={v.key}>
                    <source media="(max-width:900px)" srcSet={v.mobile} />
                    <img src={v.desktop} className={view === i ? 'on' : ''} alt={v.alt} />
                  </picture>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="strip" aria-label="What is inside">
          <div className="strip-track">
            {STRIP.map((t, i) => (
              <span key={t} className={i === STRIP.length - 1 ? 'it5' : undefined}>{t}</span>
            ))}
            {STRIP.map((t) => (
              <span key={`dup-${t}`} className="dup" aria-hidden="true">{t}</span>
            ))}
          </div>
        </section>

        {/* 4. PROBLEM - visual-led problem */}
        <section className="sec problem" id="problem" aria-label="The problem">
          <p className="eyebrow reveal">The problem</p>
          <h2 className="reveal">It&rsquo;s 2 AM and the syllabus<br />still isn&rsquo;t <em>a plan.</em></h2>
          <p className="lead reveal">Nineteen days out, you have a folder of PDFs, four group chats, and no honest answer to one simple question: what exactly is left?</p>
          <div className="scene reveal" aria-hidden="true">
            <div className="villain"><span className="vnum">19</span><span className="vlab">days left</span></div>
            <div className="ink-note">where do I even start?
              <svg viewBox="0 0 96 110"><path d="M88 6 C 60 20, 30 34, 22 62 C 19 74, 22 86, 30 96 M 20 84 L 30 98 L 44 90" /></svg>
            </div>
            <div className="sheet sheet-a">
              <p className="s-head">Unit 3 &middot; Syllabus</p>
              <ul>
                <li className="done">3.1 Introduction &amp; definitions</li>
                <li className="done">3.2 Core theorems</li>
                <li>3.3 Worked examples</li>
                <li>3.4 Derivation sets</li>
                <li>3.5 Past paper questions</li>
              </ul>
            </div>
            <div className="sheet sheet-b">
              <p className="s-file">imp_questions_FINAL(2).pdf</p>
              <div className="qrow">Q1. Define the key terms, 2 short notes.</div>
              <div className="qrow">Q2. Derive the standard result.</div>
              <div className="qrow struck">Q3. Numericals from examples 3.4 to 3.9.</div>
              <div className="qrow">Q4. One full past paper, timed.</div>
            </div>
            <div className="sheet sheet-c">
              <p className="s-head">Revision plan (v5)</p>
              <div className="plan-row"><span>MON</span><span>Unit 3</span></div>
              <div className="plan-row"><span>TUE</span><span>Unit 3, again</span></div>
              <div className="plan-row"><span>WED</span><span>Unit 3, actually this time</span></div>
              <div className="plan-row"><span>THU</span><span>Start Unit 4?</span></div>
            </div>
          </div>
        </section>

        {/* 5. FEATURE SHOWCASE - shown not told */}
        <section className="sec feat" id="features" aria-label="Features">
          <p className="eyebrow reveal">The fix</p>
          <h2 className="reveal">Everything the syllabus hides, <em>laid out.</em></h2>

          <div className="feat-row reveal">
            <div className="feat-copy">
              <p className="feat-num">01</p>
              <h3>Your whole exam, on one screen</h3>
              <p>Progress across every subject, the days left, and today&rsquo;s streak. The numbers you used to guess, counted for you.</p>
            </div>
            <div className="feat-shot"><img src="/landing/v2/full-dash.png" alt="The PrepTracker dashboard with progress, days to exam and streak." /></div>
          </div>

          <div className="feat-row flip reveal">
            <div className="feat-copy">
              <p className="feat-num">02</p>
              <h3>Every unit, every topic, one tick at a time</h3>
              <p>Each subject broken into its real units and topics. Tick them off as you study and watch the unit flip to mastered.</p>
            </div>
            <div className="feat-shot"><img src="/landing/v2/full-subject.png" alt="A subject broken into units and topics with progress." /></div>
          </div>

          <div className="feat-row reveal">
            <div className="feat-copy">
              <p className="feat-num">03</p>
              <h3>Wake up to today&rsquo;s list</h3>
              <p>No planning session every morning. Open the app and the day&rsquo;s tasks are already there, sized to the days left.</p>
            </div>
            <div className="feat-shot"><img src="/landing/v2/full-tasks.png" alt="The tasks view with today's study tasks." /></div>
          </div>

          <div className="feat-row flip reveal">
            <div className="feat-copy">
              <p className="feat-num">04</p>
              <h3>Question papers where you study</h3>
              <p>Previous-year papers and resources sit next to the units they belong to, not in a drive folder you never open.</p>
            </div>
            <div className="feat-shot"><img src="/landing/v2/full-library.png" alt="The library of previous-year question papers." /></div>
          </div>
        </section>

        {/* 6. HOW IT WORKS */}
        <section className="sec hiw" id="how" aria-label="How it works">
          <p className="eyebrow reveal">How it works</p>
          <h2 className="reveal">Set up once. <em>Tracked every day.</em></h2>
          <div className="steps">
            <div className="step reveal">
              <p className="n">01<i>.</i></p>
              <h4>Pick your subjects</h4>
              <p>Choose your subjects in the app. Each one shows its units and topics laid out. Select yours and you&rsquo;re done.</p>
            </div>
            <div className="step reveal">
              <p className="n">02<i>.</i></p>
              <h4>Tick topics as you study</h4>
              <p>Finished a topic? Tick it. That one habit is the entire system. The app does every calculation after that.</p>
            </div>
            <div className="step reveal">
              <p className="n">03<i>.</i></p>
              <h4>See what&rsquo;s left, every morning</h4>
              <p>Progress, streaks and the countdown update themselves. You always know exactly what&rsquo;s left before the exam.</p>
            </div>
          </div>
        </section>

        {/* 7. TESTIMONIALS - editorial pull quote + endless marquee of note cards.
            PLACEHOLDER SECTION: every quote below is DEMO copy. The owner chose to
            ship it on production for now and will replace it with real, collected
            quotes. Every node carries data-placeholder="testimonial". Edit the
            single QUOTES object at the top of this file to swap. */}
        <section className="sec testi" aria-label="What students say">
          <p className="eyebrow reveal">Word of mouth</p>
          <h2 className="reveal">In their <em>own words.</em></h2>
          <figure className="pull reveal" data-placeholder="testimonial">
            <blockquote>
              <span className="qm">&ldquo;</span>{pullParts[0]}<mark>{QUOTES.pull.mark}</mark>{pullParts[1]}<span className="qm">&rdquo;</span>
            </blockquote>
            <figcaption><b>{QUOTES.pull.name}</b> &middot; {QUOTES.pull.tag}</figcaption>
          </figure>
          <div className="mq">
            <div className="mq-track">
              {[false, true].map((dup) => (
                <div key={dup ? 'dup' : 'main'} className={`mq-set${dup ? ' dup' : ''}`} aria-hidden={dup ? true : undefined}>
                  {[QUOTES.clusterA, QUOTES.clusterB].map((cluster, ci) => (
                    <div className="bento" key={ci}>
                      {cluster.map((t) => (
                        <figure key={t.name} className={`bt ${t.size} ${t.fill}`} data-placeholder="testimonial">
                          {tileDoodles(t)}
                          <blockquote>{tileQuote(t)}</blockquote>
                          <figcaption><b>{t.name}</b><span>{t.tag}</span></figcaption>
                        </figure>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. FINAL CTA + FOOTER */}
        <section className="final" aria-label="Final call to action">
          <div className="final-panel reveal">
            <div className="fp-glow" aria-hidden="true">
              <svg viewBox="0 0 1440 720" preserveAspectRatio="xMidYMax slice">
                <path className="fl f1" fill="#F02A41" d="M-40,760 L-40,240 C140,150 300,330 520,230 C740,120 920,330 1140,220 C1280,140 1380,270 1480,200 L1480,760 Z" />
                <path className="fl f2" fill="#FF9200" d="M-40,760 L-40,470 C180,380 360,560 580,450 C800,340 960,560 1180,440 C1310,380 1410,500 1480,430 L1480,760 Z" />
                <path className="fl f3" fill="#FFFFFF" d="M-40,760 L-40,648 C220,580 400,700 640,630 C880,560 1050,690 1260,636 C1370,606 1440,656 1480,638 L1480,760 Z" />
              </svg>
            </div>
            <div className="fp-rules"></div>
            <LogoMark variant="white" size={560} className="fp-ghost" />
            <h2>Walk in knowing<br />what&rsquo;s <em style={{ color: '#fff', textDecoration: 'underline', textUnderlineOffset: '10px', textDecorationThickness: '4px' }}>left.</em></h2>
            <p className="subf">Two minutes to set up. Then the app counts the days, the units and the topics. You just study.</p>
            <Link className="cta-white" to="/onboarding">Start tracking
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="#D61A40" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
            <p className="fud">Free &middot; No account &middot; Data stays in your browser</p>
          </div>
        </section>
        <footer aria-label="Footer">
          <div className="ticker" aria-hidden="true">
            <div className="ticker-track">
              {[0, 1].map((round) => (
                <React.Fragment key={round}>
                  {TICKER.map((t) => (
                    <React.Fragment key={`${round}-${t}`}><span>{t}</span><i>&#183;</i></React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="foot-main">
            <p className="foot-lockup reveal-fl" aria-label="PrepTracker">
              {'PrepTracker.'.split('').map((ch, i) => (
                <span key={i} className={`fl${ch === '.' ? ' rd' : ''}`} style={{ transitionDelay: `${i * 0.05}s` }} aria-hidden="true">{ch}</span>
              ))}
            </p>
            <div className="foot-grid">
              <div className="foot-about">
                <LogoMark size={34} />
                <p>The exam desk. Syllabus progress, study resources and tasks in one place. Free, open source, and private by design.</p>
                <p className="foot-sign">Built by a student, for students</p>
              </div>
              <nav className="foot-col" aria-label="Product">
                <h3>Product</h3>
                <Link to="/onboarding">Open the app</Link>
                <a href="#features">Features</a>
                <a href="#how">How it works</a>
              </nav>
              <nav className="foot-col" aria-label="Project">
                <h3>Project</h3>
                <a href="https://github.com/manav4u/PrepTracker">Source on GitHub</a>
                <a href="https://github.com/manav4u/PrepTracker/issues">Report an issue</a>
              </nav>
            </div>
            <div className="foot-bar">
              <span>&copy; 2026 PrepTracker</span>
              <span className="foot-sign2">See you in the exam hall.</span>
              <span>Free &middot; No ads &middot; No tracking</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
