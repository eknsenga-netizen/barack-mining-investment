'use client'

import Image from 'next/image'
import Link from 'next/link'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import {
  ArrowRight,
  LockKeyhole,
  Menu,
  X,
} from 'lucide-react'

const NAVIGATION = [
  {
    label: 'Accueil',
    href: '/',
  },
  {
    label: 'À propos',
    href: '/about',
  },
  {
    label: 'Activités',
    href: '/activities',
  },
  {
    label: 'Ressources',
    href: '/minerals',
  },
  {
    label: 'Impact',
    href: '/impact',
  },
  {
    label: 'Partenariats',
    href: '/partnerships',
  },
  {
    label: 'Actualités',
    href: '/news',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
]

function isActivePath(
  pathname: string,
  href: string
) {
  if (href === '/') {
    return pathname === '/'
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  )
}

export default function PublicHeader() {
  const pathname = usePathname()

  const [mobileOpen, setMobileOpen] =
    useState(false)

  const [scrolled, setScrolled] =
    useState(false)

  /* =========================================================
     SCROLL STATE
  ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 48)
    }

    handleScroll()

    window.addEventListener(
      'scroll',
      handleScroll,
      { passive: true }
    )

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll
      )
    }
  }, [])

  /* =========================================================
     CLOSE MOBILE MENU ON ROUTE CHANGE
  ========================================================= */

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  /* =========================================================
     MOBILE BODY LOCK + ESCAPE
  ========================================================= */

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = ''
      return
    }

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow = 'hidden'

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === 'Escape') {
        setMobileOpen(false)
      }
    }

    window.addEventListener(
      'keydown',
      handleKeyDown
    )

    return () => {
      document.body.style.overflow =
        previousOverflow

      window.removeEventListener(
        'keydown',
        handleKeyDown
      )
    }
  }, [mobileOpen])

  /* =========================================================
     LOGIN = PRIVATE AREA
     
     Le header public ne doit jamais apparaître sur
     l'espace de connexion réservé aux agents.
  ========================================================= */

  if (pathname === '/login') {
    return null
  }

  const textColor = scrolled
    ? 'text-[#0A0C0B]'
    : 'text-white'

  const mutedColor = scrolled
    ? 'text-stone-500'
    : 'text-white/70'

  const hoverColor = scrolled
    ? 'hover:text-[#0A0C0B]'
    : 'hover:text-white'

  return (
    <>
      {/* ======================================================
          HEADER
      ====================================================== */}

      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-all duration-300 ${
          scrolled
            ? 'bg-[#F7F6F2]/94 shadow-[0_10px_35px_rgba(15,23,42,0.06)] backdrop-blur-xl'
            : 'bg-transparent'
        }`}
        data-scrolled={scrolled}
      >

        <div className="mx-auto flex h-[78px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-10">

          {/* ==================================================
              LOGO
          ================================================== */}

          <Link
            href="/"
            className="group relative z-10 flex min-w-0 items-center gap-3.5"
            aria-label="Barack Mining Investment - Accueil"
          >

            <span
              className={`relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[13px] border shadow-[0_8px_24px_rgba(0,0,0,0.16)] transition-all duration-300 ${
                scrolled
                  ? 'border-[#C69B52]/20 bg-[#0A0C0B]'
                  : 'border-[#E1C487]/20 bg-[#0A0C0B]'
              }`}
            >

              <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_56%)]" />

              <Image
                src="/images/logo-bmi.png"
                alt="Barack Mining Investment"
                width={44}
                height={44}
                priority
                className="relative z-10 h-8 w-auto object-contain brightness-0 invert transition-transform duration-300 group-hover:scale-[1.04]"
              />

            </span>

            <span
              className={`hidden leading-none transition-colors duration-300 sm:block ${textColor}`}
            >

              <span className="block text-[13px] font-bold tracking-[0.12em]">
                BARACK MINING
              </span>

              <span
                className={`mt-1 block text-[9px] font-semibold uppercase tracking-[0.3em] transition-colors duration-300 ${
                  scrolled
                    ? 'text-[#9B793E]'
                    : 'text-white/45'
                }`}
              >
                Investment
              </span>

            </span>

          </Link>

          {/* ==================================================
              DESKTOP NAVIGATION
          ================================================== */}

          <nav
            className="hidden lg:block"
            aria-label="Navigation principale"
          >

            <ul className="flex items-center gap-1 xl:gap-1.5">

              {NAVIGATION.map(
                (item) => {
                  const active =
                    isActivePath(
                      pathname,
                      item.href
                    )

                  return (
                    <li
                      key={item.href}
                      className="relative"
                    >

                      <Link
                        href={item.href}
                        aria-current={
                          active
                            ? 'page'
                            : undefined
                        }
                        className={`group relative inline-flex items-center px-3.5 py-2.5 text-[13px] font-medium transition-colors duration-300 ${
                          active
                            ? textColor
                            : mutedColor
                        } ${hoverColor}`}
                      >

                        <span className="relative">

                          {item.label}

                          {/* ACTIVE */}
                          <span
                            aria-hidden="true"
                            className={`absolute -bottom-[7px] left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] transition-all duration-300 ${
                              active
                                ? 'w-[22px] opacity-100 shadow-[0_0_10px_rgba(207,169,95,0.45)]'
                                : 'w-0 opacity-0'
                            }`}
                          />

                          {/* HOVER */}
                          <span
                            aria-hidden="true"
                            className={`absolute -bottom-[7px] left-1/2 h-px -translate-x-1/2 rounded-full bg-[#C69B52] transition-all duration-300 ${
                              active
                                ? 'w-0 opacity-0'
                                : 'w-0 opacity-0 group-hover:w-[18px] group-hover:opacity-100'
                            }`}
                          />

                        </span>

                      </Link>

                    </li>
                  )
                }
              )}

            </ul>

          </nav>

          {/* ==================================================
              DESKTOP ACTIONS
          ================================================== */}

          <div className="hidden items-center gap-3 lg:flex">

            {/* ESPACE AGENTS */}
            <Link
              href="/login"
              className={`group inline-flex h-10 items-center justify-center gap-2 rounded-full border px-4 text-[11px] font-semibold transition-all duration-300 ${
                scrolled
                  ? 'border-[#C69B52]/25 bg-white/80 text-[#6F542C] hover:border-[#B8873F]/45 hover:bg-white hover:text-[#8C692E]'
                  : 'border-white/15 bg-white/[0.04] text-white/70 backdrop-blur-md hover:border-[#E1C487]/35 hover:bg-white/[0.08] hover:text-[#E1C487]'
              }`}
              aria-label="Accéder à l'espace agents"
            >

              <LockKeyhole
                size={14}
                strokeWidth={1.7}
                className={`transition-colors duration-300 ${
                  scrolled
                    ? 'text-[#B8873F]'
                    : 'text-[#E1C487]'
                }`}
              />

              <span>
                Espace agents
              </span>

            </Link>

            {/* CTA PUBLIC */}
            <Link
              href="/opportunity"
              className="group relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full border border-[#D7B66C]/70 bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] px-5 text-sm font-semibold text-[#15120C] shadow-[0_10px_30px_rgba(184,137,63,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_14px_35px_rgba(184,137,63,0.25)]"
            >

              {/* REFLET */}
              <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[420%]" />

              <span className="relative z-10">
                Nous rejoindre
              </span>

              <ArrowRight
                size={15}
                className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
              />

            </Link>

          </div>

          {/* ==================================================
              MOBILE BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={() =>
              setMobileOpen(
                (current) => !current
              )
            }
            className={`relative z-[110] inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300 lg:hidden ${
              mobileOpen
                ? 'border-[#D7B66C]/25 bg-[#0A0C0B] text-white shadow-[0_10px_28px_rgba(0,0,0,0.18)]'
                : scrolled
                  ? 'border-[#C69B52]/20 bg-white/75 text-[#0A0C0B] backdrop-blur-sm hover:border-[#C69B52]/35'
                  : 'border-white/15 bg-white/[0.06] text-white backdrop-blur-sm hover:bg-white/[0.12]'
            }`}
            aria-label={
              mobileOpen
                ? 'Fermer le menu'
                : 'Ouvrir le menu'
            }
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >

            {mobileOpen ? (
              <X
                size={21}
                strokeWidth={1.8}
              />
            ) : (
              <Menu
                size={21}
                strokeWidth={1.8}
              />
            )}

          </button>

        </div>

        {/* ======================================================
            GOLD LINE
        ====================================================== */}

        <div
          aria-hidden="true"
          className={`absolute inset-x-0 bottom-0 h-px transition-opacity duration-300 ${
            scrolled
              ? 'bg-gradient-to-r from-transparent via-[#D7B66C]/60 to-transparent opacity-100'
              : 'bg-gradient-to-r from-transparent via-[#E1C487]/35 to-transparent opacity-80'
          }`}
        />

      </header>

      {/* ======================================================
          MOBILE OVERLAY
      ====================================================== */}

      <div
        className={`fixed inset-0 z-[90] bg-[#050606]/55 backdrop-blur-[4px] transition-all duration-300 lg:hidden ${
          mobileOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        onClick={() =>
          setMobileOpen(false)
        }
        aria-hidden="true"
      />

      {/* ======================================================
          MOBILE NAVIGATION
      ====================================================== */}

      <aside
        id="mobile-navigation"
        className={`fixed inset-x-0 top-[78px] z-[95] origin-top border-b border-stone-200/80 bg-[#F7F6F2] shadow-[0_24px_70px_rgba(15,23,42,0.14)] transition-all duration-300 lg:hidden ${
          mobileOpen
            ? 'translate-y-0 scale-y-100 opacity-100'
            : 'pointer-events-none -translate-y-3 scale-y-[0.98] opacity-0'
        }`}
        aria-hidden={!mobileOpen}
      >

        <div className="mx-auto max-h-[calc(100vh-78px)] max-w-7xl overflow-y-auto px-5 py-6 sm:px-8">

          {/* MOBILE NAV */}

          <nav aria-label="Navigation mobile">

            <ul className="space-y-1.5">

              {NAVIGATION.map(
                (item) => {
                  const active =
                    isActivePath(
                      pathname,
                      item.href
                    )

                  return (
                    <li
                      key={item.href}
                    >

                      <Link
                        href={item.href}
                        aria-current={
                          active
                            ? 'page'
                            : undefined
                        }
                        className={`group relative flex items-center justify-between overflow-hidden rounded-2xl border px-4 py-3.5 text-sm font-semibold transition-all duration-300 ${
                          active
                            ? 'border-[#D7B66C]/30 bg-white text-[#0A0C0B] shadow-[0_8px_24px_rgba(15,23,42,0.05)]'
                            : 'border-transparent text-stone-700 hover:border-stone-200 hover:bg-white'
                        }`}
                      >

                        {/* GOLD RAIL */}
                        <span
                          aria-hidden="true"
                          className={`absolute inset-y-2 left-0 w-[3px] rounded-full bg-gradient-to-b from-[#B8873F] via-[#D7B66C] to-[#9D7230] transition-all duration-300 ${
                            active
                              ? 'opacity-100'
                              : 'opacity-0'
                          }`}
                        />

                        <span className="flex items-center gap-3">

                          <span
                            aria-hidden="true"
                            className={`h-1.5 w-1.5 rounded-full bg-[#D7B66C] transition-all duration-300 ${
                              active
                                ? 'scale-100 opacity-100'
                                : 'scale-0 opacity-0'
                            }`}
                          />

                          <span>
                            {item.label}
                          </span>

                        </span>

                        <ArrowRight
                          size={15}
                          className={`transition-all duration-300 ${
                            active
                              ? 'text-[#B8873F]'
                              : 'text-stone-300 group-hover:translate-x-0.5 group-hover:text-[#B8873F]'
                          }`}
                        />

                      </Link>

                    </li>
                  )
                }
              )}

            </ul>

          </nav>

          {/* ====================================================
              MOBILE ACTIONS
          ==================================================== */}

          <div className="mt-6 space-y-3 border-t border-stone-200/80 pt-5">

            {/* ESPACE AGENTS */}
            <Link
              href="/login"
              className="group flex h-12 items-center justify-center gap-2 rounded-xl border border-[#C69B52]/30 bg-white px-5 text-sm font-semibold text-[#6F542C] shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-all duration-300 hover:border-[#B8873F]/50 hover:text-[#8C692E]"
            >

              <LockKeyhole
                size={16}
                className="text-[#B8873F]"
              />

              <span>
                Espace agents
              </span>

            </Link>

            {/* CTA */}
            <Link
              href="/opportunity"
              className="group flex h-12 items-center justify-center gap-2 rounded-xl border border-[#D7B66C]/60 bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] px-5 text-sm font-semibold text-[#15120C] shadow-[0_10px_26px_rgba(184,137,63,0.18)] transition-all duration-300 hover:brightness-105"
            >

              <span>
                Nous rejoindre
              </span>

              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />

            </Link>

          </div>

          {/* ====================================================
              MOBILE BRAND SIGNATURE
          ==================================================== */}

          <div className="mt-5 flex items-center justify-center gap-2">

            <span className="h-px w-8 bg-stone-200" />

            <span className="text-[8px] font-bold uppercase tracking-[0.28em] text-stone-300">
              Barack Mining Investment
            </span>

            <span className="h-px w-8 bg-stone-200" />

          </div>

        </div>

      </aside>
    </>
  )
}
