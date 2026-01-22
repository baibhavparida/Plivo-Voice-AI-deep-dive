'use client';

import Link from 'next/link';
import { Github, Twitter, Linkedin, Youtube, Mic } from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const footerColumns: FooterColumn[] = [
  {
    title: 'Documentation',
    links: [
      { label: 'Foundations', href: '/topics/foundations' },
      { label: 'Infrastructure', href: '/topics/infrastructure' },
      { label: 'LLM Integration', href: '/topics/llm-integration' },
      { label: 'Use Cases', href: '/topics/use-cases' },
      { label: 'Getting Started', href: '/topics/implementation/getting-started' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Agent Architecture', href: '/topics/agent-architecture' },
      { label: 'Enterprise', href: '/topics/enterprise' },
      { label: 'Glossary', href: '/topics/resources/glossary' },
      { label: 'Benchmarks', href: '/topics/resources/benchmarks' },
      { label: 'Provider Directory', href: '/topics/resources/provider-directory' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'GitHub', href: 'https://github.com/plivo/voice-ai-repository', external: true },
      { label: 'Discord', href: 'https://discord.gg/plivo', external: true },
      { label: 'Stack Overflow', href: 'https://stackoverflow.com/questions/tagged/voice-ai', external: true },
      { label: 'Contributing', href: '/contributing' },
      { label: 'Code of Conduct', href: '/code-of-conduct' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Plivo', href: 'https://www.plivo.com', external: true },
      { label: 'Blog', href: 'https://www.plivo.com/blog', external: true },
      { label: 'Careers', href: 'https://www.plivo.com/careers', external: true },
      { label: 'Contact', href: 'https://www.plivo.com/contact', external: true },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
];

interface SocialLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const socialLinks: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/plivo', icon: Github },
  { label: 'Twitter', href: 'https://twitter.com/plaboratories', icon: Twitter },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/plivo', icon: Linkedin },
  { label: 'YouTube', href: 'https://www.youtube.com/c/plivo', icon: Youtube },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                  {column.title}
                </h3>
                <ul className="space-y-3" role="list">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 py-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            {/* Logo and attribution */}
            <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
              <Link
                href="/"
                className="flex items-center gap-2 text-neutral-900 dark:text-white hover:opacity-80 transition-opacity"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black dark:bg-white text-white dark:text-black">
                  <Mic className="h-4 w-4" aria-hidden="true" />
                </div>
                <span className="text-sm font-semibold">Voice AI Repository</span>
              </Link>

              {/* Plivo attribution */}
              <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                <span>Powered by</span>
                <a
                  href="https://www.plivo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-black dark:text-white font-semibold hover:underline"
                >
                  Plivo
                </a>
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              &copy; {currentYear} Voice AI Repository. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
