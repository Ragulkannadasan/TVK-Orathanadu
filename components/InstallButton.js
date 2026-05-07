'use client';
import { useState, useEffect } from 'react';
import { Download, Share, PlusSquare } from 'lucide-react';

export default function InstallButton({ className = '' }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIosPrompt, setShowIosPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Check for iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIosDevice) {
      setIsIOS(true);
      setIsInstallable(true); // Treat iOS as installable to show the custom tooltip
    }

    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIosPrompt(true);
      return;
    }

    if (!deferredPrompt) {
      alert("App installation is not supported or the app is already installed.");
      return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  if (!isInstallable || isInstalled) return null;

  return (
    <div className="relative">
      <button
        onClick={handleInstallClick}
        className={`flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FFD700] to-[#e6c200] text-[#800000] font-bold rounded-full shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:scale-105 transition-all duration-300 ${className}`}
      >
        <Download size={18} />
        <span>Install App</span>
      </button>

      {/* iOS Installation Instructions Popover */}
      {showIosPrompt && (
        <div className="absolute top-full mt-4 right-0 md:left-1/2 md:-translate-x-1/2 w-64 p-4 glass border border-white/20 rounded-xl z-50 text-left shadow-2xl animate-fade-in">
          <p className="text-white text-sm font-medium mb-3">To install TVK App on your iPhone/iPad:</p>
          <ol className="text-white/70 text-xs space-y-3">
            <li className="flex items-center gap-2">
              1. Tap the <Share size={14} className="text-[#FFD700]" /> <strong>Share</strong> button below.
            </li>
            <li className="flex items-center gap-2">
              2. Scroll down and tap <PlusSquare size={14} className="text-[#FFD700]" /> <strong>Add to Home Screen</strong>.
            </li>
          </ol>
          <button 
            onClick={() => setShowIosPrompt(false)}
            className="mt-4 w-full py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
          >
            Got it
          </button>
        </div>
      )}
    </div>
  );
}
