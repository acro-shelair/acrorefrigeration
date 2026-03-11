"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavigationProgress() {
  const pathname = usePathname();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isFirst = useRef(true);

  useEffect(() => {
    // Skip the very first render (initial page load — splash screen handles that)
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    timers.current.forEach(clearTimeout);
    timers.current = [];

    setWidth(0);
    setVisible(true);

    timers.current.push(setTimeout(() => setWidth(75), 30));
    timers.current.push(setTimeout(() => setWidth(100), 350));
    timers.current.push(setTimeout(() => setVisible(false), 650));
    timers.current.push(setTimeout(() => setWidth(0), 700));

    return () => timers.current.forEach(clearTimeout);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[600] h-[3px] pointer-events-none">
      <div
        className="h-full bg-primary"
        style={{
          width: `${width}%`,
          transition:
            width === 100
              ? "width 0.25s ease-out"
              : width === 75
              ? "width 0.9s cubic-bezier(0.4, 0, 0.2, 1)"
              : "none",
        }}
      />
    </div>
  );
}
