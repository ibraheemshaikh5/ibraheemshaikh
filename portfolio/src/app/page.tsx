"use client";

import { useEffect, useRef, useState, ReactNode, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ShinyText from "@/components/ui/ShinyText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

// TiltCard component - creates 3D tilt effect with light-catching gradient
interface TiltCardProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

function TiltCard({ children, className = "", id }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Detect if this is a colored card (accent bg or foreground bg)
  const isColoredCard = className.includes("bg-accent") || className.includes("bg-foreground");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (max 3 degrees - subtle like precision engineering)
    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;

    // Calculate glare position (percentage)
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`);
    setGlarePosition({ x: glareX, y: glareY });
  };

  const handleMouseLeave = () => {
    setTransform("");
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Different glare styles for colored vs white cards
  const coloredCardGlare = `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(0, 92, 53, 0.35) 0%, rgba(0, 66, 37, 0.15) 25%, transparent 60%)`;

  // White cards get a subtle warm white/cream glow that mimics light reflection
  const whiteCardGlare = `radial-gradient(ellipse 60% 50% at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 252, 245, 0.9) 0%, rgba(255, 250, 240, 0.4) 30%, transparent 70%)`;

  return (
    <div
      ref={cardRef}
      id={id}
      className={`bento-card relative overflow-hidden ${className}`}
      style={{
        transform: transform,
        transition: "transform 0.15s ease-out",
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Light-catching glare overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
        style={{
          background: isColoredCard ? coloredCardGlare : whiteCardGlare,
          opacity: isHovered ? 1 : 0,
        }}
      />
      {/* Secondary shine for metallic effect - stronger on white cards */}
      <div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
        style={{
          background: `linear-gradient(${105 + (glarePosition.x - 50) * 0.5}deg, transparent 30%, rgba(255, 255, 255, ${isColoredCard ? 0.15 : 0.4}) 50%, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      {/* Subtle shadow/depth on white cards for that car paint depth */}
      {!isColoredCard && (
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          style={{
            background: `radial-gradient(ellipse 80% 60% at ${100 - glarePosition.x}% ${100 - glarePosition.y}%, rgba(0, 0, 0, 0.03) 0%, transparent 50%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />
      )}
      {children}
    </div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to section
  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    // Initialize Lenis for butter-smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // Hero entrance animations
      const heroTl = gsap.timeline();

      heroTl
        .from(".hero-tagline", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        })
        .from(".hero-name", {
          y: 80,
          opacity: 0,
          duration: 1,
          ease: "power4.out",
        }, "-=0.4")
        .from(".hero-divider", {
          scaleX: 0,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        }, "-=0.5")
        .from(".hero-description", {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        }, "-=0.3")
        .from(".scroll-indicator", {
          y: -20,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        }, "-=0.2");

      // Hero decorative elements fade in
      gsap.from(".hero-decor", {
        opacity: 0,
        duration: 1.5,
        stagger: 0.1,
        delay: 0.5,
        ease: "power2.out",
      });

      // Hero section - dramatic exit with scale and blur feel
      gsap.to(".hero-content", {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
        y: 200,
        scale: 0.9,
        opacity: 0,
        ease: "none",
      });

      // Hero background fades to dark as you leave
      gsap.to(".hero-bg-overlay", {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "60% top",
          end: "bottom top",
          scrub: 1,
        },
        opacity: 1,
        ease: "none",
      });

      // Hero decorative elements parallax (different speeds for depth)
      gsap.to(".hero-decor-left", {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
        y: 120,
        x: -50,
        opacity: 0,
        ease: "none",
      });

      gsap.to(".hero-decor-right", {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
        y: 120,
        x: 50,
        opacity: 0,
        ease: "none",
      });

      // Corner decorations move slower (far background feel)
      gsap.to(".hero-corner-decor", {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 2,
        },
        y: 60,
        scale: 0.8,
        opacity: 0,
        ease: "none",
      });

      // === TRANSITION ZONE - The "portal" between worlds ===
      gsap.to(".transition-zone", {
        scrollTrigger: {
          trigger: ".transition-zone",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        backgroundPosition: "50% 100%",
        ease: "none",
      });

      // Transition zone elements animate
      gsap.from(".transition-text", {
        scrollTrigger: {
          trigger: ".transition-zone",
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
        },
        y: 50,
        opacity: 0,
        ease: "none",
      });

      gsap.to(".transition-text", {
        scrollTrigger: {
          trigger: ".transition-zone",
          start: "top 30%",
          end: "bottom top",
          scrub: 1,
        },
        y: -50,
        opacity: 0,
        ease: "none",
      });

      // === BENTO SECTION - New world entrance ===
      // Section background color shift
      gsap.from(".bento-world", {
        scrollTrigger: {
          trigger: bentoRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        },
        opacity: 0,
        scale: 0.98,
        ease: "none",
      });

      // Section header with dramatic reveal
      gsap.from(".section-header", {
        scrollTrigger: {
          trigger: ".section-header",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Horizontal lines expand
      gsap.from(".section-line-left", {
        scrollTrigger: {
          trigger: ".section-header",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        scaleX: 0,
        transformOrigin: "right center",
        duration: 1.2,
        ease: "power3.out",
      });

      gsap.from(".section-line-right", {
        scrollTrigger: {
          trigger: ".section-header",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.2,
        ease: "power3.out",
      });

      // Bento cards - dramatic staggered reveal
      const bentoCards = gsap.utils.toArray<HTMLElement>(".bento-card");

      bentoCards.forEach((card, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const isEven = i % 2 === 0;

        // Initial reveal animation
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
          y: 100,
          x: col === 0 ? -60 : col === 2 ? 60 : 0,
          opacity: 0,
          scale: 0.9,
          rotateX: 10,
          rotateY: isEven ? -8 : 8,
          duration: 1,
          delay: (i % 4) * 0.08,
          ease: "power3.out",
        });

        // Continuous parallax while in view
        gsap.to(card, {
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
          y: row % 2 === 0 ? -40 : -60,
          ease: "none",
        });
      });

      // Bento background pattern parallax
      gsap.to(".bento-pattern", {
        scrollTrigger: {
          trigger: bentoRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
        y: -100,
        ease: "none",
      });

      // Side accents float
      gsap.to(".bento-side-accent", {
        scrollTrigger: {
          trigger: bentoRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        y: -50,
        ease: "none",
      });

      // === FOOTER SECTION - Final world ===
      gsap.from(".footer-world", {
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          end: "top 50%",
          scrub: 1,
        },
        opacity: 0,
        ease: "none",
      });

      gsap.from(".footer-content", {
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Footer arch decoration
      gsap.from(".footer-arch", {
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
        scaleY: 0,
        transformOrigin: "bottom center",
        duration: 1.2,
        ease: "power3.out",
      });
    });

    return () => {
      ctx.revert();
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  return (
    <main className="min-h-screen bg-background font-sans relative">
      {/* Navigation - Porsche minimal style */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <a
            href="#"
            onClick={(e) => scrollToSection(e, 'hero')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <span className="font-heading text-sm font-bold tracking-[0.15em] uppercase">
              Ibraheem
            </span>
            <span className="text-[9px] tracking-[0.2em] text-muted-foreground font-heading">
              / SWE
            </span>
          </a>
          <div className="flex items-center gap-8">
            <a
              href="#about"
              onClick={(e) => scrollToSection(e, 'about')}
              className="text-[11px] tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors font-heading uppercase"
            >
              About
            </a>
            <a
              href="#projects"
              onClick={(e) => scrollToSection(e, 'projects')}
              className="text-[11px] tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors font-heading uppercase"
            >
              Projects
            </a>
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, 'contact')}
              className="text-[11px] tracking-[0.15em] bg-accent text-accent-foreground px-5 py-2.5 hover:bg-accent/90 transition-colors font-heading uppercase font-medium"
            >
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        ref={heroRef}
        className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 relative overflow-hidden"
      >
        {/* Background overlay that fades to dark on scroll */}
        <div className="hero-bg-overlay absolute inset-0 bg-gradient-to-b from-foreground/90 to-foreground pointer-events-none opacity-0 z-0" />
        {/* Japanese-inspired vertical text on left - like gallery plaques */}
        <div className="hero-decor hero-decor-left absolute left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-6">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-accent/30" />
          <p
            className="text-[10px] tracking-[0.4em] text-accent/50 font-heading font-medium uppercase"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            精密 · Precision
          </p>
          <div className="w-px h-16 bg-gradient-to-t from-transparent to-accent/30" />
        </div>

        {/* Japanese-inspired vertical text on right */}
        <div className="hero-decor hero-decor-right absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-6">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-accent/30" />
          <p
            className="text-[10px] tracking-[0.4em] text-accent/50 font-heading font-medium uppercase"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
          >
            創造 · Create
          </p>
          <div className="w-px h-16 bg-gradient-to-t from-transparent to-accent/30" />
        </div>

        {/* Moroccan geometric corner ornaments - zellige inspired */}
        <div className="hero-decor hero-corner-decor absolute top-20 left-8 w-20 h-20 opacity-20">
          <svg viewBox="0 0 80 80" className="w-full h-full">
            {/* 8-pointed star / Islamic geometric pattern */}
            <path
              d="M40 0 L45 15 L60 10 L55 25 L70 30 L55 35 L60 50 L45 45 L40 60 L35 45 L20 50 L25 35 L10 30 L25 25 L20 10 L35 15 Z"
              fill="none"
              stroke="#004225"
              strokeWidth="0.5"
              transform="translate(10, 10) scale(0.75)"
            />
            <circle cx="40" cy="40" r="3" fill="none" stroke="#004225" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="hero-decor hero-corner-decor absolute top-20 right-8 w-20 h-20 opacity-20">
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <path
              d="M40 0 L45 15 L60 10 L55 25 L70 30 L55 35 L60 50 L45 45 L40 60 L35 45 L20 50 L25 35 L10 30 L25 25 L20 10 L35 15 Z"
              fill="none"
              stroke="#004225"
              strokeWidth="0.5"
              transform="translate(10, 10) scale(0.75)"
            />
            <circle cx="40" cy="40" r="3" fill="none" stroke="#004225" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="hero-decor hero-corner-decor absolute bottom-20 left-8 w-20 h-20 opacity-20">
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <path
              d="M40 0 L45 15 L60 10 L55 25 L70 30 L55 35 L60 50 L45 45 L40 60 L35 45 L20 50 L25 35 L10 30 L25 25 L20 10 L35 15 Z"
              fill="none"
              stroke="#004225"
              strokeWidth="0.5"
              transform="translate(10, 10) scale(0.75)"
            />
            <circle cx="40" cy="40" r="3" fill="none" stroke="#004225" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="hero-decor hero-corner-decor absolute bottom-20 right-8 w-20 h-20 opacity-20">
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <path
              d="M40 0 L45 15 L60 10 L55 25 L70 30 L55 35 L60 50 L45 45 L40 60 L35 45 L20 50 L25 35 L10 30 L25 25 L20 10 L35 15 Z"
              fill="none"
              stroke="#004225"
              strokeWidth="0.5"
              transform="translate(10, 10) scale(0.75)"
            />
            <circle cx="40" cy="40" r="3" fill="none" stroke="#004225" strokeWidth="0.5" />
          </svg>
        </div>

        {/* Japanese-inspired horizontal line - like a zen garden rake line */}
        <div className="hero-decor absolute top-1/2 left-0 right-0 flex items-center justify-center">
          <div className="w-full max-w-3xl flex items-center gap-4 px-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/15" />
            <div className="w-1 h-1 rounded-full bg-accent/30" />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/15" />
          </div>
        </div>

        <div className="hero-content text-center max-w-4xl relative z-10">
          {/* Model designation with Japanese minimal aesthetic */}
          <p className="hero-tagline text-[11px] tracking-[0.5em] text-accent font-heading font-semibold uppercase mb-6">
            Software Engineer
          </p>

          <h1 className="hero-name font-heading text-6xl md:text-8xl font-bold tracking-tight mb-6 uppercase">
            <ShinyText
              text="Ibraheem Shaikh"
              color="#1a1a1a"
              shineColor="#004225"
              speed={4}
              className="font-heading"
            />
          </h1>

          {/* Japanese-inspired divider with Moroccan star */}
          <div className="hero-divider flex items-center justify-center gap-6 mb-8">
            <div className="w-12 h-px bg-accent/30" />
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-accent/40">
              {/* Small 8-pointed star */}
              <path
                d="M12 0 L13.5 4.5 L18 3 L16.5 7.5 L21 9 L16.5 10.5 L18 15 L13.5 13.5 L12 18 L10.5 13.5 L6 15 L7.5 10.5 L3 9 L7.5 7.5 L6 3 L10.5 4.5 Z"
                fill="currentColor"
                transform="translate(0, 3) scale(0.75)"
              />
            </svg>
            <span className="text-xs tracking-[0.3em] text-muted-foreground font-heading">EST. 2022</span>
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-accent/40">
              <path
                d="M12 0 L13.5 4.5 L18 3 L16.5 7.5 L21 9 L16.5 10.5 L18 15 L13.5 13.5 L12 18 L10.5 13.5 L6 15 L7.5 10.5 L3 9 L7.5 7.5 L6 3 L10.5 4.5 Z"
                fill="currentColor"
                transform="translate(0, 3) scale(0.75)"
              />
            </svg>
            <div className="w-12 h-px bg-accent/30" />
          </div>

          <p className="hero-description text-lg text-muted-foreground max-w-xl mx-auto font-light">
            Building bold ideas at the intersection of{" "}
            <span className="text-foreground font-medium">tech</span>,{" "}
            <span className="text-foreground font-medium">finance</span>, and{" "}
            <span className="text-foreground font-medium">design</span>.
          </p>
        </div>

        {/* Scroll indicator - Japanese calligraphy brush stroke style */}
        <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-[9px] tracking-[0.3em] text-muted-foreground/60 font-heading uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-accent/50 via-accent/30 to-transparent animate-pulse" style={{ borderRadius: '2px' }} />
        </div>
      </section>

      {/* Transition Zone - Portal between worlds */}
      <div className="transition-zone relative h-[50vh] overflow-hidden flex items-center justify-center"
        style={{
          background: 'linear-gradient(180deg, var(--background) 0%, #f5f0e8 30%, #ebe5db 50%, #f5f0e8 70%, var(--background) 100%)',
          backgroundSize: '100% 200%',
          backgroundPosition: '50% 0%',
        }}
      >
        {/* Moroccan-inspired geometric transition element */}
        <div className="absolute inset-0 opacity-[0.04]">
          <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="transition-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M50 0 L60 20 L80 15 L70 35 L90 50 L70 65 L80 85 L60 80 L50 100 L40 80 L20 85 L30 65 L10 50 L30 35 L20 15 L40 20 Z"
                  fill="none" stroke="#004225" strokeWidth="0.5" transform="scale(0.5) translate(50, 50)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#transition-pattern)" />
          </svg>
        </div>

        {/* Transition text/element */}
        <div className="transition-text text-center relative z-10">
          <div className="flex items-center gap-8">
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-accent/30" />
            <span className="text-[9px] tracking-[0.5em] text-accent/40 font-heading uppercase">Explore</span>
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-accent/30" />
          </div>
        </div>

        {/* Gradient overlays for smooth blending */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Bento Grid Section */}
      <section ref={bentoRef} className="px-6 py-20 relative">
        {/* Bento world wrapper for section-level animations */}
        <div className="bento-world">
        {/* Moroccan zellige-inspired tessellation pattern */}
        <div className="bento-pattern absolute inset-0 pointer-events-none opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="moroccan-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                {/* Interlocking geometric shapes */}
                <path d="M30 0 L40 10 L30 20 L20 10 Z" fill="none" stroke="#004225" strokeWidth="0.5" />
                <path d="M0 30 L10 40 L0 50 L-10 40 Z" fill="none" stroke="#004225" strokeWidth="0.5" transform="translate(10, -10)" />
                <path d="M60 30 L70 40 L60 50 L50 40 Z" fill="none" stroke="#004225" strokeWidth="0.5" transform="translate(-10, -10)" />
                <path d="M30 60 L40 70 L30 80 L20 70 Z" fill="none" stroke="#004225" strokeWidth="0.5" transform="translate(0, -20)" />
                <circle cx="30" cy="30" r="2" fill="none" stroke="#004225" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#moroccan-pattern)" />
          </svg>
        </div>

        {/* Japanese-inspired side accents - like shoji screen frames */}
        <div className="bento-side-accent absolute left-4 top-20 bottom-20 w-px bg-gradient-to-b from-transparent via-accent/10 to-transparent" />
        <div className="bento-side-accent absolute right-4 top-20 bottom-20 w-px bg-gradient-to-b from-transparent via-accent/10 to-transparent" />

        <div className="mx-auto max-w-6xl relative z-10">
          {/* Section Label - Japanese chapter style with Moroccan ornament */}
          <div className="section-header flex items-center gap-6 mb-16">
            <div className="section-line-left h-px flex-1 bg-accent/20" />
            <div className="flex items-center gap-4">
              <svg viewBox="0 0 20 20" className="w-3 h-3 text-accent/40">
                <path d="M10 0 L12 4 L16 3 L14 7 L18 10 L14 13 L16 17 L12 16 L10 20 L8 16 L4 17 L6 13 L2 10 L6 7 L4 3 L8 4 Z" fill="currentColor" />
              </svg>
              <span className="text-[10px] tracking-[0.5em] text-accent font-heading font-semibold uppercase">
                一 · Portfolio
              </span>
              <svg viewBox="0 0 20 20" className="w-3 h-3 text-accent/40">
                <path d="M10 0 L12 4 L16 3 L14 7 L18 10 L14 13 L16 17 L12 16 L10 20 L8 16 L4 17 L6 13 L2 10 L6 7 L4 3 L8 4 Z" fill="currentColor" />
              </svg>
            </div>
            <div className="section-line-right h-px flex-1 bg-accent/20" />
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4 auto-rows-[140px]">

            {/* About Card - Large */}
            <TiltCard
              id="about"
              className="col-span-4 row-span-2 bg-card rounded-3xl p-8 border border-border cursor-pointer group"
            >
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">
                About
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-4 group-hover:text-accent transition-colors">
                Hey, I&apos;m Ibraheem!
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-lg">
                A risk-taker who loves building things that matter. When I&apos;m not coding,
                you&apos;ll find me obsessing over Porsche designs, watching sports, or
                exploring the next big startup idea.
              </p>
            </TiltCard>

            {/* Stats Card - Years */}
            <TiltCard className="col-span-2 row-span-1 bg-card rounded-3xl p-6 border border-border">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
                Experience
              </p>
              <p className="font-heading text-4xl font-semibold">
                3<span className="text-accent">+</span>
              </p>
              <p className="text-sm text-muted-foreground">years coding</p>
            </TiltCard>

            {/* Stats Card - Projects */}
            <TiltCard className="col-span-2 row-span-1 bg-card rounded-3xl p-6 border border-border">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
                Projects
              </p>
              <p className="font-heading text-4xl font-semibold">
                10<span className="text-accent">+</span>
              </p>
              <p className="text-sm text-muted-foreground">shipped</p>
            </TiltCard>

            {/* Featured Project Card - Large */}
            <TiltCard
              id="projects"
              className="col-span-4 md:col-span-3 row-span-2 bg-card rounded-3xl p-8 border border-border cursor-pointer group"
            >
              <div className="relative z-10">
                <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">
                  Featured Project
                </p>
                <h3 className="font-heading text-2xl font-semibold mb-2 group-hover:text-accent transition-colors">
                  Project Name
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  A brief description of your coolest project goes here.
                  What problem did it solve? What tech did you use?
                </p>
                <div className="flex gap-2">
                  <span className="text-xs bg-secondary px-3 py-1 rounded-full">React</span>
                  <span className="text-xs bg-secondary px-3 py-1 rounded-full">TypeScript</span>
                  <span className="text-xs bg-secondary px-3 py-1 rounded-full">Node.js</span>
                </div>
              </div>
            </TiltCard>

            {/* Interests Card */}
            <TiltCard className="col-span-2 md:col-span-3 row-span-2 bg-card rounded-3xl p-8 border border-border">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">
                Interests
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-sm bg-accent/10 text-accent border border-accent/20 px-4 py-2 rounded-full">
                  🏎️ Porsche
                </span>
                <span className="text-sm bg-accent/10 text-accent border border-accent/20 px-4 py-2 rounded-full">
                  ⚽ Sports
                </span>
                <span className="text-sm bg-accent/10 text-accent border border-accent/20 px-4 py-2 rounded-full">
                  🚀 Startups
                </span>
                <span className="text-sm bg-accent/10 text-accent border border-accent/20 px-4 py-2 rounded-full">
                  💹 Finance
                </span>
                <span className="text-sm bg-accent/10 text-accent border border-accent/20 px-4 py-2 rounded-full">
                  🌍 Adventure
                </span>
              </div>
            </TiltCard>

            {/* Tech Stack Card */}
            <TiltCard className="col-span-4 md:col-span-2 row-span-1 bg-card rounded-3xl p-6 border border-border">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-3">
                Tech Stack
              </p>
              <div className="flex gap-4 text-2xl">
                <span title="TypeScript">TS</span>
                <span title="React">⚛️</span>
                <span title="Python">🐍</span>
                <span title="Node.js">💚</span>
              </div>
            </TiltCard>

            {/* Second Project Card */}
            <TiltCard className="col-span-4 md:col-span-2 row-span-2 bg-card rounded-3xl p-8 border border-border cursor-pointer group">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">
                Project
              </p>
              <h3 className="font-heading text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                Another Project
              </h3>
              <p className="text-muted-foreground text-sm">
                Description of another impressive project you&apos;ve built.
              </p>
            </TiltCard>

            {/* Currently Card */}
            <TiltCard className="col-span-2 row-span-1 bg-accent rounded-3xl p-6 text-accent-foreground">
              <p className="text-sm uppercase tracking-widest mb-2 opacity-80">
                Currently
              </p>
              <p className="font-medium">
                Building something cool 🔨
              </p>
            </TiltCard>

            {/* Contact Card - Large */}
            <TiltCard
              id="contact"
              className="col-span-4 md:col-span-4 row-span-2 bg-foreground text-background rounded-3xl p-8 cursor-pointer group"
            >
              <p className="text-sm uppercase tracking-widest mb-4 opacity-60">
                Let&apos;s Connect
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-4">
                Let&apos;s build something{" "}
                <span className="italic">amazing</span> together.
              </h2>
              <div className="flex flex-wrap gap-4 mt-6">
                <a
                  href="mailto:your@email.com"
                  className="text-sm bg-background text-foreground px-4 py-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors relative z-30"
                >
                  Email
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm bg-background text-foreground px-4 py-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors relative z-30"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm bg-background text-foreground px-4 py-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors relative z-30"
                >
                  GitHub
                </a>
              </div>
            </TiltCard>

            {/* Location Card */}
            <TiltCard className="col-span-2 row-span-1 bg-card rounded-3xl p-6 border border-border">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
                Based in
              </p>
              <p className="font-medium">📍 Your City</p>
            </TiltCard>

          </div>
        </div>
        </div>
      </section>

      {/* Transition Zone before Footer */}
      <div className="relative h-[30vh] overflow-hidden flex items-center justify-center"
        style={{
          background: 'linear-gradient(180deg, var(--background) 0%, #f8f5f0 50%, #1a1a1a 100%)',
        }}
      >
        {/* Flowing lines suggesting movement */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <path d="M0 50% Q25% 30%, 50% 50% T 100% 50%" fill="none" stroke="#004225" strokeWidth="0.5" />
            <path d="M0 60% Q25% 40%, 50% 60% T 100% 60%" fill="none" stroke="#004225" strokeWidth="0.3" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-foreground to-transparent" />
      </div>

      {/* Footer - Cultural fusion aesthetic */}
      <footer ref={footerRef} className="px-6 py-16 relative overflow-hidden bg-foreground text-background">
        {/* Footer world wrapper */}
        <div className="footer-world">
        {/* Subtle Moroccan arch pattern at top */}
        <div className="footer-arch absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 opacity-20">
          <svg viewBox="0 0 160 80" className="w-full h-full">
            <path
              d="M0 80 Q80 0 160 80"
              fill="none"
              stroke="#fffbf5"
              strokeWidth="1"
            />
            <path
              d="M20 80 Q80 20 140 80"
              fill="none"
              stroke="#fffbf5"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        <div className="footer-content mx-auto max-w-6xl relative z-10">
          {/* Section header with Moroccan star */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <svg viewBox="0 0 20 20" className="w-3 h-3 text-background/30">
              <path d="M10 0 L12 4 L16 3 L14 7 L18 10 L14 13 L16 17 L12 16 L10 20 L8 16 L4 17 L6 13 L2 10 L6 7 L4 3 L8 4 Z" fill="currentColor" />
            </svg>
            <span className="text-[10px] tracking-[0.5em] text-background/60 font-heading font-semibold uppercase">
              二 · Connect
            </span>
            <svg viewBox="0 0 20 20" className="w-3 h-3 text-background/30">
              <path d="M10 0 L12 4 L16 3 L14 7 L18 10 L14 13 L16 17 L12 16 L10 20 L8 16 L4 17 L6 13 L2 10 L6 7 L4 3 L8 4 Z" fill="currentColor" />
            </svg>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <span className="font-heading text-lg font-bold tracking-tight uppercase text-background">
                Ibraheem Shaikh
              </span>
              <span className="text-background/40">·</span>
              <span className="text-[10px] tracking-[0.3em] text-background/60 font-heading">
                2025
              </span>
            </div>

            <div className="flex items-center gap-8">
              <a href="mailto:ishaikh1@umd.edu" className="text-xs tracking-[0.2em] text-background/70 hover:text-background transition-colors font-heading uppercase">
                Email
              </a>
              <span className="text-background/30">·</span>
              <a href="https://www.linkedin.com/in/ibraheemshaikh/" className="text-xs tracking-[0.2em] text-background/70 hover:text-background transition-colors font-heading uppercase">
                LinkedIn
              </a>
              <span className="text-background/30">·</span>
              <a href="https://github.com/ibraheemshaikh5" className="text-xs tracking-[0.2em] text-background/70 hover:text-background transition-colors font-heading uppercase">
                GitHub
              </a>
            </div>
          </div>

        </div>
        </div>
      </footer>
    </main>
  );
}
