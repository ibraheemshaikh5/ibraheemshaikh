"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from(".hero-name", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      });

      gsap.from(".hero-title", {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power4.out",
      });

      gsap.from(".hero-tagline", {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: "power4.out",
      });

      // Bento cards scroll animation
      gsap.utils.toArray<HTMLElement>(".bento-card").forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          y: 60,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: "power3.out",
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-background font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <span className="font-serif text-xl font-semibold tracking-tight">
            ibraheem
          </span>
          <div className="flex items-center gap-8">
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <a href="#projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Projects
            </a>
            <a
              href="#contact"
              className="text-sm bg-accent text-accent-foreground px-4 py-2 rounded-full hover:bg-accent/90 transition-colors"
            >
              Let&apos;s Talk
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="min-h-screen flex flex-col items-center justify-center px-6 pt-20"
      >
        <div className="text-center max-w-4xl">
          <h1 className="hero-name font-serif text-6xl md:text-8xl font-semibold tracking-tight mb-4">
            Ibraheem Shaikh
          </h1>
          <p className="hero-title text-xl md:text-2xl text-muted-foreground mb-6">
            Software Engineer & CS Student
          </p>
          <p className="hero-tagline text-lg text-muted-foreground max-w-xl mx-auto">
            Building bold ideas at the intersection of{" "}
            <span className="text-foreground font-medium">tech</span>,{" "}
            <span className="text-foreground font-medium">finance</span>, and{" "}
            <span className="text-foreground font-medium">design</span>.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section ref={bentoRef} className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          {/* Section Label */}
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-8">
            The Dashboard
          </p>

          {/* Bento Grid */}
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4 auto-rows-[140px]">

            {/* About Card - Large */}
            <div
              id="about"
              className="bento-card col-span-4 row-span-2 bg-card rounded-3xl p-8 border border-border hover:border-accent/50 transition-colors cursor-pointer group"
            >
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">
                About
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4 group-hover:text-accent transition-colors">
                Hey, I&apos;m Ibraheem!
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-lg">
                A risk-taker who loves building things that matter. When I&apos;m not coding,
                you&apos;ll find me obsessing over Porsche designs, watching sports, or
                exploring the next big startup idea.
              </p>
            </div>

            {/* Stats Card - Years */}
            <div className="bento-card col-span-2 row-span-1 bg-card rounded-3xl p-6 border border-border hover:border-accent/50 transition-colors">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
                Experience
              </p>
              <p className="font-serif text-4xl font-semibold">
                3<span className="text-accent">+</span>
              </p>
              <p className="text-sm text-muted-foreground">years coding</p>
            </div>

            {/* Stats Card - Projects */}
            <div className="bento-card col-span-2 row-span-1 bg-card rounded-3xl p-6 border border-border hover:border-accent/50 transition-colors">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
                Projects
              </p>
              <p className="font-serif text-4xl font-semibold">
                10<span className="text-accent">+</span>
              </p>
              <p className="text-sm text-muted-foreground">shipped</p>
            </div>

            {/* Featured Project Card - Large */}
            <div
              id="projects"
              className="bento-card col-span-4 md:col-span-3 row-span-2 bg-card rounded-3xl p-8 border border-border hover:border-accent/50 transition-colors cursor-pointer group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">
                  Featured Project
                </p>
                <h3 className="font-serif text-2xl font-semibold mb-2 group-hover:text-accent transition-colors">
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
            </div>

            {/* Interests Card */}
            <div className="bento-card col-span-2 md:col-span-3 row-span-2 bg-card rounded-3xl p-8 border border-border hover:border-accent/50 transition-colors">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">
                Interests
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-sm bg-accent/20 text-foreground px-4 py-2 rounded-full">
                  🏎️ Porsche
                </span>
                <span className="text-sm bg-accent/20 text-foreground px-4 py-2 rounded-full">
                  ⚽ Sports
                </span>
                <span className="text-sm bg-accent/20 text-foreground px-4 py-2 rounded-full">
                  🚀 Startups
                </span>
                <span className="text-sm bg-accent/20 text-foreground px-4 py-2 rounded-full">
                  💹 Finance
                </span>
                <span className="text-sm bg-accent/20 text-foreground px-4 py-2 rounded-full">
                  🌍 Adventure
                </span>
              </div>
            </div>

            {/* Tech Stack Card */}
            <div className="bento-card col-span-4 md:col-span-2 row-span-1 bg-card rounded-3xl p-6 border border-border hover:border-accent/50 transition-colors">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-3">
                Tech Stack
              </p>
              <div className="flex gap-4 text-2xl">
                <span title="TypeScript">TS</span>
                <span title="React">⚛️</span>
                <span title="Python">🐍</span>
                <span title="Node.js">💚</span>
              </div>
            </div>

            {/* Second Project Card */}
            <div className="bento-card col-span-4 md:col-span-2 row-span-2 bg-card rounded-3xl p-8 border border-border hover:border-accent/50 transition-colors cursor-pointer group">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">
                Project
              </p>
              <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                Another Project
              </h3>
              <p className="text-muted-foreground text-sm">
                Description of another impressive project you&apos;ve built.
              </p>
            </div>

            {/* Currently Card */}
            <div className="bento-card col-span-2 row-span-1 bg-accent rounded-3xl p-6 text-accent-foreground">
              <p className="text-sm uppercase tracking-widest mb-2 opacity-80">
                Currently
              </p>
              <p className="font-medium">
                Building something cool 🔨
              </p>
            </div>

            {/* Contact Card - Large */}
            <div
              id="contact"
              className="bento-card col-span-4 md:col-span-4 row-span-2 bg-foreground text-background rounded-3xl p-8 cursor-pointer group"
            >
              <p className="text-sm uppercase tracking-widest mb-4 opacity-60">
                Let&apos;s Connect
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
                Let&apos;s build something{" "}
                <span className="italic">amazing</span> together.
              </h2>
              <div className="flex flex-wrap gap-4 mt-6">
                <a
                  href="mailto:your@email.com"
                  className="text-sm bg-background text-foreground px-4 py-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Email
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm bg-background text-foreground px-4 py-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm bg-background text-foreground px-4 py-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>

            {/* Location Card */}
            <div className="bento-card col-span-2 row-span-1 bg-card rounded-3xl p-6 border border-border">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
                Based in
              </p>
              <p className="font-medium">📍 Your City</p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            © 2025 Ibraheem Shaikh
          </span>
          <span className="text-sm text-muted-foreground">
            Built with Next.js & Tailwind
          </span>
        </div>
      </footer>
    </main>
  );
}
