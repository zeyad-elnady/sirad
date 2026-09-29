'use client';

import { useTheme } from '@/components/common/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full p-0.5 transition-all duration-500 cursor-pointer group ${
        isDark
          ? 'bg-white/10 hover:bg-white/15 border border-white/10'
          : 'bg-black/10 hover:bg-black/15 border border-black/10'
      } ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Track glow */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-500 ${
          isDark
            ? 'shadow-[inset_0_0_8px_rgba(182,255,51,0.15)]'
            : 'shadow-[inset_0_0_8px_rgba(182,255,51,0.1)]'
        }`}
      />

      {/* Sliding thumb */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`relative w-6 h-6 rounded-full flex items-center justify-center ${
          isDark
            ? 'bg-[#B6FF33] shadow-[0_0_12px_rgba(182,255,51,0.5)]'
            : 'bg-[#1a1a1a] shadow-[0_2px_8px_rgba(0,0,0,0.25)] ml-auto'
        }`}
        style={{
          marginLeft: isDark ? 0 : 'auto',
          marginRight: isDark ? 'auto' : 0,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.svg
              key="moon"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="w-3.5 h-3.5 text-[#121f00]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
              />
            </motion.svg>
          ) : (
            <motion.svg
              key="sun"
              initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="w-3.5 h-3.5 text-[#B6FF33]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
}
