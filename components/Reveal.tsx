'use client'

import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react";


type RevealDirection = "up" | "left" | "right";

type RevealProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  className?: string;
  threshold?: number | number[];
  rootMargin?: string;
  once?: boolean;
  delay?: number;
  direction?: RevealDirection;
};

export default function Reveal({
  children,
  className = "",
  threshold = 0.2,
  rootMargin = "0px 0px -10% 0px",
  once = true,
  delay = 0,
  direction = "up", // 'up' | 'left' | 'right'
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // If user prefers reduced motion, skip observer (visible is set initially)
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  const inlineStyle = delay ? { transitionDelay: `${delay}ms` } : undefined;

  const dirClass = direction === "left" ? "reveal-left" : direction === "right" ? "reveal-right" : "";

  return (
    <div
      ref={ref}
      className={`reveal ${dirClass} ${visible ? "reveal-visible" : ""} ${className}`}
      style={inlineStyle}
      {...rest}
    >
      {children}
    </div>
  );
}
