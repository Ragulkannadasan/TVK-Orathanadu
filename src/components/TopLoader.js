"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleAnchorClick = (e) => {
      const target = e.currentTarget;
      const href = target.getAttribute("href");
      
      // Only trigger for internal links that are different from current path
      if (href && href.startsWith("/") && href !== pathname) {
        setLoading(true);
      }
    };

    const handleMutation = () => {
      const anchors = document.querySelectorAll("a[href^='/']");
      anchors.forEach((a) => {
        a.removeEventListener("click", handleAnchorClick);
        a.addEventListener("click", handleAnchorClick);
      });
    };

    // Initial attach
    handleMutation();

    // Re-attach when DOM changes (for dynamic content)
    const observer = new MutationObserver(handleMutation);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    // Hide loader when path changes (navigation finished)
    setLoading(false);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[2px] overflow-hidden bg-transparent">
      <div className="h-full bg-gradient-to-r from-[#FFD700] via-black to-[#FFD700] animate-progress shadow-[0_0_10px_#FFD700]" />
      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress {
          animation: progress 0.8s linear infinite;
          width: 200%;
        }
      `}</style>
    </div>
  );
}
