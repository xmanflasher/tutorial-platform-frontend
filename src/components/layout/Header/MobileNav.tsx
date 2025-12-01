'use client';

import { Menu } from 'lucide-react';

// 1. 必須定義這個介面，告訴 TypeScript 這個元件接受 onMenuClick
interface MobileNavProps {
  onMenuClick?: () => void;
}

// 2. 在參數中解構並指定型別
export default function MobileNav({ onMenuClick }: MobileNavProps) {
  return (
    <button
      onClick={onMenuClick}
      className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
      aria-label="開啟選單"
    >
      <Menu size={24} />
    </button>
  );
}