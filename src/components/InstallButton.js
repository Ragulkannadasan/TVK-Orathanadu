"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  if (!isInstallable) return null;

  return (
    <button
      onClick={handleInstall}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFD700] text-[#800000] font-bold text-xs hover:bg-[#FFD700]/90 transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)] animate-bounce-subtle"
    >
      <Download size={14} />
      <span>Install App / செயலியை நிறுவுக</span>
    </button>
  );
}
