'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type SidebarContextType = {
  isMobileOpen: boolean;
  toggleMobile: () => void;
  isDesktopOpen: boolean;
  toggleDesktop: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(true); // Default open on desktop

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);
  const toggleDesktop = () => setIsDesktopOpen(!isDesktopOpen);

  return (
    <SidebarContext.Provider value={{ isMobileOpen, toggleMobile, isDesktopOpen, toggleDesktop }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (undefined === context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}