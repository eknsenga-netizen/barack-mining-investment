'use client'

import {
  useRef,
  type ReactNode,
} from 'react'

import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  Diamond,
  FileCheck2,
  Handshake,
  MapPinned,
  Package,
  Route,
  Scale,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
  Factory,
  Globe2,
} from 'lucide-react'

/* =========================================================
   PALETTE
========================================================= */

const GOLD_LIGHT = '#E1C487'
const GOLD = '#D7B66C'
const GOLD_DEEP = '#B8873F'
const GOLD_TEXT = '#9B793E'

/* =========================================================
   REVEAL
========================================================= */

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)

  const inView = useInView(ref, {
    once: true,
    margin: '-80px',
  })

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: 28,
      }}
      animate={
        inView
          ? {
              opacity: 1,
              y: 0,
            }
          : undefined
      }
      transition={{
        duration: 0.75,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* =========================================================
   SECTION LABEL
========================================================= */

function SectionLabel({
  children,
  light = false,
}: {
  children: ReactNode
  light?: boolean
}) {
  return (
    <div className="inline-flex items-center gap-3">
      <span
        className={
          light
            ? 'h-px w-8 bg-gradient-to-r from-[#B8873F] to-[#E1C487]'
            : 'h-px w-8 bg-gradient-to-r from-[#B8873F] to-[#E1C487]'
        }
      />

      <span
        className={
          light
            ? 'text-[10px] font-bold uppercase tracking-[0.3em] text-[#E1C487]'
            : 'text-[10px] font-bold uppercase tracking-[0.3em] text-[#9B793E]'
        }
      >
        {children}
      </span>
    </div>
  )
}

/* =========================================================
   INTERNAL NAVIGATION
========================================================= */

function InternalNav() {
  const items = [
    {
      href: '#circuits',
      label: 'Deux circuits',
    },
    {
      href: '#resources',
      label: 'Ressources',
    },
    {
      href: '#trading',
      label: 'Trading',
    },
    {
      href: '#value-chain',
      label: 'Chaîne de valeur',
    },
    {
      href: '#role',
      label: 'Notre rôle',
    },
    {
      href: '#logistics',
      label: 'Flux',
    },
    {
      href: '#opportunity',
      label: 'Opportunité',
    },
  ]

  return (
    <div className="sticky top-[78px] z-30 border-b border-stone-200/70 bg-[#F5F3EE]/92 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl overflow-x-auto px-6 sm:px-8 lg:px-10">
        <div className="flex min-w-max items-center gap-1 py-2.5">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-stone-500 transition-all duration-300 hover:bg-white hover:text-[#9B793E]"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({
  number,
  name,
  category,
  description,
  icon: Icon,
  dark = false,
}: {
  number: string
  name: string
  category: string
  description: string
  icon: React.ComponentType<{
    size?: number
    strokeWidth?: number
    className?: string
  }>
  dark?: boolean
}) {
  return (
    <div
      className={
        dark
          ? 'group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.045] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[#D7B66C]/35 hover:bg-white/[0.07] sm:p-7'
          : 'group relative overflow-hidden rounded-[24px] border border-stone-200 bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.04)] transition-all duration-500 hover:-translate-y-1 hover:border-[#D7B66C]/35 hover:shadow-[0_24px_60px_rgba(184,137,63,0.10)] sm:p-7'
      }
    >
      <div
        className={
          dark
            ? 'absolute right-[-30px] top-[-30px] h-24 w-24 rounded-full bg-[#D7B66C]/[0.07] blur-2xl transition-transform duration-700 group-hover:scale-150'
            : 'absolute right-[-30px] top-[-30px] h-24 w-24 rounded-full bg-[#D7B66C]/[0.07] blur-2xl transition-transform duration-700 group-hover:scale-150'
        }
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div
            className={
              dark
                ? 'flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E1C487]/[0.08] text-[#E1C487]'
                : 'flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0A0C0B] text-[#E1C487]'
            }
          >
            <Icon size={20} strokeWidth={1.7} />
          </div>

          <span
            className={
              dark
                ? 'text-[9px] font-bold tracking-[0.2em] text-white/20'
                : 'text-[9px] font-bold tracking-[0.2em] text-stone-300'
            }
          >
            {number}
          </span>
        </div>

        <p
          className={
            dark
              ? 'mt-6 text-[9px] font-bold uppercase tracking-[0.2em] text-[#E1C487]/70'
              : 'mt-6 text-[9px] font-bold uppercase tracking-[0.2em] text-[#9B793E]'
          }
        >
          {category}
        </p>

        <h3
          className={
            dark
              ? 'mt-2 text-xl font-semibold tracking-[-0.03em] text-white'
              : 'mt-2 text-xl font-semibold tracking-[-0.03em] text-[#0A0C0B]'
          }
        >
          {name}
        </h3>

        <p
          className={
            dark
              ? 'mt-3 text-sm leading-6 text-white/45'
              : 'mt-3 text-sm leading-6 text-stone-500'
          }
        >
          {description}
        </p>

        <div
          className={
            dark
              ? 'mt-7 h-px w-12 bg-gradient-to-r from-[#B8873F] to-transparent transition-all duration-500 group-hover:w-20'
              : 'mt-7 h-px w-12 bg-gradient-to-r from-[#B8873F] to-transparent transition-all duration-500 group-hover:w-20'
          }
        />
      </div>
    </div>
  )
}

/* =========================================================
   PROCESS STEP
========================================================= */

function ProcessStep({
  number,
  title,
  text,
  icon: Icon,
}: {
  number: string
  title: string
  text: string
  icon: React.ComponentType<{
    size?: number
    strokeWidth?: number
    className?: string
  }>
}) {
  return (
    <div className="relative rounded-[22px] border border-stone-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.04)]">
      <div className="flex h-[66px] w-[66px] items-center justify-center rounded-full border border-[#C69B52]/25 bg-[#FBFAF7]">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0A0C0B] text-[#E1C487]">
          <Icon size={18} strokeWidth={1.7} />
        </div>
      </div>

      <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#9B793E]">
        {number}
      </p>

      <h3 className="mt-2 text-base font-semibold tracking-[-0.02em] text-[#0A0C0B]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-stone-500">
        {text}
      </p>
    </div>
  )
}

/* =========================================================
   COMPONENT PRINCIPAL
========================================================= */

export default function ActivityDetailClient() {
  return (
    <div className="bg-[#F5F3EE] text-[#0A0C0B]">

      {/* =====================================================
          NAVIGATION INTERNE
      ===================================================== */}

      <InternalNav />

      {/* =====================================================
          01 — DEUX CIRCUITS
      ===================================================== */}

      <section
        id="circuits"
        className="relative overflow-hidden bg-[#F5F3EE] py-20 sm:py-24 lg:py-28"
      >
        <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-[#D7B66C]/[0.06] blur-3xl" />

        <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-[#C69B52]/[0.045] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionLabel>
                Architecture commerciale
              </SectionLabel>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl lg:text-5xl">
                Une activité.
                <br />
                <span className="bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] bg-clip-text text-transparent">
                  Deux circuits commerciaux.
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-stone-500">
                Barack Mining Investment adapte son intervention à la nature
                du produit, à son niveau de transformation et au marché auquel
                il est destiné.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">

            {/* LOCAL */}

            <Reveal>
              <div className="group relative overflow-hidden rounded-[30px] border border-stone-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.055)]">
                <div className="relative min-h-[440px] overflow-hidden">
                  <Image
                    src="/images/supply-local.jpg"
                    alt="Approvisionnement en minerais bruts pour le marché local"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/95 via-[#080A09]/35 to-[#080A09]/05" />

                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D7B66C]/60 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-8">
                    <div className="flex items-center justify-between gap-5">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.26em] text-[#E1C487]/75">
                          Circuit 01
                        </p>

                        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                          Approvisionnement en minerais bruts
                        </h3>

                        <div className="mt-3 inline-flex rounded-full border border-[#E1C487]/20 bg-[#E1C487]/[0.06] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#E1C487] backdrop-blur-md">
                          Marché local
                        </div>
                      </div>

                      <div className="hidden shrink-0 sm:flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/25 text-[#E1C487] backdrop-blur-md">
                        <Factory size={20} strokeWidth={1.7} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-7 sm:p-8">
                  <p className="text-sm leading-7 text-stone-600">
                    Nous facilitons l’approvisionnement en ressources
                    minières brutes destinées principalement aux entités de
                    traitement, aux transformateurs et aux acteurs de la
                    chaîne de valeur minière présents localement.
                  </p>

                  <div className="mt-7 border-t border-stone-200 pt-6">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#9B793E]">
                      Destinations
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {[
                        'Entités de traitement',
                        'Transformateurs',
                        'Opérateurs miniers',
                        'Partenaires industriels',
                      ].map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-stone-200 bg-[#FBFAF7] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-stone-500"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* INTERNATIONAL */}

            <Reveal delay={0.08}>
              <div className="group relative overflow-hidden rounded-[30px] border border-stone-200 bg-[#080A09] shadow-[0_18px_55px_rgba(15,23,42,0.10)]">
                <div className="relative min-h-[440px] overflow-hidden">
                  <Image
                    src="/images/supply-trading.png"
                    alt="Négoce et trading de produits miniers sur les marchés internationaux"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#050606]/95 via-[#050606]/45 to-[#050606]/05" />

                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D7B66C]/70 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-8">
                    <div className="flex items-center justify-between gap-5">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.26em] text-[#E1C487]/75">
                          Circuit 02
                        </p>

                        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                          Négoce & Trading
                        </h3>

                        <div className="mt-3 inline-flex rounded-full border border-[#E1C487]/20 bg-[#E1C487]/[0.06] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#E1C487] backdrop-blur-md">
                          Marché international
                        </div>
                      </div>

                      <div className="hidden shrink-0 sm:flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#E1C487] backdrop-blur-md">
                        <Globe2 size={20} strokeWidth={1.7} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-7 sm:p-8">
                  <p className="text-sm leading-7 text-white/55">
                    Nous accompagnons la commercialisation de produits miniers
                    semi-finis ou finis destinés aux marchés internationaux,
                    en fonction des opportunités, des spécifications et des
                    conditions propres à chaque opération.
                  </p>

                  <div className="mt-7 border-t border-white/10 pt-6">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#E1C487]/70">
                      Destinations
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {[
                        'Traders internationaux',
                        'Acheteurs',
                        'Revendeurs spécialisés',
                        'Partenaires commerciaux',
                      ].map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/45"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* MESSAGE CENTRAL */}

          <Reveal delay={0.12}>
            <div className="mx-auto mt-10 max-w-4xl rounded-[24px] border border-[#C69B52]/15 bg-white p-5 text-center shadow-[0_15px_45px_rgba(15,23,42,0.04)] sm:p-6">
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0A0C0B] text-[#E1C487]">
                  <CheckCircle2 size={16} strokeWidth={1.7} />
                </span>

                <p className="text-sm leading-6 text-stone-500">
                  Un même métier d’approvisionnement, adapté au niveau de
                  transformation du produit et à son marché de destination.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =====================================================
          02 — CHAÎNE DE VALEUR
      ===================================================== */}

      <section
        id="value-chain"
        className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28"
      >
        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[#D7B66C]/[0.045] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionLabel>
                Chaîne de valeur
              </SectionLabel>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl lg:text-5xl">
                Du minerai brut
                <br />
                <span className="bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] bg-clip-text text-transparent">
                  au produit commercialisé
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-stone-500">
                La nature de l’offre et la destination du produit déterminent
                le circuit commercial dans lequel l’opportunité est orientée.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative mt-16">
              <div className="absolute left-[9%] right-[9%] top-[34px] hidden h-px bg-gradient-to-r from-[#B8873F]/10 via-[#D7B66C]/55 to-[#B8873F]/10 lg:block" />

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  {
                    number: '01',
                    title: 'Ressource',
                    text: 'Identification de l’opportunité et des informations disponibles.',
                    icon: Package,
                  },
                  {
                    number: '02',
                    title: 'Minerai brut',
                    text: 'Approvisionnement de la matière première vers les acteurs locaux appropriés.',
                    icon: Factory,
                  },
                  {
                    number: '03',
                    title: 'Traitement',
                    text: 'Transformation ou valorisation selon le projet et les capacités mobilisées.',
                    icon: Sparkles,
                  },
                  {
                    number: '04',
                    title: 'Produit',
                    text: 'Produit semi-fini ou fini répondant aux caractéristiques de l’opération.',
                    icon: Diamond,
                  },
                  {
                    number: '05',
                    title: 'Marché',
                    text: 'Mise en relation avec les acheteurs ou partenaires correspondant au besoin.',
                    icon: Globe2,
                  },
                ].map((item) => (
                  <ProcessStep
                    key={item.number}
                    number={item.number}
                    title={item.title}
                    text={item.text}
                    icon={item.icon}
                  />
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-14 overflow-hidden rounded-[30px] border border-stone-200 bg-[#080A09]">
              <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
                <div className="relative min-h-[360px]">
                  <Image
                    src="/images/supply-value-chain.png"
                    alt="Chaîne de valeur et transformation des ressources minières"
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-r from-[#080A09]/10 via-[#080A09]/15 to-[#080A09]/90" />

                  <div className="absolute inset-x-0 bottom-0 p-7 sm:p-8">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#E1C487]/70">
                      Lecture du circuit
                    </p>

                    <p className="mt-2 max-w-xl text-xl font-semibold tracking-[-0.03em] text-white">
                      
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-7 sm:p-8 lg:p-10">
                  <div>
                    <div className="rounded-[22px] border border-white/10 bg-white/[0.035] p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E1C487]/[0.08] text-[#E1C487]">
                          <ArrowDown size={18} strokeWidth={1.7} />
                        </div>

                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#E1C487]/70">
                            Local
                          </p>

                          <p className="mt-1 text-sm leading-6 text-white/65">
                            Minerai brut → entité de traitement / acteur
                            local de la chaîne de valeur.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="my-3 flex justify-center text-[#D7B66C]/50">
                      <ArrowDown size={17} strokeWidth={1.4} />
                    </div>

                    <div className="rounded-[22px] border border-[#D7B66C]/15 bg-[#D7B66C]/[0.045] p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D7B66C]/[0.08] text-[#E1C487]">
                          <Globe2 size={18} strokeWidth={1.7} />
                        </div>

                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#E1C487]/70">
                            International
                          </p>

                          <p className="mt-1 text-sm leading-6 text-white/65">
                            Produit semi-fini ou fini → acheteur, trader ou
                            partenaire commercial international.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =====================================================
          03 — RESSOURCES BRUTES
      ===================================================== */}

      <section
        id="resources"
        className="relative overflow-hidden bg-[#F5F3EE] py-20 sm:py-24 lg:py-28"
      >
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#D7B66C]/[0.05] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">

            {/* IMAGE */}

            <Reveal>
              <div className="relative">
                <div className="absolute -inset-4 rounded-[34px] border border-[#C69B52]/12" />
                <div className="absolute -inset-1 rounded-[30px] border border-[#D7B66C]/15" />

                <div className="relative min-h-[470px] overflow-hidden rounded-[28px] bg-[#0A0C0B] shadow-[0_30px_80px_rgba(15,23,42,0.12)] sm:min-h-[560px]">
                  <Image
                    src="/images/supply-raw-material.jpg"
                    alt="Minerais bruts destinés à l'approvisionnement local"
                    fill
                    sizes="(max-width: 1024px) 100vw, 46vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.035]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/90 via-[#080A09]/20 to-transparent" />

                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D7B66C]/65 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#E1C487]/70">
                      Circuit local
                    </p>

                    <p className="mt-2 max-w-md text-lg font-semibold tracking-[-0.02em] text-white sm:text-xl">
                      Des matières premières destinées à la chaîne locale de
                      traitement et de valorisation.
                    </p>

                    <div className="mt-4 h-px w-16 bg-gradient-to-r from-[#B8873F] to-transparent" />
                  </div>
                </div>
              </div>
            </Reveal>

            {/* CONTENT */}

            <Reveal delay={0.08}>
              <div>
                <SectionLabel>
                  Approvisionnement local
                </SectionLabel>

                <h2 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.05em] sm:text-4xl lg:text-5xl">
                  Des minerais bruts
                  <br />
                  <span className="bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] bg-clip-text text-transparent">
                    pour la chaîne locale
                  </span>
                </h2>

                <p className="mt-6 text-base leading-8 text-stone-600">
                  Ce circuit concerne principalement les ressources minières
                  brutes destinées aux entités de traitement, aux
                  transformateurs et aux acteurs locaux de la chaîne de valeur.
                </p>

                <div className="mt-9 grid gap-4 sm:grid-cols-2">
                  <ProductCard
                    number="01"
                    name="Cuivre"
                    category="Minerai critique"
                    description="Matière première minérale destinée aux circuits locaux de traitement et de valorisation."
                    icon={Scale}
                  />

                  <ProductCard
                    number="02"
                    name="Cobalt"
                    category="Minerai critique"
                    description="Ressource suivie dans le cadre d’opportunités d’approvisionnement adaptées au contexte de chaque opération."
                    icon={CircleDotIcon}
                  />

                  <ProductCard
                    number="03"
                    name="Lithium"
                    category="Ressource stratégique"
                    description="Approvisionnement selon les disponibilités, caractéristiques et conditions propres au projet."
                    icon={Sparkles}
                  />

                  <ProductCard
                    number="04"
                    name="Cassitérite"
                    category="Minerai"
                    description="Matière première suivie dans le cadre d’opportunités destinées à la chaîne de valeur minière."
                    icon={Package}
                  />
                </div>

                <div className="mt-8 flex items-start gap-3 border-t border-stone-200 pt-6">
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-[#B8873F]"
                    strokeWidth={1.7}
                  />

                  <p className="text-sm leading-6 text-stone-500">
                    La disponibilité, la forme du produit, les volumes, les
                    spécifications et les conditions d’approvisionnement
                    dépendent de chaque opportunité.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =====================================================
          04 — TRADING INTERNATIONAL
      ===================================================== */}

      <section
        id="trading"
        className="relative overflow-hidden bg-[#080A09] py-20 text-white sm:py-24 lg:py-28"
      >
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#B8873F]/[0.08] blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-[#E1C487]/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionLabel light>
                Négoce international
              </SectionLabel>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl lg:text-5xl">
                Des produits miniers
                <br />
                <span className="bg-gradient-to-r from-[#F0D79F] via-[#D7B66C] to-[#B8873F] bg-clip-text text-transparent">
                  destinés aux marchés internationaux
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/45">
                Un circuit commercial distinct, orienté vers des produits
                semi-finis ou finis et des partenaires internationaux.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">

            <Reveal>
              <ProductCard
                number="01"
                name="Or"
                category="Ressource précieuse"
                description="Produit destiné au négoce international selon les conditions, les documents disponibles et les exigences propres à l’opération."
                icon={Sparkles}
                dark
              />
            </Reveal>

            <Reveal delay={0.06}>
              <ProductCard
                number="02"
                name="Diamant"
                category="Ressource précieuse"
                description="Produit destiné aux circuits commerciaux internationaux dans le respect des exigences applicables à chaque transaction."
                icon={Diamond}
                dark
              />
            </Reveal>

            <Reveal delay={0.12}>
              <ProductCard
                number="03"
                name="Cathodes de cuivre"
                category="Produit raffiné"
                description="Produit de cuivre destiné aux acheteurs et traders internationaux selon les spécifications et conditions commerciales convenues."
                icon={Package}
                dark
              />
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="mt-10 overflow-hidden rounded-[28px] border border-white/10">
              <div className="grid lg:grid-cols-[0.95fr_1.05fr]">

                <div className="relative min-h-[360px]">
                  <Image
                    src="/images/supply-international.jpg"
                    alt="Produits miniers destinés aux marchés internationaux"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-r from-[#080A09]/10 via-[#080A09]/15 to-[#080A09]/85" />
                </div>

                <div className="flex items-center bg-[#0D100F] p-7 sm:p-9 lg:p-11">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.23em] text-[#E1C487]/70">
                      Positionnement trading
                    </p>

                    <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                      Un circuit orienté vers la valorisation commerciale
                    </h3>

                    <p className="mt-5 text-sm leading-7 text-white/45">
                      Le négoce concerne ici des produits dont le niveau de
                      transformation permet une orientation vers des circuits
                      commerciaux internationaux, en fonction de la nature du
                      produit et des exigences de l’opération.
                    </p>

                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                      {[
                        'Produits semi-finis',
                        'Produits finis',
                        'Acheteurs internationaux',
                        'Traders spécialisés',
                      ].map((item) => (
                        <div
                          key={item}
                          className="rounded-[16px] border border-white/10 bg-white/[0.035] px-4 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#E1C487]" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.11em] text-white/55">
                              {item}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =====================================================
          05 — NOTRE RÔLE
      ===================================================== */}

      <section
        id="role"
        className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28"
      >
        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-[#D7B66C]/[0.05] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">

            <Reveal>
              <div className="lg:sticky lg:top-[145px]">
                <SectionLabel>
                  Notre rôle
                </SectionLabel>

                <h2 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.05em] sm:text-4xl lg:text-5xl">
                  Plus qu’une
                  <br />
                  <span className="bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] bg-clip-text text-transparent">
                    mise en relation
                  </span>
                </h2>

                <p className="mt-6 max-w-md text-base leading-8 text-stone-600">
                  Une opération d’approvisionnement nécessite plus qu’un
                  contact. Notre intervention vise à structurer les
                  informations et à faciliter le dialogue entre les parties
                  concernées.
                </p>

                <div className="mt-8 overflow-hidden rounded-[24px] border border-stone-200 bg-[#0A0C0B] shadow-[0_25px_65px_rgba(15,23,42,0.10)]">
                  <div className="relative min-h-[310px]">
                    <Image
                      src="/images/supply-commercial.jpg"
                      alt="Professionnels échangeant autour d'une opportunité d'approvisionnement"
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/90 via-transparent to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#E1C487]/70">
                        Relation commerciale
                      </p>

                      <p className="mt-2 text-base font-semibold text-white">
                        Connecter les bons interlocuteurs autour d’une
                        opportunité réelle.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="space-y-5">

                {[
                  {
                    number: '01',
                    icon: Users,
                    title: 'Identifier les parties concernées',
                    text: 'Identifier les détenteurs de ressources, les fournisseurs, les acheteurs et les partenaires correspondant à la nature de l’opération.',
                  },
                  {
                    number: '02',
                    icon: FileCheck2,
                    title: 'Qualifier l’opportunité',
                    text: 'Structurer les informations disponibles sur la ressource, le produit, le besoin, le contexte et les conditions connues.',
                  },
                  {
                    number: '03',
                    icon: Handshake,
                    title: 'Faciliter la mise en relation',
                    text: 'Créer un cadre d’échange plus clair entre les différentes parties intéressées par l’opportunité.',
                  },
                  {
                    number: '04',
                    icon: Scale,
                    title: 'Structurer les échanges commerciaux',
                    text: 'Faciliter la circulation des informations utiles à l’appréciation de l’offre, du besoin et des conditions de l’opération.',
                  },
                  {
                    number: '05',
                    icon: ClipboardCheck,
                    title: 'Accompagner le suivi',
                    text: 'Maintenir une continuité d’information sur les éléments documentés dans le périmètre de l’opération.',
                  },
                ].map((item, index) => {
                  const Icon = item.icon

                  return (
                    <div
                      key={item.number}
                      className="group rounded-[24px] border border-stone-200 bg-[#FBFAF7] p-6 transition-all duration-400 hover:border-[#D7B66C]/35 hover:bg-white hover:shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:p-7"
                    >
                      <div className="flex items-start gap-5">
                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#C69B52]/20 bg-white text-[#B8873F]">
                          <Icon size={17} strokeWidth={1.7} />

                          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#FBFAF7] bg-[#0A0C0B] text-[7px] font-bold text-[#E1C487]">
                            {String(index + 1)}
                          </span>
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-base font-semibold tracking-[-0.02em] text-[#0A0C0B]">
                              {item.title}
                            </h3>

                            <span className="text-[8px] font-bold tracking-[0.18em] text-stone-300">
                              {item.number}
                            </span>
                          </div>

                          <p className="mt-2 text-sm leading-6 text-stone-500">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =====================================================
          06 — LOGISTIQUE & FLUX
      ===================================================== */}

      <section
        id="logistics"
        className="relative overflow-hidden bg-[#080A09] py-20 text-white sm:py-24 lg:py-28"
      >
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#B8873F]/[0.08] blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#E1C487]/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="grid items-center gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">

            <Reveal>
              <div>
                <SectionLabel light>
                  Logistique & flux
                </SectionLabel>

                <h2 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.05em] sm:text-4xl lg:text-5xl">
                  Des flux
                  <br />
                  <span className="bg-gradient-to-r from-[#F0D79F] via-[#D7B66C] to-[#B8873F] bg-clip-text text-transparent">
                    mieux coordonnés
                  </span>
                </h2>

                <p className="mt-6 max-w-xl text-base leading-8 text-white/50">
                  Lorsque l’opération le nécessite, BMI contribue à structurer
                  les informations relatives au transport, au chargement, à
                  l’acheminement et aux différentes étapes du flux.
                </p>

                <div className="mt-9 grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      icon: Truck,
                      title: 'Transport',
                      text: 'Informations et coordination relatives aux mouvements.',
                    },
                    {
                      icon: Package,
                      title: 'Chargement',
                      text: 'Informations disponibles sur les lots et opérations de chargement.',
                    },
                    {
                      icon: Route,
                      title: 'Acheminement',
                      text: 'Suivi des différentes étapes communiquées dans le cadre de l’opération.',
                    },
                    {
                      icon: MapPinned,
                      title: 'Suivi',
                      text: 'Centralisation des informations utiles au parcours de la ressource.',
                    },
                  ].map((item) => {
                    const Icon = item.icon

                    return (
                      <div
                        key={item.title}
                        className="rounded-[20px] border border-white/10 bg-white/[0.035] p-5"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E1C487]/[0.07] text-[#E1C487]">
                          <Icon size={17} strokeWidth={1.7} />
                        </div>

                        <h3 className="mt-4 text-sm font-semibold text-white/85">
                          {item.title}
                        </h3>

                        <p className="mt-1.5 text-sm leading-6 text-white/35">
                          {item.text}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="relative">
                <div className="absolute -inset-4 rounded-[34px] border border-[#D7B66C]/10" />
                <div className="absolute -inset-1 rounded-[30px] border border-[#D7B66C]/15" />

                <div className="relative min-h-[470px] overflow-hidden rounded-[28px] border border-white/10 bg-[#111513] shadow-[0_30px_90px_rgba(0,0,0,0.35)] sm:min-h-[560px]">
                  <Image
                    src="/images/supply-logistics.png"
                    alt="Logistique et flux de transport liés à l'approvisionnement minéral"
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.035]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/90 via-[#080A09]/10 to-transparent" />

                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D7B66C]/60 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D7B66C]/20 bg-[#0A0C0B]/75 text-[#E1C487] backdrop-blur-md">
                        <Truck size={17} strokeWidth={1.7} />
                      </div>

                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#E1C487]/70">
                          Flux logistiques
                        </p>

                        <p className="mt-1 text-sm font-medium text-white/80">
                          Transport · Chargement · Acheminement · Suivi
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =====================================================
          07 — INFORMATION & SUIVI
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#F5F3EE] py-20 sm:py-24 lg:py-28">
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">

            <Reveal>
              <div className="relative">
                <div className="absolute -inset-4 rounded-[34px] border border-[#C69B52]/12" />

                <div className="relative min-h-[430px] overflow-hidden rounded-[28px] bg-[#0A0C0B] shadow-[0_30px_80px_rgba(15,23,42,0.12)] sm:min-h-[520px]">
                  <Image
                    src="/images/supply-traceability.png"
                    alt="Suivi documentaire et structuration des informations d'une opération minière"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.035]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/92 via-[#080A09]/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#E1C487]/70">
                      Information & suivi
                    </p>

                    <p className="mt-2 max-w-md text-lg font-semibold tracking-[-0.02em] text-white sm:text-xl">
                      Une information structurée sur les étapes documentées de
                      l’opération.
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                      <span className="h-px w-12 bg-gradient-to-r from-[#B8873F] to-transparent" />

                      <span className="text-[8px] uppercase tracking-[0.18em] text-white/30">
                        Information · Documentation · Suivi
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div>
                <SectionLabel>
                  Information & suivi
                </SectionLabel>

                <h2 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.05em] sm:text-4xl lg:text-5xl">
                  Une continuité
                  <br />
                  <span className="bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] bg-clip-text text-transparent">
                    d’information
                  </span>
                </h2>

                <p className="mt-6 text-base leading-8 text-stone-600">
                  Chaque opportunité possède son propre contexte documentaire.
                  L’objectif est de structurer les informations disponibles et
                  de maintenir une lecture claire des étapes de l’opération.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    {
                      icon: FileCheck2,
                      title: 'Informations sur la ressource',
                      text: 'Centralisation des informations communiquées sur le produit ou la ressource.',
                    },
                    {
                      icon: ClipboardCheck,
                      title: 'Documentation disponible',
                      text: 'Organisation des documents et éléments fournis dans le cadre de l’opération.',
                    },
                    {
                      icon: MapPinned,
                      title: 'Étapes du parcours',
                      text: 'Suivi des étapes documentées et des informations communiquées.',
                    },
                    {
                      icon: ShieldCheck,
                      title: 'Suivi structuré',
                      text: 'Maintien d’une continuité d’information dans le périmètre défini.',
                    },
                  ].map((item, index) => {
                    const Icon = item.icon

                    return (
                      <div
                        key={item.title}
                        className="flex items-start gap-4 rounded-[20px] border border-stone-200 bg-white p-5"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FBFAF7] text-[#B8873F]">
                          <Icon size={17} strokeWidth={1.7} />
                        </div>

                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-sm font-semibold text-[#0A0C0B]">
                              {item.title}
                            </h3>

                            <span className="text-[8px] font-bold tracking-[0.18em] text-stone-300">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                          </div>

                          <p className="mt-1.5 text-sm leading-6 text-stone-500">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-8 rounded-[22px] border border-[#C69B52]/15 bg-[#FBFAF7] p-5">
                  <p className="text-sm leading-6 text-stone-500">
                    BMI structure et suit les informations disponibles sur
                    l’opération, selon les documents et données communiqués par
                    les parties concernées.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =====================================================
          08 — OPPORTUNITÉ / CONVERSION
      ===================================================== */}

      <section
        id="opportunity"
        className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28"
      >
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionLabel>
                Entrer dans le réseau BMI
              </SectionLabel>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl lg:text-5xl">
                Vous avez une ressource
                <br />
                <span className="bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] bg-clip-text text-transparent">
                  ou un besoin ?
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-stone-500">
                Présentez votre opportunité ou exprimez votre besoin afin que
                nous puissions comprendre le contexte, le produit recherché et
                les conditions de la démarche.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">

            {/* FOURNISSEUR */}

            <Reveal>
              <div className="group relative overflow-hidden rounded-[30px] bg-[#080A09]">
                <div className="relative min-h-[360px]">
                  <Image
                    src="/images/supply-opportunity.jpg"
                    alt="Présentation d'une opportunité d'approvisionnement minéral"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/95 via-[#080A09]/55 to-[#080A09]/10" />

                  <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-8">
                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#E1C487]/70">
                      Fournisseur / détenteur
                    </p>

                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                      Vous avez une ressource ?
                    </h3>

                    <p className="mt-4 max-w-lg text-sm leading-6 text-white/45">
                      Présentez votre produit, votre ressource ou votre
                      opportunité commerciale et partagez les informations
                      disponibles.
                    </p>

                    <Link
                      href="/opportunity?profile=supplier"
                      className="group/btn mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#D7B66C]/60 bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] px-6 text-sm font-semibold text-[#15120C] shadow-[0_14px_35px_rgba(184,137,63,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
                    >
                      Présenter une opportunité

                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover/btn:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ACHETEUR */}

            <Reveal delay={0.08}>
              <div className="group relative overflow-hidden rounded-[30px] border border-stone-200 bg-[#F5F3EE]">
                <div className="grid min-h-[360px] lg:grid-cols-[0.9fr_1.1fr]">

                  <div className="relative min-h-[260px] lg:min-h-full">
                    <Image
                      src="/images/supply-buyers.jpg"
                      alt="Recherche de produits miniers et besoins d'approvisionnement"
                      fill
                      sizes="(max-width: 1024px) 100vw, 38vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/75 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#080A09]/10 lg:via-transparent lg:to-[#F5F3EE]/90" />
                  </div>

                  <div className="flex items-center p-7 sm:p-8">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#9B793E]">
                        Acheteur / trader
                      </p>

                      <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#0A0C0B] sm:text-3xl">
                        Vous recherchez un produit ?
                      </h3>

                      <p className="mt-4 text-sm leading-6 text-stone-500">
                        Présentez votre besoin d’approvisionnement, les
                        spécifications recherchées et le marché de destination.
                      </p>

                      <Link
                        href="/opportunity?profile=investor"
                        className="group/btn mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full border border-stone-300 bg-[#0A0C0B] px-6 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D7B66C]/40 hover:text-[#E1C487]"
                      >
                        Exprimer un besoin

                        <ArrowUpRight
                          size={16}
                          className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                        />
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =====================================================
          09 — POSITIONNEMENT
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#F5F3EE] py-16 sm:py-20">
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <Reveal>
            <div className="grid gap-4 lg:grid-cols-3">

              {[
                {
                  icon: Handshake,
                  title: 'Relation',
                  text: 'Créer des connexions commerciales pertinentes entre l’offre et la demande.',
                },
                {
                  icon: FileCheck2,
                  title: 'Information',
                  text: 'Structurer les données et documents disponibles autour de chaque opportunité.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Responsabilité',
                  text: 'Favoriser des échanges professionnels et adaptés au contexte de chaque opération.',
                },
              ].map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.title}
                    className="rounded-[24px] border border-stone-200 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.035)] sm:p-7"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0A0C0B] text-[#E1C487]">
                      <Icon size={18} strokeWidth={1.7} />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-[#0A0C0B]">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-stone-500">
                      {item.text}
                    </p>
                  </div>
                )
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* =====================================================
          10 — CTA FINAL
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#080A09] py-20 text-white sm:py-24">
        <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#B8873F]/[0.08] blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-[#D7B66C]/[0.07] blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 text-center sm:px-8">

          <Reveal>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#D7B66C]/25 bg-[#D7B66C]/[0.06]">
              <Handshake
                size={23}
                className="text-[#E1C487]"
                strokeWidth={1.7}
              />
            </div>

            <p className="mt-7 text-[9px] font-bold uppercase tracking-[0.3em] text-[#E1C487]">
              Ventes & Approvisionnement
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-[46px]">
              Une ressource.
              <br />
              Un besoin.
              <br />
              Une opportunité.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/45">
              Parlons de votre ressource, de votre produit ou de votre besoin
              d’approvisionnement.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href="/opportunity?profile=supplier"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#D7B66C]/65 bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] px-7 text-sm font-semibold text-[#15120C] shadow-[0_12px_30px_rgba(184,137,63,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
              >
                Présenter une opportunité

                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 text-sm font-semibold text-white/75 backdrop-blur-sm transition-all duration-300 hover:border-[#E1C487]/35 hover:bg-white/[0.07] hover:text-[#E1C487]"
              >
                Nous contacter

                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="mt-9 flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-white/10" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/25">
                Local · Trading · Ressources · Flux
              </span>

              <span className="h-px w-10 bg-white/10" />
            </div>
          </Reveal>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E1C487]/60 to-transparent" />
      </section>
    </div>
  )
}

/* =========================================================
   ICON FALLBACK
========================================================= */

function CircleDotIcon({
  size = 18,
  strokeWidth = 1.7,
}: {
  size?: number
  strokeWidth?: number
}) {
  return (
    <span
      className="inline-flex items-center justify-center"
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="8"
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
        <circle
          cx="12"
          cy="12"
          r="2.5"
          fill="currentColor"
        />
      </svg>
    </span>
  )
}