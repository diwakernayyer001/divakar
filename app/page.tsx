"use client";

import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { Magnetic } from "@/components/ui/magnetic";
import Particles from "@/components/ui/particles";
import { BackgroundIcon } from "@/components/ui/background-icon";
import { FestivalBadge } from "@/components/festival-badge";
import { motion, useScroll, useSpring, useMotionTemplate, useMotionValue } from "motion/react";
import { MouseEvent } from "react";

// --- Components ---

function Spotlight({ children }: { children: React.ReactNode }) {
  // ... existing Spotlight component code ...
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className="group relative border border-[var(--border)] bg-[var(--background)] overflow-hidden rounded-xl"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              var(--muted),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

const letterContainer = {
  // ... existing variants ...
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.04 * i },
  }),
};

const letterAnimation = {
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    } as const,
  },
  hidden: {
    opacity: 0,
  },
};

const AnimatedTitle = ({ text }: { text: string }) => (
  <motion.h1
    className="title"
    variants={letterContainer}
    initial="hidden"
    animate="visible"
  >
    {text.split("").map((char, index) => (
      <motion.span
        key={index}
        variants={letterAnimation}
        style={{ display: "inline-block" }}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ))}
  </motion.h1>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 20 } as const
  },
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="container relative">
      <Particles className="absolute inset-0 -z-10 animate-fade-in" quantity={1200} ease={20} />
      <motion.div
        style={{ scaleX, transformOrigin: "0%" }}
        className="fixed top-0 left-0 right-0 h-1 bg-[var(--foreground)] z-50 origin-left"
      />

      <header className="header" style={{ position: 'relative', zIndex: 100, display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
          <Magnetic>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="logo"
              style={{ cursor: 'pointer', lineHeight: 1 }}
            >
              DN
            </motion.div>
          </Magnetic>
          <FestivalBadge />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <ThemeToggle />
        </motion.div>
      </header>

      <main className="main w-full">
        <motion.div
          className="hero-section relative"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          {/* 3D Profile Image Section */}
          <motion.div
            style={{ perspective: 1000 }}
            className="relative"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{
                scale: 1.1,
                rotateY: 15,
                rotateX: -10,
                boxShadow: "0px 20px 50px rgba(0,0,0,0.2)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="profile-container"
              style={{
                borderRadius: '50%',
                overflow: 'hidden',
                border: '4px solid var(--background)',
                boxShadow: '0 0 0 2px var(--border)',
                transformStyle: "preserve-3d"
              }}
            >
              <Image
                src="https://d316u7k0d46mo4.cloudfront.net/user-layh4cigqbmfyoxk794vhkncv7c2/avatar-1763810148662.webp"
                alt="Diwakar Nayyer"
                fill
                sizes="(max-width: 768px) 180px, 180px"
                className="profile-placeholder"
                style={{ objectFit: 'cover' }}
                priority
              />
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <div className="text-center z-10" style={{ perspective: 1000 }}>
            <AnimatedTitle text="Diwakar Nayyer" />
            <motion.p
              variants={itemVariants}
              className="subtitle"
            >
              16 Years Old • Student • Future Professional
            </motion.p>
          </div>

          <motion.p
            variants={itemVariants}
            className="bio text-center max-w-2xl px-4"
          >
            I craft digital experiences with a focus on simplicity and elegance.
            Passionate about technology, innovation, and clean design.
            Building the future, one line of code at a time.
          </motion.p>

          {null}

          {/* Contact Section Preview with Spotlight Effect */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md mt-24"
          >
            <Spotlight>
              <div className="p-8 text-center bg-[var(--background)/50] backdrop-blur-sm">
                <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                  Ready to collaborate?
                </p>
                <div style={{ display: 'inline-block' }}>
                  <Magnetic>
                    <a
                      href="mailto:diwakernayyer@gmail.com"
                      className="contact-link"
                      style={{ display: 'block', padding: '0.5rem' }}
                    >
                      diwakernayyer@gmail.com
                    </a>
                  </Magnetic>
                </div>
              </div>
            </Spotlight>
          </motion.div>

          {/* Scroll Triggered Cards Section */}

        </motion.div>
      </main>

      <footer className="flex flex-col items-center gap-3 text-center py-8 text-xs text-[var(--muted-foreground)] border-t border-[var(--border)] mt-auto w-full font-sans antialiased tracking-wide">
        <p className="opacity-80">&copy; {new Date().getFullYear()} Diwakar Nayyer. All rights reserved.</p>
        <p className="opacity-80">Built with ❤️ by <a href="https://hereco.xyz" target="_blank" rel="noopener noreferrer" className="!no-underline text-inherit hover:text-[var(--foreground)] active:text-[var(--primary)] transition-colors duration-200" style={{ textDecoration: 'none' }}>Shantanu Sen Gupta</a></p>
      </footer>
    </div>
  );
}
