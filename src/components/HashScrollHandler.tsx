"use client";

import { useEffect } from "react";

/**
 * Handles hash navigation reliably on page load.
 * Waits for layout to settle (images/videos reserving space, etc.)
 * before scrolling to the target element.
 */
export default function HashScrollHandler() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.slice(1);

    const scrollToTarget = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    // Try multiple times as layout settles
    // (videos load metadata, images load, animations trigger, etc.)
    const timers = [100, 400, 900].map((delay) =>
      window.setTimeout(scrollToTarget, delay)
    );

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  return null;
}
