'use client';

import { createContext, useContext, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardDepartmentContextType {
  department: 'TECH' | 'MARKETING';
  canSwitch: boolean;
  isSwitching: boolean;
  switchDepartment: (dept: 'TECH' | 'MARKETING') => Promise<void>;
}

const DashboardDepartmentContext = createContext<DashboardDepartmentContextType>({
  department: 'TECH',
  canSwitch: false,
  isSwitching: false,
  switchDepartment: async () => {},
});

export function DashboardDepartmentProvider({
  children,
  initialDepartment = 'TECH',
  canSwitch = false,
}: {
  children: React.ReactNode;
  initialDepartment?: 'TECH' | 'MARKETING';
  canSwitch?: boolean;
}) {
  const router = useRouter();
  const [department, setDepartment] = useState<'TECH' | 'MARKETING'>(initialDepartment);
  const [isPending, startTransition] = useTransition();
  const [isApiCalling, setIsApiCalling] = useState(false);

  const switchDepartment = async (newDept: 'TECH' | 'MARKETING') => {
    if (newDept === department || !canSwitch) return;

    setIsApiCalling(true);
    setDepartment(newDept);

    try {
      await fetch('/api/dashboard/auth/department', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department: newDept }),
      });

      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      console.error('Failed to switch department:', err);
    } finally {
      setIsApiCalling(false);
    }
  };

  return (
    <DashboardDepartmentContext.Provider
      value={{
        department,
        canSwitch,
        isSwitching: isPending || isApiCalling,
        switchDepartment,
      }}
    >
      {children}
    </DashboardDepartmentContext.Provider>
  );
}

export function useDashboardDepartment() {
  return useContext(DashboardDepartmentContext);
}
