import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import ClientLayout from '@/components/layout/ClientLayout';

// Force dynamic rendering for all pages to avoid SSR serialization issues
export const dynamic = 'force-dynamic';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://voice-ai-repository.plivo.com'),
  title: {
    default: 'Voice AI Knowledge Repository',
    template: '%s | Voice AI Repository',
  },
  description:
    'Comprehensive guide to building intelligent voice AI applications. Learn about speech recognition, text-to-speech, LLM integration, and production deployment.',
  keywords: [
    'voice AI',
    'conversational AI',
    'speech recognition',
    'text-to-speech',
    'STT',
    'TTS',
    'LLM',
    'voice agents',
    'telephony',
    'WebRTC',
  ],
  authors: [{ name: 'Plivo' }],
  creator: 'Plivo',
  publisher: 'Plivo',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://voice-ai-repository.plivo.com',
    siteName: 'Voice AI Repository',
    title: 'Voice AI Knowledge Repository',
    description:
      'Comprehensive guide to building intelligent voice AI applications.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Voice AI Repository',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voice AI Knowledge Repository',
    description:
      'Comprehensive guide to building intelligent voice AI applications.',
    images: ['/og-image.png'],
    creator: '@plaboratories',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('theme');
                  if (mode === 'dark' || (!mode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
