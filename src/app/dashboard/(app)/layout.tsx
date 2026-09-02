import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import DashboardShell from '@/components/dashboard/layout/DashboardShell';
import '@/app/globals.css';
import { Inter, Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Dashboard — Sirad Creative Hub',
  description: 'Internal management command center for Sirad Creative Agency.',
};

export default async function AuthenticatedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/dashboard/login');
  }

  return (
    <html
      lang="en"
      dir="ltr"
      className={`${spaceGrotesk.variable} ${inter.variable} dark no-scrollbar selection:bg-[#B6FF33] selection:text-[#121f00]`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="font-body text-[#e5e2e1] bg-[#131313] min-h-screen antialiased overflow-x-hidden"
        suppressHydrationWarning
      >
        <DashboardShell role={session.role} userName={session.name}>
          {children}
        </DashboardShell>
      </body>
    </html>
  );
}
