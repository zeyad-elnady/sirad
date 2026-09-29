import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';
import { Inter, Space_Grotesk } from 'next/font/google';
import { ThemeProvider } from '@/components/common/ThemeProvider';

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Sirad Creative Hub',
  description: 'Where limitless creativity meets cutting-edge technology. Sirad transforms bold ideas into dynamic digital realities.',
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} dark no-scrollbar`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        {/* Prevent FOUC: apply stored theme before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('sirad-theme');
                  var d = document.documentElement;
                  if (t === 'light') {
                    d.classList.remove('dark');
                    d.classList.add('light');
                  } else {
                    d.classList.add('dark');
                    d.classList.remove('light');
                  }
                  // Strip browser extension attributes
                  var origSet = Element.prototype.setAttribute;
                  Element.prototype.setAttribute = function(name, val) {
                    if (name && (name === 'bis_skin_checked' || name.indexOf('bis_') === 0)) return;
                    return origSet.apply(this, arguments);
                  };
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="font-body min-h-screen flex flex-col" style={{ color: 'var(--sirad-text)', backgroundColor: 'var(--sirad-bg)' }}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
