'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { UserRole } from '@prisma/client';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  UserCheck,
  Handshake,
  DollarSign,
  Server,
  Clapperboard,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  role: UserRole;
  userName: string;
  isHovered?: boolean;
  onHoverChange?: (hovered: boolean) => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: <LayoutDashboard size={19} /> },
  { label: 'Projects', href: '/dashboard/projects', icon: <FolderKanban size={19} /> },
  { label: 'Clients', href: '/dashboard/clients', icon: <Users size={19} /> },
  { label: 'Employees', href: '/dashboard/employees', icon: <UserCheck size={19} /> },
  { label: 'Sales Reps', href: '/dashboard/sales-reps', icon: <Handshake size={19} /> },
  { label: 'Finance', href: '/dashboard/finance', icon: <DollarSign size={19} /> },
  {
    label: 'Recurring Expenses',
    href: '/dashboard/recurring-expenses',
    icon: <Server size={19} />,
    roles: ['ZEYAD_TECH'],
  },
  {
    label: 'Production',
    href: '/dashboard/production',
    icon: <Clapperboard size={19} />,
    roles: ['YEHIA_MARKETING'],
  },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={19} /> },
];

export default function DashboardSidebar({
  role,
  userName,
  isHovered: controlledHovered,
  onHoverChange,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [internalHovered, setInternalHovered] = useState(false);
  const isHovered = controlledHovered !== undefined ? controlledHovered : internalHovered;

  const handleMouseEnter = () => {
    setInternalHovered(true);
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    setInternalHovered(false);
    onHoverChange?.(false);
  };

  const filteredItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(role)
  );

  async function handleLogout() {
    await fetch('/api/dashboard/auth/logout', { method: 'POST' });
    router.push('/dashboard/login');
    router.refresh();
  }

  const isTech = role === 'ZEYAD_TECH';
  const departmentLabel = isTech ? 'Tech Command' : 'Marketing Hub';

  return (
    <motion.aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{ width: isHovered ? 270 : 76 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`dash-sidebar fixed top-0 left-0 h-screen z-50 bg-[#0e0e0e]/95 backdrop-blur-2xl border-r border-white/[0.06] flex flex-col overflow-hidden transition-shadow duration-300 ${
        isHovered
          ? 'shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_25px_rgba(182,255,51,0.08)]'
          : ''
      }`}
    >
      {/* Brand Header */}
      <div
        className={`flex items-center border-b border-white/[0.06] h-[76px] shrink-0 transition-all ${
          isHovered ? 'px-5 justify-between' : 'justify-center px-3'
        }`}
      >
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          {isHovered ? (
            /* Full Official Sirad Logo when hovered */
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-32 h-8 shrink-0 flex items-center"
            >
              <Image
                src="/logo-trimmed.png"
                alt="Sirad"
                width={128}
                height={27}
                priority
                className="object-contain object-left pointer-events-none"
              />
            </motion.div>
          ) : (
            /* Compact glowing brand icon when collapsed */
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="w-10 h-10 rounded-xl bg-[#1c1b1b] border border-[#B6FF33]/30 flex items-center justify-center font-headline font-bold text-lg text-[#B6FF33] shadow-[0_0_15px_rgba(182,255,51,0.25)]"
            >
              S
            </motion.div>
          )}
        </Link>
      </div>

      {/* Sub-badge: Department & Status (shown when hovered) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="px-5 pt-3.5 pb-2 overflow-hidden shrink-0"
          >
            <div className="flex items-center justify-between px-3 py-1.5 rounded-full border border-[#B6FF33]/20 bg-[#B6FF33]/5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B6FF33] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B6FF33]"></span>
                </span>
                <span className="font-headline text-[10px] uppercase tracking-[0.14em] text-[#B6FF33] font-bold">
                  {departmentLabel}
                </span>
              </div>
              <Link
                href="/"
                target="_blank"
                title="Visit main website"
                className="text-[#e5e2e1]/40 hover:text-[#B6FF33] transition-colors"
              >
                <ExternalLink size={12} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto no-scrollbar flex flex-col gap-1">
        {filteredItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={!isHovered ? item.label : undefined}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group ${
                isActive
                  ? 'bg-[#B6FF33]/10 text-[#B6FF33] border border-[#B6FF33]/30 shadow-[0_0_20px_rgba(182,255,51,0.12)] font-semibold'
                  : 'text-[#e5e2e1]/60 hover:text-[#e5e2e1] hover:bg-white/[0.04] border border-transparent'
              } ${!isHovered ? 'justify-center px-0' : ''}`}
            >
              {/* Active neon glowing indicator */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[#B6FF33] shadow-[0_0_10px_#B6FF33]" />
              )}

              <span
                className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-[#B6FF33]' : 'text-inherit'
                }`}
              >
                {item.icon}
              </span>

              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.15 }}
                    className="truncate font-headline text-[13px] tracking-wide"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* User Footer Card */}
      <div className="p-3 border-t border-white/[0.06] bg-[#0A0A0B]/80">
        <div
          className={`flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] ${
            !isHovered ? 'justify-center p-2' : ''
          }`}
        >
          {/* Avatar with glowing neon status */}
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#1c1b1b] border border-[#B6FF33]/30 flex items-center justify-center text-sm font-bold font-headline text-[#B6FF33] shadow-[0_0_12px_rgba(182,255,51,0.2)]">
              {userName[0]}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#B6FF33] border-2 border-[#0A0A0B]" />
          </div>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="flex-1 min-w-0"
              >
                <div className="text-xs font-semibold text-[#e5e2e1] truncate font-headline">
                  {userName}
                </div>
                <div className="text-[10px] text-[#B6FF33] font-headline uppercase tracking-wider font-semibold">
                  {isTech ? 'Tech Lead' : 'Marketing Lead'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isHovered && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleLogout}
              title="Sign out"
              className="p-1.5 rounded-lg text-[#e5e2e1]/40 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
