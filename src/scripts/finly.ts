import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const page = document.querySelector<HTMLElement>('[data-finly-page]');

if (page) {
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* Keep Back to top on the Finly page */
  const backToTop = document.querySelector<HTMLAnchorElement>('.back-to-top');

  if (backToTop) {
    backToTop.href = '#finly-top';

    backToTop.addEventListener('click', (event) => {
      event.preventDefault();

      document.getElementById('finly-top')?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  }

  if (!reducedMotion) {
    const context = gsap.context(() => {

      /* HERO REVEAL */

      const heroTimeline = gsap.timeline({
        defaults: {
          ease: 'power3.out',
        },
      });

      heroTimeline
        .from('[data-finly-kicker]', {
          autoAlpha: 0,
          y: 18,
          duration: .7,
        })
        .from('[data-finly-title]', {
          autoAlpha: 0,
          y: 35,
          duration: 1,
        }, '-=.35')
        .from('[data-finly-intro]', {
          autoAlpha: 0,
          y: 22,
          duration: .75,
        }, '-=.55')
        .from('[data-finly-actions]', {
          autoAlpha: 0,
          y: 18,
          duration: .65,
        }, '-=.45')
        .from('[data-finly-assurances]', {
          autoAlpha: 0,
          y: 12,
          duration: .6,
        }, '-=.4')
        .from('.finly-device', {
          autoAlpha: 0,
          scale: .94,
          y: 35,
          duration: 1.1,
        }, '-=1');

      /* SCROLL REVEALS */

      page.querySelectorAll<HTMLElement>('[data-finly-reveal]').forEach((element) => {
        gsap.fromTo(
          element,
          {
            autoAlpha: 0,
            y: 27,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: .85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 86%',
              once: true,
            },
          }
        );
      });

      /* DONUT CHART ANIMATION */

      page.querySelectorAll<HTMLElement>('[data-finly-chart]').forEach((chart) => {
        ScrollTrigger.create({
          trigger: chart,
          start: 'top 82%',
          once: true,

          onEnter: () => {
            const segments = chart.querySelectorAll<SVGCircleElement>(
              '[data-finly-segment]'
            );

            const circumference = 327;

            segments.forEach((segment, index) => {
              const dashValues = segment
                .getAttribute('stroke-dasharray')
                ?.split(/\s+/);

              const segmentLength = Number(dashValues?.[0] || 0);

              gsap.fromTo(
                segment,
                {
                  strokeDasharray: `0 ${circumference}`,
                  opacity: .45,
                },
                {
                  strokeDasharray: `${segmentLength} ${circumference}`,
                  opacity: 1,
                  duration: 1.25,
                  delay: index * .09,
                  ease: 'power2.out',
                }
              );
            });

            /* BAR CHART ANIMATION */

            const bars = chart.querySelectorAll<HTMLElement>(
              '[data-finly-bar]'
            );

            gsap.fromTo(
              bars,
              {
                scaleY: 0,
                transformOrigin: 'bottom',
              },
              {
                scaleY: 1,
                duration: 1.05,
                stagger: .055,
                ease: 'power3.out',
              }
            );

            /* LINE CHART DRAWING */

            const paths = chart.querySelectorAll<SVGPathElement>(
              '[data-finly-line]'
            );

            paths.forEach((path, index) => {
              const length = path.getTotalLength();

              gsap.set(path, {
                strokeDasharray: length,
                strokeDashoffset: length,
              });

              gsap.to(path, {
                strokeDashoffset: 0,
                duration: 1.8,
                delay: index * .25,
                ease: 'power2.inOut',
              });
            });
          },
        });
      });

      /* BUDGET / EXPORT VISUAL DETAILS */

      page.querySelectorAll<HTMLElement>('.finly-export-card').forEach((card) => {
        gsap.fromTo(
          card,
          {
            y: 24,
            rotate: 5,
            autoAlpha: .5,
          },
          {
            y: 0,
            rotate: 2,
            autoAlpha: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              once: true,
            },
          }
        );
      });

      /* FAQ POLISH */

      const faqItems = page.querySelectorAll<HTMLDetailsElement>(
        '.finly-faq-item'
      );

      faqItems.forEach((item) => {
        item.addEventListener('toggle', () => {
          if (!item.open) return;

          faqItems.forEach((other) => {
            if (other !== item) other.open = false;
          });
        });
      });

    }, page);

    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    }, { once: true });

    window.addEventListener('pagehide', () => {
      context.revert();
    }, { once: true });

  }
}
