"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Shield, User, Trash2 } from "lucide-react";

interface UserActionsProps {
  userId: string;
  currentRole: string;
}

export function UserActions({ userId, currentRole }: UserActionsProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRoleChange = async (newRole: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/users/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        console.error("Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        disabled={isLoading}
      >
        <MoreHorizontal size={18} className="text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-gray-200 shadow-lg z-10 py-1">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
            Change Role
          </div>

          <button
            onClick={() => handleRoleChange("user")}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
              currentRole === "user" ? "text-[#122B45] font-medium" : "text-gray-700"
            }`}
            disabled={currentRole === "user"}
          >
            <User size={16} />
            <span>User</span>
            {currentRole === "user" && (
              <span className="ml-auto text-xs text-gray-400">Current</span>
            )}
          </button>

          <button
            onClick={() => handleRoleChange("admin")}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
              currentRole === "admin" ? "text-purple-600 font-medium" : "text-gray-700"
            }`}
            disabled={currentRole === "admin"}
          >
            <Shield size={16} />
            <span>Admin</span>
            {currentRole === "admin" && (
              <span className="ml-auto text-xs text-gray-400">Current</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
