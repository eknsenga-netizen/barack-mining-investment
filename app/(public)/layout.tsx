import type { Metadata } from 'next'
import '../globals.css'
import PublicHeader from './PublicHeader'

export const metadata: Metadata = {
  title: {
    default: 'Barack Mining Investment',
    template: '%s | Barack Mining Investment',
  },
  description:
    'Building opportunities. Creating lasting value.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      'http://localhost:3000'
  ),
}

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8F7F4] text-[#0A0C0B]">
      <PublicHeader />

      <main className="min-h-0 flex-1">
        {children}
      </main>

      <footer className="border-t border-stone-200 bg-[#F8F7F4]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

            {/* BRAND */}
            <div className="lg:col-span-1">
              <a
                href="/"
                className="inline-flex items-center gap-3"
              >
                <img
                  src="/images/logo-bmi.png"
                  alt="Barack Mining Investment"
                  width={44}
                  height={44}
                  className="h-11 w-auto object-contain"
                />

                <span className="leading-tight">
                  <span className="block text-sm font-semibold tracking-[0.08em] text-[#0A0C0B]">
                    BARACK MINING
                  </span>

                  <span className="block text-[10px] font-medium uppercase tracking-[0.24em] text-stone-500">
                    Investment
                  </span>
                </span>
              </a>

              <p className="mt-5 max-w-xs text-sm leading-6 text-stone-500">
                Building opportunities. Creating lasting value.
              </p>
            </div>

            {/* NAVIGATION */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-400">
                Navigation
              </p>

              <nav className="mt-5">
                <ul className="space-y-3 text-sm">
                  <li>
                    <a
                      href="/about"
                      className="text-stone-600 transition hover:text-[#B87333]"
                    >
                      À propos
                    </a>
                  </li>

                  <li>
                    <a
                      href="/activities"
                      className="text-stone-600 transition hover:text-[#B87333]"
                    >
                      Activités
                    </a>
                  </li>

                  <li>
                    <a
                      href="/minerals"
                      className="text-stone-600 transition hover:text-[#B87333]"
                    >
                      Ressources
                    </a>
                  </li>

                  <li>
                    <a
                      href="/impact"
                      className="text-stone-600 transition hover:text-[#B87333]"
                    >
                      Impact
                    </a>
                  </li>

                  <li>
                    <a
                      href="/partnerships"
                      className="text-stone-600 transition hover:text-[#B87333]"
                    >
                      Partenariats
                    </a>
                  </li>

                  <li>
                    <a
                      href="/news"
                      className="text-stone-600 transition hover:text-[#B87333]"
                    >
                      Actualités
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            {/* CONTACT */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-400">
                Contact
              </p>

              <div className="mt-5 space-y-3 text-sm text-stone-600">
                {process.env.NEXT_PUBLIC_CONTACT_EMAIL && (
                  <a
                    href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                    className="block transition hover:text-[#B87333]"
                  >
                    {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
                  </a>
                )}

                {process.env.NEXT_PUBLIC_CONTACT_PHONE && (
                  <a
                    href={`tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE.replace(
                      /\s+/g,
                      ''
                    )}`}
                    className="block transition hover:text-[#B87333]"
                  >
                    {process.env.NEXT_PUBLIC_CONTACT_PHONE}
                  </a>
                )}

                {process.env.NEXT_PUBLIC_CONTACT_ADDRESS && (
                  <p className="max-w-xs leading-6">
                    {process.env.NEXT_PUBLIC_CONTACT_ADDRESS}
                  </p>
                )}

                {!process.env.NEXT_PUBLIC_CONTACT_EMAIL &&
                  !process.env.NEXT_PUBLIC_CONTACT_PHONE &&
                  !process.env.NEXT_PUBLIC_CONTACT_ADDRESS && (
                    <a
                      href="/contact"
                      className="inline-flex font-medium text-[#0A0C0B] transition hover:text-[#B87333]"
                    >
                      Nous contacter →
                    </a>
                  )}
              </div>
            </div>

            {/* CTA */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-400">
                Opportunity Center
              </p>

              <p className="mt-5 max-w-xs text-sm leading-6 text-stone-500">
                Discuss an opportunity, partnership or mining-related project with our team.
              </p>

              <a
                href="/opportunity"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#B87333] px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(184,115,51,0.18)] transition hover:-translate-y-0.5 hover:bg-[#A7662D]"
              >
                Partner With Us
              </a>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-stone-200 pt-6 text-xs text-stone-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Barack Mining Investment. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-5">
              <a
                href="/privacy"
                className="transition hover:text-stone-700"
              >
                Privacy Policy
              </a>

              <a
                href="/terms"
                className="transition hover:text-stone-700"
              >
                Terms of Use
              </a>

              <a
                href="/contact"
                className="transition hover:text-stone-700"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}