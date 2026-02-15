"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 400;

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(typeof window !== "undefined" && window.scrollY > SCROLL_THRESHOLD);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={cn(
        "fixed z-50 flex items-center justify-center rounded-full shadow-lg transition-all duration-300",
        "bg-[var(--color-primary,#17236a)] text-white",
        "hover:bg-[var(--color-primary,#17236a)]/90 hover:scale-105 active:scale-95",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary,#17236a)] focus-visible:ring-offset-2",
        "animate-scroll-to-top-bounce",
        "size-10 right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))]",
        "sm:size-11 sm:right-6 sm:bottom-6",
        "md:size-12 md:right-8 md:bottom-8"
      )}
    >
      <ChevronUp className="size-5 sm:size-5 md:size-6 shrink-0" aria-hidden />
    </button>
  );
}
