"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

const SIDEBAR_COLLAPSED_KEY = "admin_sidebar_collapsed";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (stored !== null) {
      setIsCollapsed(stored === "true");
    }
    setIsLoaded(true);
  }, []);

  const handleToggle = () => {
    const newValue = !isCollapsed;
    setIsCollapsed(newValue);
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(newValue));
  };

  // Prevent layout shift on initial load
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="w-64 fixed left-0 top-0 h-screen bg-[#122B45]" />
        <div className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200" />
        <main className="ml-64 mt-16 min-h-screen p-8">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar isCollapsed={isCollapsed} onToggle={handleToggle} />
      <AdminHeader isCollapsed={isCollapsed} />
      <main
        className={`min-h-screen pt-16 transition-all duration-300 ${
          isCollapsed ? "ml-18" : "ml-72"
        }`}
      >
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
