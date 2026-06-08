"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSwipeable } from 'react-swipeable';
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import MobileHeader from "@/components/MobileHeader";
import { navItems as defaultNavItems } from "@/lib/nav";

export default function SwipeableAppShell({ user, slides, notificationsComponent }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const role = user?.role || "Voter";
  const userNavItems = defaultNavItems[role] || defaultNavItems.Voter;

  const formattedNavItems = userNavItems.map(item => {
    let id = item.href.replace("/dashboard/", "").replace(/\//g, "-");
    if (id === "dashboard" || id === "voter" || id === "leader" || id === "admin") id = "dashboard";
    if (item.href === "/chat") id = "chat";
    return { ...item, id };
  });

  // Find initial tab from URL or default to 0
  const initialTabId = searchParams.get("tab");
  const isNotifications = initialTabId === 'notifications';

  const initialIndex = (initialTabId && !isNotifications)
    ? Math.max(0, slides.findIndex(s => s.id === initialTabId))
    : 0;

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [showNotifications, setShowNotifications] = useState(isNotifications);

  // Sync state to URL changes
  useEffect(() => {
    const tabId = searchParams.get("tab");
    if (tabId === 'notifications') {
      setShowNotifications(true);
    } else {
      setShowNotifications(false);
      if (tabId) {
        const idx = slides.findIndex(s => s.id === tabId);
        if (idx !== -1 && idx !== activeIndex) {
          setActiveIndex(idx);
        }
      }
    }
  }, [searchParams, slides, activeIndex]);

  // Handle navigation click (from Sidebar or MobileNav)
  const handleNavClick = (id) => {
    if (showNotifications) {
      window.history.pushState(null, "", `/dashboard?tab=${id}`);
      setShowNotifications(false);
    } else {
      const currentTabId = searchParams.get("tab") || "dashboard";
      if (id !== currentTabId) {
        window.history.pushState(null, "", `/dashboard?tab=${id}`);
      }
    }
    
    const idx = slides.findIndex(s => s.id === id);
    if (idx !== -1) {
      setActiveIndex(idx);
    }
  };

  // Implement lightweight swipe gestures
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (!showNotifications && activeIndex < slides.length - 1) {
        handleNavClick(slides[activeIndex + 1].id);
      }
    },
    onSwipedRight: () => {
      if (!showNotifications && activeIndex > 0) {
        handleNavClick(slides[activeIndex - 1].id);
      }
    },
    preventDefaultTouchmoveEvent: false, // Ensure vertical scrolling still works
    trackMouse: true, // Allow mouse swiping for easy testing
    delta: 50 // Require a 50px swipe distance to trigger
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background overflow-hidden">
      <Sidebar
        user={user}
        navItems={formattedNavItems}
        activeTabId={showNotifications ? 'notifications' : slides[activeIndex]?.id}
        onNavClick={handleNavClick}
        isShell={true}
      />

      <div className="flex-1 flex flex-col min-h-screen w-full relative">
        <MobileHeader user={user} />

        <main {...swipeHandlers} className="flex-1 w-full bg-transparent relative pb-24 md:pb-0 overflow-hidden">
          {showNotifications ? (
            <div className="w-full h-full overflow-y-auto animate-in fade-in zoom-in-95 duration-300 relative z-10 bg-background">
              {notificationsComponent}
            </div>
          ) : (
            <div 
              className="flex w-full h-full transition-transform duration-300 ease-out will-change-transform"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {slides.map((slide) => (
                <div key={slide.id} className="min-w-full h-full overflow-y-auto overflow-x-hidden">
                  <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 min-h-full">
                    {slide.component}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <MobileNav
          navItems={formattedNavItems}
          activeTabId={showNotifications ? 'notifications' : slides[activeIndex]?.id}
          onNavClick={handleNavClick}
          isShell={true}
        />
      </div>
    </div>
  );
}
