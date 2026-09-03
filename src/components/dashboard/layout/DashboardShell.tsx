'use client';

import { useState } from 'react';
import type { UserRole } from '@prisma/client';
import DashboardSidebar from './DashboardSidebar';
import DashboardTopbar from './DashboardTopbar';
import { useDashboardLang } from '@/context/DashboardLanguageContext';

interface ShellProps {
  children: React.ReactNode;
  role: UserRole;
  userName: string;
}

export default function DashboardShell({ children, role, userName }: ShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isRtl } = useDashboardLang();

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] relative overflow-x-hidden">
      {/* Ambient background glows matching Sirad website */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Top-right Electric Lime glow */}
        <div className="absolute -top-[10%] right-[5%] w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle,rgba(182,255,51,0.06)_0%,transparent_70%)] blur-[90px]" />
        {/* Left emerald accent glow */}
        <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.04)_0%,transparent_70%)] blur-[90px]" />
        {/* Subtle digital grid pattern */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Hover-expand Sidebar with controlled state */}
      <DashboardSidebar
        role={role}
        userName={userName}
        isHovered={isSidebarOpen}
        onHoverChange={setIsSidebarOpen}
      />

      {/* Main content wrapper that shifts/minimizes when menu is open */}
      <div
        className="min-h-screen flex flex-col relative z-10"
        style={{
          marginLeft: !isRtl ? (isSidebarOpen ? '270px' : '76px') : 0,
          marginRight: isRtl ? (isSidebarOpen ? '270px' : '76px') : 0,
          transition: isRtl
            ? 'margin-right 0.25s cubic-bezier(0.22, 1, 0.36, 1)'
            : 'margin-left 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <DashboardTopbar role={role} userName={userName} />
        <main className="flex-1 p-6 md:p-8 max-w-[1560px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
