'use client';

import type { UserRole } from '@prisma/client';
import { Search, Bell, ExternalLink, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface TopbarProps {
  role: UserRole;
  userName: string;
}

export default function DashboardTopbar({ role, userName }: TopbarProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const isTech = role === 'ZEYAD_TECH';

  return (
    <header className="h-[76px] sticky top-0 z-30 bg-[#0e0e0e]/80 backdrop-blur-2xl border-b border-white/[0.06] flex items-center justify-between px-6 md:px-8">
      {/* Search Bar */}
      <div
        className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 max-w-[380px] flex-1 ${
          searchFocused
            ? 'bg-[#1c1b1b] border border-[#B6FF33]/50 shadow-[0_0_25px_rgba(182,255,51,0.12)]'
            : 'bg-[#18181a]/80 border border-white/[0.08] hover:border-white/[0.15]'
        }`}
      >
        <Search
          size={16}
          className={`shrink-0 transition-colors ${
            searchFocused ? 'text-[#B6FF33]' : 'text-[#e5e2e1]/40'
          }`}
        />
        <input
          id="dashboard-search"
          type="text"
          placeholder="Search projects, clients, finances..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="bg-transparent border-none outline-none text-[#e5e2e1] text-xs font-body placeholder-[#e5e2e1]/30 w-full"
        />
        <kbd className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-[10px] text-[#e5e2e1]/40 font-headline">
          ⌘K
        </kbd>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Live System Status Pill */}
        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#B6FF33]/20 bg-[#B6FF33]/5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B6FF33] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B6FF33]"></span>
          </span>
          <span className="font-headline text-[10px] uppercase tracking-[0.14em] text-[#B6FF33] font-bold">
            Live System
          </span>
        </div>

        {/* Public Website Shortcut */}
        <Link
          href="/"
          target="_blank"
          className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-[#e5e2e1]/70 hover:text-[#B6FF33] hover:border-[#B6FF33]/30 hover:bg-[#B6FF33]/5 text-xs font-headline font-semibold transition-all duration-200"
        >
          <span>Agency Site</span>
          <ExternalLink size={12} />
        </Link>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="relative p-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-[#e5e2e1]/60 hover:text-[#B6FF33] hover:border-[#B6FF33]/30 hover:bg-[#B6FF33]/5 transition-all duration-200 cursor-pointer"
        >
          <Bell size={17} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#B6FF33] shadow-[0_0_8px_#B6FF33]" />
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08]">
          <div className="w-7 h-7 rounded-full bg-[#B6FF33] text-[#121f00] font-headline font-bold text-xs flex items-center justify-center shadow-[0_0_12px_rgba(182,255,51,0.3)]">
            {userName[0]}
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-bold font-headline text-[#e5e2e1] leading-none">
              {userName}
            </div>
            <div className="text-[9px] font-headline text-[#B6FF33] uppercase tracking-wider font-semibold mt-0.5">
              {isTech ? 'Tech Lead' : 'Marketing Lead'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
