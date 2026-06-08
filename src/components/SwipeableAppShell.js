"use client";

import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import MobileHeader from "@/components/MobileHeader";

// Import Swiper styles
import "swiper/css";
import { navItems as defaultNavItems } from "@/lib/nav";

export default function SwipeableAppShell({ user, slides, notificationsComponent }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const swiperRef = useRef(null);

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

  // Sync Swiper to URL changes (e.g., initial load or browser back button)
  useEffect(() => {
    const tabId = searchParams.get("tab");
    if (tabId === 'notifications') {
      setShowNotifications(true);
    } else {
      setShowNotifications(false);
      if (tabId) {
        const idx = slides.findIndex(s => s.id === tabId);
        if (idx !== -1 && idx !== activeIndex && swiperRef.current) {
          swiperRef.current.swiper.slideTo(idx);
        }
      }
    }
  }, [searchParams, slides, activeIndex]);

  // Handle slide change
  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.activeIndex);
    const activeSlide = slides[swiper.activeIndex];
    const currentTabId = searchParams.get("tab") || "dashboard";
    
    if (activeSlide && activeSlide.id !== currentTabId && !showNotifications) {
      // Pure SPA behavior: update URL visually without triggering Next.js network fetches
      window.history.pushState(null, "", `/dashboard?tab=${activeSlide.id}`);
    }
  };

  // Handle navigation click (from Sidebar or MobileNav)
  const handleNavClick = (id) => {
    if (showNotifications) {
      window.history.pushState(null, "", `/dashboard?tab=${id}`);
      setShowNotifications(false);
    }
    
    const idx = slides.findIndex(s => s.id === id);
    if (idx !== -1 && swiperRef.current) {
      swiperRef.current.swiper.slideTo(idx);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Pass active tab info to Sidebar instead of using Next.js routes */}
      <Sidebar
        user={user}
        navItems={formattedNavItems}
        activeTabId={showNotifications ? 'notifications' : slides[activeIndex]?.id}
        onNavClick={handleNavClick}
        isShell={true}
      />

      <div className="flex-1 flex flex-col min-h-screen w-full relative">
        <MobileHeader user={user} />

        {/* Main Swiper Container or Notifications View */}
        <main className="flex-1 w-full bg-transparent relative pb-24 md:pb-0 overflow-y-auto overflow-x-hidden">
          {showNotifications ? (
            <div className="w-full h-full animate-in fade-in zoom-in-95 duration-300">
              {notificationsComponent}
            </div>
          ) : (
            <Swiper
              ref={swiperRef}
              initialSlide={initialIndex}
              onSlideChange={handleSlideChange}
              className="w-full h-full absolute inset-0"
              resistanceRatio={0.7}
              speed={400}
              touchStartPreventDefault={false}
            >
              {slides.map((slide, index) => (
                <SwiperSlide key={slide.id} className="w-full h-full overflow-y-auto">
                  <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 min-h-full">
                    {slide.component}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
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
