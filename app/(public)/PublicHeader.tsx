'use client'

import Image from 'next/image'
import Link from 'next/link'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import {
  ArrowRight,
  ChevronDown,
  Compass,
  Factory,
  Handshake,
  LockKeyhole,
  Map,
  Menu,
  Mountain,
  X,
  Zap,
} from 'lucide-react'

/* =========================================================
   NAVIGATION PRINCIPALE
========================================================= */

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

/* =========================================================
   SOUS-MENU ACTIVITÉS
   IMPORTANT :
   Les routes correspondent exactement à celles
   actuellement présentes dans ton projet.
========================================================= */

const ACTIVITIES = [
  {
    number: '01',
    label: 'Prospection & Exploration',
    shortLabel: 'Prospection & Exploration',
    description:
      'Identifier les zones à potentiel et approfondir progressivement la connaissance des ressources.',
    href: '/activities/prospecting',
    icon: Compass,
  },
  {
    number: '02',
    label: 'Opérations minières',
    shortLabel: 'Opérations minières',
    description:
      'Coordonner les activités opérationnelles, les flux et les informations nécessaires au suivi des opérations.',
    href: '/activities/operations',
    icon: Factory,
  },
  {
    number: '03',
    label: 'Vente & Approvisionnement minéral',
    shortLabel: 'Approvisionnement minéral',
    description:
      'Faciliter les connexions entre ressources, fournisseurs, acheteurs et opportunités commerciales.',
    href: '/activities/supply',
    icon: Zap,
  },
  {
    number: '04',
    label: 'Accompagnement des projets & investisseurs',
    shortLabel: 'Projets & investisseurs',
    description:
      'Accompagner les projets, investisseurs et partenaires dans leurs démarches et opportunités.',
    href: '/activities/support',
    icon: Handshake,
  },
]

/* =========================================================
   ACTIVE PATH
========================================================= */

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

/* =========================================================
   HEADER PUBLIC
========================================================= */

export default function PublicHeader() {
  const pathname = usePathname()

  const [mobileOpen, setMobileOpen] =
    useState(false)

  const [scrolled, setScrolled] =
    useState(false)

  const [activitiesOpen, setActivitiesOpen] =
    useState(false)

  const [mobileActivitiesOpen, setMobileActivitiesOpen] =
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
     CLOSE MENUS ON ROUTE CHANGE
  ========================================================= */

  useEffect(() => {
    setMobileOpen(false)
    setActivitiesOpen(false)
    setMobileActivitiesOpen(false)
  }, [pathname])

  /* =========================================================
     MOBILE BODY LOCK + ESC
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
        setActivitiesOpen(false)
        setMobileActivitiesOpen(false)
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

  const activitiesActive =
    isActivePath(
      pathname,
      '/activities'
    )

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

                  /* =================================================
                     ACTIVITÉS
                  ================================================= */

                  if (item.href === '/activities') {
                    return (
                      <li
                        key={item.href}
                        className="relative"
                        onMouseEnter={() =>
                          setActivitiesOpen(true)
                        }
                        onMouseLeave={() =>
                          setActivitiesOpen(false)
                        }
                      >

                        {/* TRIGGER */}

                        <Link
                          href="/activities"
                          aria-current={
                            active
                              ? 'page'
                              : undefined
                          }
                          onFocus={() =>
                            setActivitiesOpen(true)
                          }
                          className={`group relative inline-flex items-center gap-1.5 px-3.5 py-2.5 text-[13px] font-medium transition-colors duration-300 ${
                            active
                              ? textColor
                              : mutedColor
                          } ${hoverColor}`}
                        >

                          <span className="relative">

                            Activités

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

                          <ChevronDown
                            size={13}
                            strokeWidth={1.8}
                            className={`transition-transform duration-300 ${
                              activitiesOpen
                                ? 'rotate-180 text-[#B8873F]'
                                : ''
                            }`}
                          />

                        </Link>

                        {/* =================================================
                            DROPDOWN
                            Le pt-2 crée une zone de liaison invisible
                            entre le bouton et le panneau afin d'éviter
                            que le menu disparaisse lorsqu'on descend
                            avec la souris.
                        ================================================= */}

                        <div
                          className={`absolute left-1/2 top-full w-[700px] -translate-x-1/2 pt-2 transition-all duration-300 ${
                            activitiesOpen
                              ? 'visible translate-y-0 opacity-100'
                              : 'invisible -translate-y-2 opacity-0'
                          }`}
                        >

                          <div className="relative overflow-hidden rounded-[26px] border border-stone-200/80 bg-[#F8F7F3]/98 p-3 shadow-[0_28px_90px_rgba(15,23,42,0.16)] backdrop-blur-2xl">

                            {/* =================================================
                                GOLD TOP ACCENT
                            ================================================= */}

                            <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-[#D7B66C] to-transparent" />

                            {/* =================================================
                                INTRO DU MENU
                            ================================================= */}

                            <div className="flex items-center justify-between px-4 pb-3 pt-3">

                              <div>
                                <div className="flex items-center gap-2">

                                  <span className="h-1.5 w-1.5 rounded-full bg-[#B8873F]" />

                                  <p className="text-[9px] font-bold uppercase tracking-[0.26em] text-[#9B793E]">
                                    Nos activités
                                  </p>

                                </div>

                                <p className="mt-1.5 text-sm text-stone-500">
                                  Quatre domaines pour intervenir à différents
                                  niveaux de la chaîne de valeur minière.
                                </p>
                              </div>

                              <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-[#0A0C0B] text-[#E1C487] shadow-[0_8px_20px_rgba(15,23,42,0.10)] sm:flex">
                                <Map
                                  size={18}
                                  strokeWidth={1.7}
                                />
                              </div>

                            </div>

                            {/* =================================================
                                4 ACTIVITÉS
                            ================================================= */}

                            <div className="grid grid-cols-2 gap-2.5">

                              {ACTIVITIES.map(
                                (activity) => {

                                  const Icon =
                                    activity.icon

                                  const activityActive =
                                    isActivePath(
                                      pathname,
                                      activity.href
                                    )

                                  return (
                                    <Link
                                      key={
                                        activity.href
                                      }
                                      href={
                                        activity.href
                                      }
                                      className={`group relative overflow-hidden rounded-[20px] border p-5 transition-all duration-300 ${
                                        activityActive
                                          ? 'border-[#D7B66C]/45 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.07)]'
                                          : 'border-stone-200/80 bg-white/70 hover:-translate-y-0.5 hover:border-[#D7B66C]/45 hover:bg-white hover:shadow-[0_15px_32px_rgba(15,23,42,0.08)]'
                                      }`}
                                    >

                                      {/* LEFT RAIL */}

                                      <span
                                        aria-hidden="true"
                                        className={`absolute inset-y-4 left-0 w-[2px] rounded-full bg-gradient-to-b from-[#B8873F] via-[#D7B66C] to-[#9D7230] transition-opacity duration-300 ${
                                          activityActive
                                            ? 'opacity-100'
                                            : 'opacity-0 group-hover:opacity-100'
                                        }`}
                                      />

                                      {/* SOFT GOLD GLOW */}

                                      <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#D7B66C]/[0.08] blur-2xl transition-transform duration-500 group-hover:scale-150"
                                      />

                                      <div className="relative">

                                        <div className="flex items-start justify-between gap-4">

                                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0A0C0B] text-[#E1C487] shadow-[0_8px_18px_rgba(15,23,42,0.10)] transition-transform duration-300 group-hover:scale-105">
                                            <Icon
                                              size={18}
                                              strokeWidth={1.7}
                                            />
                                          </div>

                                          <span className="text-[8px] font-bold tracking-[0.2em] text-stone-300">
                                            {
                                              activity.number
                                            }
                                          </span>

                                        </div>

                                        <div className="mt-4">

                                          <h3 className="text-sm font-semibold leading-5 tracking-[-0.02em] text-[#0A0C0B]">
                                            {
                                              activity.label
                                            }
                                          </h3>

                                          <p className="mt-1.5 line-clamp-2 text-[11px] leading-5 text-stone-500">
                                            {
                                              activity.description
                                            }
                                          </p>

                                        </div>

                                        <div className="mt-4 flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.16em] text-[#B8873F] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                                          Découvrir

                                          <ArrowRight
                                            size={11}
                                            strokeWidth={1.8}
                                          />
                                        </div>

                                      </div>

                                    </Link>
                                  )
                                }
                              )}

                            </div>

                            {/* =================================================
                                FOOTER DROPDOWN
                            ================================================= */}

                            <div className="mt-3 flex items-center justify-between border-t border-stone-200/80 px-4 pb-1 pt-3">

                              <span className="text-[8px] font-semibold uppercase tracking-[0.25em] text-stone-400">
                                Barack Mining Investment
                              </span>

                              <Link
                                href="/activities"
                                className="group flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.16em] text-[#9B793E] transition-colors hover:text-[#B8873F]"
                              >
                                Voir toutes les activités

                                <ArrowRight
                                  size={11}
                                  strokeWidth={1.8}
                                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                                />
                              </Link>

                            </div>

                          </div>

                        </div>

                      </li>
                    )
                  }

                  /* =================================================
                     NAVIGATION STANDARD
                  ================================================= */

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

                  /* =================================================
                     MOBILE ACTIVITÉS
                  ================================================= */

                  if (item.href === '/activities') {
                    return (
                      <li key={item.href}>

                        <div
                          className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                            active
                              ? 'border-[#D7B66C]/30 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]'
                              : 'border-transparent'
                          }`}
                        >

                          {/* MAIN ROW */}

                          <div className="flex items-center">

                            <Link
                              href="/activities"
                              className="group relative flex flex-1 items-center px-4 py-3.5 text-sm font-semibold text-stone-700 transition-colors hover:text-[#0A0C0B]"
                            >

                              {active && (
                                <span
                                  aria-hidden="true"
                                  className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-gradient-to-b from-[#B8873F] via-[#D7B66C] to-[#9D7230]"
                                />
                              )}

                              <span className="flex items-center gap-3">

                                {active && (
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#D7B66C]" />
                                )}

                                Activités

                              </span>

                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                setMobileActivitiesOpen(
                                  (current) =>
                                    !current
                                )
                              }
                              className="flex h-12 w-12 items-center justify-center text-stone-400 transition-colors hover:text-[#B8873F]"
                              aria-label={
                                mobileActivitiesOpen
                                  ? 'Masquer les activités'
                                  : 'Afficher les activités'
                              }
                              aria-expanded={
                                mobileActivitiesOpen
                              }
                            >

                              <ChevronDown
                                size={17}
                                strokeWidth={1.7}
                                className={`transition-transform duration-300 ${
                                  mobileActivitiesOpen
                                    ? 'rotate-180 text-[#B8873F]'
                                    : ''
                                }`}
                              />

                            </button>

                          </div>

                          {/* MOBILE SUBMENU */}

                          <div
                            className={`grid transition-all duration-300 ${
                              mobileActivitiesOpen
                                ? 'grid-rows-[1fr] opacity-100'
                                : 'grid-rows-[0fr] opacity-0'
                            }`}
                          >

                            <div className="overflow-hidden">

                              <div className="border-t border-stone-200/80 px-3 pb-3 pt-2">

                                <div className="space-y-1">

                                  {ACTIVITIES.map(
                                    (activity) => {
                                      const Icon =
                                        activity.icon

                                      const activeActivity =
                                        isActivePath(
                                          pathname,
                                          activity.href
                                        )

                                      return (
                                        <Link
                                          key={
                                            activity.href
                                          }
                                          href={
                                            activity.href
                                          }
                                          className={`group flex items-center gap-3 rounded-xl border px-3 py-3 transition-all duration-300 ${
                                            activeActivity
                                              ? 'border-[#D7B66C]/30 bg-white'
                                              : 'border-transparent hover:border-stone-200 hover:bg-white'
                                          }`}
                                        >

                                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0A0C0B] text-[#E1C487]">
                                            <Icon
                                              size={15}
                                              strokeWidth={1.7}
                                            />
                                          </div>

                                          <div className="min-w-0 flex-1">

                                            <div className="flex items-center gap-2">

                                              <span className="text-sm font-semibold text-[#0A0C0B]">
                                                {
                                                  activity.shortLabel
                                                }
                                              </span>

                                              <span className="text-[8px] font-bold tracking-[0.16em] text-stone-300">
                                                {
                                                  activity.number
                                                }
                                              </span>

                                            </div>

                                            <p className="mt-0.5 text-[10px] leading-4 text-stone-400">
                                              {
                                                activity.description
                                              }
                                            </p>

                                          </div>

                                          <ArrowRight
                                            size={
                                              14
                                            }
                                            className={`shrink-0 transition-all duration-300 ${
                                              activeActivity
                                                ? 'text-[#B8873F]'
                                                : 'text-stone-300 group-hover:translate-x-0.5 group-hover:text-[#B8873F]'
                                            }`}
                                          />

                                        </Link>
                                      )
                                    }
                                  )}

                                </div>

                                <Link
                                  href="/activities"
                                  className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-[#FBFAF7] px-4 py-3 text-[9px] font-bold uppercase tracking-[0.16em] text-[#9B793E] transition-colors hover:border-[#D7B66C]/35 hover:bg-white hover:text-[#B8873F]"
                                >
                                  Voir toutes les activités

                                  <ArrowRight
                                    size={12}
                                    strokeWidth={1.8}
                                  />
                                </Link>

                              </div>

                            </div>

                          </div>

                        </div>

                      </li>
                    )
                  }

                  /* =================================================
                     MOBILE NAV STANDARD
                  ================================================= */

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

                        {/* ACTIVE RAIL */}

                        {active && (
                          <span
                            aria-hidden="true"
                            className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-gradient-to-b from-[#B8873F] via-[#D7B66C] to-[#9D7230]"
                          />
                        )}

                        <span className="flex items-center gap-3">

                          {active && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#D7B66C]" />
                          )}

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