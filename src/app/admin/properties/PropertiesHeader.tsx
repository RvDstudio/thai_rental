"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AddPropertyDrawer } from "./AddPropertyDrawer";

export function PropertiesHeader() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#122B45]">Properties</h1>
          <p className="text-gray-500 mt-1">
            Manage property listings
          </p>
        </div>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#122B45] text-white rounded-lg hover:bg-[#1a3d5c] transition-colors font-medium"
        >
          <Plus size={18} />
          Add Property
        </button>
      </div>

      <AddPropertyDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
