'use client'

import {
  useRef,
  type ReactNode,
} from 'react'

import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Factory,
  Gauge,
  Map,
  Package,
  Route,
  ScanLine,
  ShieldCheck,
  Truck,
  Users,
} from 'lucide-react'

/* =========================================================
   PALETTE
========================================================= */

const GOLD_LIGHT = '#E1C487'
const GOLD = '#D7B66C'
const GOLD_DEEP = '#B8873F'
const GOLD_TEXT = '#9B793E'
const GOLD_DARK = '#9D7230'

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
}: {
  children: ReactNode
}) {
  return (
    <div className="inline-flex items-center gap-3">

      <span className="h-px w-8 bg-gradient-to-r from-[#B8873F] to-[#E1C487]" />

      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9B793E]">
        {children}
      </span>

    </div>
  )
}

/* =========================================================
   COMPONENT PRINCIPAL
========================================================= */

export default function ActivityDetailClient() {
  return (
    <div className="bg-[#F5F3EE]">

      {/* =========================================================
          INTRODUCTION
      ========================================================= */}

      <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-[#C69B52]/[0.05] blur-3xl" />

        <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[#E1C487]/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">

            {/* TITRE */}

            <Reveal>

              <div>

                <SectionLabel>
                  Présentation
                </SectionLabel>

                <h2 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl lg:text-5xl">

                  Piloter les flux

                  <br />

                  <span className="bg-gradient-to-r from-[#B8873F] via-[#D1AB60] to-[#9B7334] bg-clip-text text-transparent">
                    de la mine à l’usine
                  </span>

                </h2>

                <div className="mt-7 h-px w-20 bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-transparent" />

              </div>

            </Reveal>

            {/* TEXTE */}

            <Reveal delay={0.08}>

              <div>

                <p className="text-base leading-8 text-stone-600">
                  La gestion des opérations minières repose sur une
                  coordination rigoureuse des flux de production, de
                  transport et de traitement. Chaque chargement doit pouvoir
                  être suivi, documenté et rapproché des informations
                  opérationnelles enregistrées au cours de son parcours.
                </p>

                <p className="mt-5 text-base leading-8 text-stone-600">
                  Chez{' '}
                  <strong className="font-semibold text-[#0A0C0B]">
                    Barack Mining Investment
                  </strong>
                  , nous intégrons le suivi opérationnel et la traçabilité
                  des flux afin de disposer d’une vision plus claire des
                  mouvements des camions, des trajets effectués et des données
                  associées aux chargements.
                </p>

                <div className="relative mt-8 overflow-hidden rounded-[22px] border border-[#C69B52]/18 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:p-6">

                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D7B66C]/70 to-transparent" />

                  <div className="flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A0C0B] text-[#E1C487]">

                      <Route
                        size={20}
                        strokeWidth={1.7}
                      />

                    </div>

                    <div>

                      <p className="text-[9px] font-bold uppercase tracking-[0.20em] text-[#9B793E]">
                        Principe opérationnel
                      </p>

                      <p className="mt-1 text-sm leading-6 text-stone-600">
                        Assurer la traçabilité des flux et rapprocher les
                        informations issues du transport et du contrôle des
                        chargements.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </Reveal>

          </div>

        </div>
      </section>

      {/* =========================================================
          DOMAINES D'INTERVENTION
      ========================================================= */}

      <section className="relative overflow-hidden border-y border-stone-200/70 bg-white py-20 sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-[#D7B66C]/[0.05] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <Reveal>

            <div className="mx-auto max-w-3xl text-center">

              <SectionLabel>
                Domaines d’intervention
              </SectionLabel>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl">

                Notre expertise en{' '}

                <span className="bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] bg-clip-text text-transparent">
                  opérations minières
                </span>

              </h2>

              <p className="mt-5 text-base leading-7 text-stone-500">
                Une approche intégrée pour coordonner les opérations,
                sécuriser les flux et améliorer la visibilité sur les
                mouvements de la mine jusqu’à l’usine.
              </p>

            </div>

          </Reveal>

          {/* CARDS */}

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {[
              {
                icon: Factory,
                title: 'Production et extraction',
                description:
                  'Coordination des activités de production, suivi des volumes et observation des performances opérationnelles.',
              },
              {
                icon: Truck,
                title: 'Transport et logistique',
                description:
                  'Organisation des mouvements de minerai et coordination des flux entre les différents points opérationnels.',
              },
              {
                icon: Route,
                title: 'Suivi GPS des camions',
                description:
                  'Suivi des véhicules et enregistrement des trajets afin d’améliorer la visibilité sur les déplacements des chargements.',
              },
              {
                icon: ScanLine,
                title: 'Contrôle au pont bascule',
                description:
                  'Enregistrement du poids des chargements au passage au pont bascule et association des données au suivi opérationnel.',
              },
              {
                icon: BarChart3,
                title: 'Suivi des données de chargement',
                description:
                  'Centralisation des informations relatives aux chargements, notamment les données de poids et les informations de teneur disponibles.',
              },
              {
                icon: ShieldCheck,
                title: 'Traçabilité et reporting',
                description:
                  'Consolidation des informations opérationnelles pour faciliter le contrôle, le reporting et l’analyse des flux.',
              },
            ].map((item, index) => {

              const Icon = item.icon

              return (
                <Reveal
                  key={item.title}
                  delay={index * 0.06}
                >

                  <div className="group relative h-full overflow-hidden rounded-[24px] border border-stone-200 bg-[#FBFAF7] p-6 shadow-[0_12px_35px_rgba(15,23,42,0.04)] transition-all duration-500 hover:-translate-y-1 hover:border-[#C69B52]/35 hover:bg-white hover:shadow-[0_24px_55px_rgba(184,137,63,0.09)] sm:p-7">

                    <div className="absolute left-7 right-7 top-0 h-px bg-gradient-to-r from-transparent via-[#D7B66C]/0 to-transparent transition-all duration-500 group-hover:via-[#D7B66C]/60" />

                    <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-[#D7B66C]/[0.07] blur-2xl transition-transform duration-700 group-hover:scale-150" />

                    <div className="relative">

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0A0C0B] text-[#E1C487] transition-all duration-300 group-hover:scale-105">

                          <Icon
                            size={20}
                            strokeWidth={1.8}
                          />

                        </div>

                        <span className="text-[9px] font-bold tracking-[0.20em] text-stone-300">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                      </div>

                      <h3 className="mt-6 text-lg font-semibold tracking-[-0.03em] text-[#0A0C0B]">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-stone-500">
                        {item.description}
                      </p>

                      <div className="mt-7 flex items-center gap-3">

                        <span className="h-px flex-1 bg-stone-200 transition-colors duration-300 group-hover:bg-[#D7B66C]/45" />

                        <span className="h-1.5 w-1.5 rounded-full bg-[#C69B52] opacity-60 transition-all duration-300 group-hover:scale-125 group-hover:opacity-100" />

                      </div>

                    </div>

                  </div>

                </Reveal>
              )
            })}

          </div>

        </div>
      </section>

      {/* =========================================================
          PLATEFORME DE SUIVI
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#080A09] py-20 text-white sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#B8873F]/[0.08] blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#E1C487]/[0.07] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="grid items-center gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">

            {/* TEXTE */}

            <Reveal>

              <div>

                <SectionLabel>
                  Suivi opérationnel
                </SectionLabel>

                <h2 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.05em] sm:text-4xl lg:text-5xl">

                  Une visibilité

                  <br />

                  <span className="bg-gradient-to-r from-[#F0D79F] via-[#D7B66C] to-[#B8873F] bg-clip-text text-transparent">
                    sur les flux miniers
                  </span>

                </h2>

                <p className="mt-6 max-w-xl text-base leading-8 text-white/55">
                  La plateforme de suivi permet de centraliser les informations
                  opérationnelles liées aux mouvements des camions et aux
                  chargements, afin de disposer d’une meilleure visibilité
                  entre le site minier et l’usine.
                </p>

                <div className="mt-8 space-y-4">

                  {[
                    {
                      icon: Map,
                      title: 'Localisation des véhicules',
                      text: 'Suivi des camions à partir des informations GPS disponibles.',
                    },
                    {
                      icon: Route,
                      title: 'Trajets enregistrés',
                      text: 'Conservation des informations relatives aux déplacements effectués.',
                    },
                    {
                      icon: Truck,
                      title: 'Suivi des chargements',
                      text: 'Association des mouvements des véhicules aux opérations de chargement.',
                    },
                    {
                      icon: Gauge,
                      title: 'Poids au pont bascule',
                      text: 'Enregistrement du poids des chargements au moment du contrôle.',
                    },
                    {
                      icon: BarChart3,
                      title: 'Teneur et données opérationnelles',
                      text: 'Centralisation des informations de teneur et des données disponibles sur les chargements.',
                    },
                  ].map((item, index) => {

                    const Icon = item.icon

                    return (
                      <div
                        key={item.title}
                        className="group flex items-start gap-4"
                      >

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#E1C487] transition-colors duration-300 group-hover:border-[#E1C487]/30 group-hover:bg-[#E1C487]/[0.07]">

                          <Icon
                            size={17}
                            strokeWidth={1.7}
                          />

                        </div>

                        <div>

                          <p className="text-sm font-semibold text-white/85">
                            {item.title}
                          </p>

                          <p className="mt-1 text-sm leading-6 text-white/40">
                            {item.text}
                          </p>

                        </div>

                        <span className="ml-auto pt-1 text-[9px] font-bold tracking-[0.15em] text-white/15">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                      </div>
                    )
                  })}

                </div>

              </div>

            </Reveal>

            {/* SCREENSHOT PLATEFORME */}

            <Reveal delay={0.12}>

              <div className="relative">

                <div className="absolute -inset-4 rounded-[34px] border border-[#D7B66C]/10" />

                <div className="absolute -inset-1 rounded-[30px] border border-[#D7B66C]/15" />

                <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111513] shadow-[0_30px_90px_rgba(0,0,0,0.35)]">

                  {/* TOP BAR */}

                  <div className="flex items-center justify-between border-b border-white/10 bg-[#0D1110] px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E1C487]/[0.08] text-[#E1C487]">

                        <BarChart3
                          size={15}
                          strokeWidth={1.7}
                        />

                      </div>

                      <div>

                        <p className="text-[9px] font-bold uppercase tracking-[0.20em] text-[#E1C487]">
                          Plateforme
                        </p>

                        <p className="mt-0.5 text-xs font-medium text-white/65">
                          Suivi des opérations
                        </p>

                      </div>

                    </div>

                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-emerald-300/70">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/70" />
                      Suivi actif
                    </span>

                  </div>

                  {/* IMAGE */}

                  <div className="relative aspect-[16/10] overflow-hidden bg-[#0A0C0B]">

                    <Image
                      src="/images/operations-platform.png"
                      alt="Capture d’écran de la plateforme de suivi des opérations minières"
                      fill
                      sizes="(max-width: 1024px) 100vw, 65vw"
                      className="object-cover object-top"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080A09]/75 via-transparent to-transparent" />

                  </div>

                  {/* FOOTER */}

                  <div className="grid grid-cols-2 border-t border-white/10 sm:grid-cols-4">

                    {[
                      {
                        label: 'GPS',
                        value: 'Trajets',
                      },
                      {
                        label: 'Camions',
                        value: 'Chargements',
                      },
                      {
                        label: 'Poids',
                        value: 'Pont bascule',
                      },
                      {
                        label: 'Teneur',
                        value: 'Données',
                      },
                    ].map((item, index) => (

                      <div
                        key={item.label}
                        className={`px-4 py-4 ${
                          index < 3
                            ? 'border-r border-white/10'
                            : ''
                        }`}
                      >

                        <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#E1C487]/55">
                          {item.label}
                        </p>

                        <p className="mt-1 text-[10px] font-medium text-white/45">
                          {item.value}
                        </p>

                      </div>

                    ))}

                  </div>

                </div>

                {/* FLOATING LABEL */}

                <div className="absolute -bottom-6 left-6 right-6 rounded-2xl border border-[#D7B66C]/20 bg-[#101412]/95 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.30)] backdrop-blur-md sm:left-auto sm:w-[290px]">

                  <div className="flex items-start gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#D7B66C]/[0.08] text-[#E1C487]">

                      <Truck
                        size={16}
                        strokeWidth={1.7}
                      />

                    </div>

                    <div>

                      <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#E1C487]/70">
                        Traçabilité
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/55">
                        De la mine jusqu’au contrôle du chargement à l’usine.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </Reveal>

          </div>

        </div>
      </section>

      {/* =========================================================
          CHAÎNE DE TRAÇABILITÉ
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#F5F3EE] py-20 sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[#D7B66C]/[0.05] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <Reveal>

            <div className="mx-auto max-w-3xl text-center">

              <SectionLabel>
                Chaîne de traçabilité
              </SectionLabel>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl lg:text-5xl">

                Du chargement

                <span className="bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] bg-clip-text text-transparent">
                  au contrôle
                </span>

              </h2>

              <p className="mt-5 text-base leading-7 text-stone-500">
                Une continuité d’information permettant de rapprocher les
                différentes étapes du flux opérationnel.
              </p>

            </div>

          </Reveal>

          <Reveal delay={0.08}>

            <div className="relative mt-14">

              {/* CONNECTOR */}

              <div className="absolute left-[10%] right-[10%] top-9 hidden h-px bg-gradient-to-r from-[#B8873F]/20 via-[#D7B66C]/55 to-[#B8873F]/20 lg:block" />

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

                {[
                  {
                    icon: Package,
                    number: '01',
                    title: 'Chargement',
                    text: 'Préparation et enregistrement du chargement.',
                  },
                  {
                    icon: Truck,
                    number: '02',
                    title: 'Transport',
                    text: 'Mouvement du camion vers le point de destination.',
                  },
                  {
                    icon: Map,
                    number: '03',
                    title: 'GPS & trajet',
                    text: 'Suivi de la position et du parcours enregistré.',
                  },
                  {
                    icon: ScanLine,
                    number: '04',
                    title: 'Pont bascule',
                    text: 'Contrôle et enregistrement du poids.',
                  },
                  {
                    icon: BarChart3,
                    number: '05',
                    title: 'Données',
                    text: 'Centralisation des informations disponibles sur le chargement.',
                  },
                ].map((item, index) => {

                  const Icon = item.icon

                  return (
                    <div
                      key={item.number}
                      className="relative rounded-[22px] border border-stone-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.04)]"
                    >

                      <div className="relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[#C69B52]/25 bg-[#FBFAF7]">

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0A0C0B] text-[#E1C487]">

                          <Icon
                            size={19}
                            strokeWidth={1.8}
                          />

                        </div>

                      </div>

                      <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.20em] text-[#9B793E]">
                        {item.number}
                      </p>

                      <h3 className="mt-2 text-base font-semibold tracking-[-0.02em] text-[#0A0C0B]">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-stone-500">
                        {item.text}
                      </p>

                    </div>
                  )
                })}

              </div>

            </div>

          </Reveal>

        </div>
      </section>

      {/* =========================================================
          MÉTHODOLOGIE
      ========================================================= */}

      <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-[#D7B66C]/[0.05] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">

            {/* TEXTE */}

            <Reveal>

              <div>

                <SectionLabel>
                  Méthodologie
                </SectionLabel>

                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl lg:text-5xl">

                  Une approche{' '}

                  <span className="bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] bg-clip-text text-transparent">
                    intégrée
                  </span>

                </h2>

                <p className="mt-6 max-w-xl text-base leading-8 text-stone-600">
                  L’organisation des opérations s’appuie sur la coordination
                  des équipes et des flux, mais également sur la capacité à
                  conserver une information exploitable tout au long du
                  processus.
                </p>

                <div className="mt-9 space-y-5">

                  {[
                    'Planification des opérations et définition des besoins',
                    'Organisation des mouvements et coordination des équipes',
                    'Suivi des camions et des trajets au moyen des données GPS disponibles',
                    'Enregistrement et contrôle des informations au pont bascule',
                    'Centralisation des données, reporting et analyse des flux',
                  ].map((item, index) => (

                    <div
                      key={item}
                      className="group flex items-start gap-4"
                    >

                      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#C69B52]/30 bg-[#FBFAF7] text-[9px] font-bold text-[#9B793E]">

                        <span className="absolute inset-0 rounded-full border border-[#D7B66C]/0 transition-colors duration-300 group-hover:border-[#D7B66C]/40" />

                        {String(index + 1).padStart(2, '0')}

                      </div>

                      <p className="pt-1 text-sm leading-6 text-stone-600 transition-colors duration-300 group-hover:text-[#0A0C0B]">
                        {item}
                      </p>

                    </div>

                  ))}

                </div>

              </div>

            </Reveal>

            {/* IMAGE */}

            <Reveal delay={0.1}>

              <div className="relative">

                <div className="absolute -inset-4 rounded-[34px] border border-[#C69B52]/12" />

                <div className="absolute -inset-1 rounded-[30px] border border-[#D7B66C]/15" />

                <div className="relative min-h-[400px] overflow-hidden rounded-[28px] bg-[#0A0C0B] shadow-[0_30px_80px_rgba(15,23,42,0.13)] sm:min-h-[470px]">

                  <Image
                    src="/images/operations-method.png"
                    alt="Coordination et méthodologie des opérations minières"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.035]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/90 via-transparent to-transparent" />

                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D7B66C]/65 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#E1C487]/65">
                      Coordination opérationnelle
                    </p>

                    <p className="mt-2 text-base font-semibold tracking-[-0.02em] text-white sm:text-lg">
                      Des opérations structurées et une information centralisée
                    </p>

                    <div className="mt-4 h-px w-16 bg-gradient-to-r from-[#B8873F] to-transparent" />

                  </div>

                </div>

              </div>

            </Reveal>

          </div>

        </div>
      </section>

      {/* =========================================================
          INDICATEURS
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#F5F3EE] py-16 sm:py-20">

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <Reveal>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {[
                {
                  icon: Truck,
                  eyebrow: 'Transport',
                  title: 'Suivi des mouvements',
                  text: 'Une meilleure visibilité sur les déplacements des véhicules.',
                },
                {
                  icon: Route,
                  eyebrow: 'Trajets',
                  title: 'Historique des parcours',
                  text: 'Les informations de déplacement peuvent être exploitées dans le suivi opérationnel.',
                },
                {
                  icon: ScanLine,
                  eyebrow: 'Pont bascule',
                  title: 'Poids enregistré',
                  text: 'Données de pesage intégrées au processus de suivi.',
                },
                {
                  icon: BarChart3,
                  eyebrow: 'Reporting',
                  title: 'Données centralisées',
                  text: 'Une base d’information plus structurée pour le contrôle et l’analyse.',
                },
              ].map((item) => {

                const Icon = item.icon

                return (
                  <div
                    key={item.title}
                    className="rounded-[22px] border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.035)]"
                  >

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A0C0B] text-[#E1C487]">

                      <Icon
                        size={18}
                        strokeWidth={1.7}
                      />

                    </div>

                    <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.20em] text-[#9B793E]">
                      {item.eyebrow}
                    </p>

                    <h3 className="mt-2 text-base font-semibold text-[#0A0C0B]">
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

      {/* =========================================================
          CTA
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#080A09] py-20 text-white sm:py-24">

        <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#B8873F]/[0.07] blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-[#D7B66C]/[0.07] blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 text-center sm:px-8">

          <Reveal>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#D7B66C]/25 bg-[#D7B66C]/[0.06]">

              <Factory
                size={23}
                className="text-[#E1C487]"
                strokeWidth={1.7}
              />

            </div>

            <p className="mt-7 text-[9px] font-bold uppercase tracking-[0.30em] text-[#E1C487]">
              Opérations minières
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Besoin d’un meilleur suivi des opérations ?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/45">
              Échangeons sur vos opérations, vos flux logistiques et vos
              besoins de suivi afin d’identifier une organisation adaptée à
              votre environnement de travail.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">

              <Link
                href="/opportunity?profile=company"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#D7B66C]/65 bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] px-7 text-sm font-semibold text-[#15120C] shadow-[0_12px_30px_rgba(184,137,63,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
              >

                Discuter d’un projet

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
              </Link>

            </div>

            <div className="mt-9 flex items-center justify-center gap-4">

              <span className="h-px w-10 bg-white/10" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/25">
                Traçabilité · Contrôle · Performance
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