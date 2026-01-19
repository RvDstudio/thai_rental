"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
} from "lucide-react";
import { signOut } from "@/lib/auth-client";

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/properties", label: "Properties", icon: Building },
  { href: "/admin/rentals", label: "Rentals", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[#122B45] text-white transition-all duration-300 z-50 flex flex-col ${
        isCollapsed ? "w-18" : "w-72"
      }`}
    >
      {/* Logo / Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
        {!isCollapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#9FC3E9] rounded-lg flex items-center justify-center">
              <Building size={18} className="text-[#122B45]" />
            </div>
            <span className="font-bold text-lg">Admin</span>
          </Link>
        )}
        {isCollapsed && (
          <div className="w-full flex justify-center">
            <div className="w-10 h-10 bg-[#9FC3E9] rounded-lg flex items-center justify-center">
              <Building size={20} className="text-[#122B45]" />
            </div>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-[#122B45] border border-white/20 rounded-full flex items-center justify-center hover:bg-[#1a3d5c] transition-colors"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight size={14} />
        ) : (
          <ChevronLeft size={14} />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group ${
                isCollapsed ? "justify-center" : ""
              } ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon size={20} className="shrink-0" />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
              {isCollapsed && isActive && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-[#122B45] text-white text-sm rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link
          href="/"
          className={`flex items-center gap-3 px-3 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={isCollapsed ? "Back to Site" : undefined}
        >
          <Home size={20} className="shrink-0" />
          {!isCollapsed && <span className="font-medium">Back to Site</span>}
        </Link>
        <button
          onClick={handleSignOut}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-white/70 hover:bg-red-500/20 hover:text-red-400 transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <LogOut size={20} className="shrink-0" />
          {!isCollapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
