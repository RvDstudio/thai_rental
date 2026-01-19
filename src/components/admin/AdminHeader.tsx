"use client";

import { Bell, Search } from "lucide-react";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";

interface AdminHeaderProps {
  isCollapsed: boolean;
}

export function AdminHeader({ isCollapsed }: AdminHeaderProps) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-6 transition-all duration-300 ${
        isCollapsed ? "left-18" : "left-72"
      }`}
    >
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#122B45]/20 focus:border-[#122B45]"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#122B45] flex items-center justify-center text-white font-medium overflow-hidden">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || "Admin"}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              user?.name?.charAt(0).toUpperCase() || "A"
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
