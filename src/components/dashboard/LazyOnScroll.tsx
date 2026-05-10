"use client";
import { useEffect, useRef, useState } from "react";

type LazyOnScrollProps = {
  children: React.ReactNode;
  rootMargin?: string;
};

export function LazyOnScroll({ children, rootMargin = "200px" }: LazyOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { rootMargin });
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, inView]);

  return <div ref={ref}>{inView && children}</div>;
}
