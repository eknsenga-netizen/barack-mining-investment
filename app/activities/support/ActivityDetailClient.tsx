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
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Globe2,
  Handshake,
  Landmark,
  MapPinned,
  Route,
  ShieldCheck,
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
   COMPONENT
========================================================= */

export default function ActivityDetailClient() {
  return (
    <div className="bg-[#F5F3EE] text-[#0A0C0B]">

      {/* =========================================================
          01 — POSITIONNEMENT
      ========================================================= */}

      <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute -right-24 top-8 h-96 w-96 rounded-full bg-[#C69B52]/[0.05] blur-3xl" />

        <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[#E1C487]/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">

            <Reveal>

              <div>

                <SectionLabel>
                  Positionnement
                </SectionLabel>

                <h2 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.05em] sm:text-4xl lg:text-5xl">

                  Transformer une idée

                  <br />

                  <span className="bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9B7334] bg-clip-text text-transparent">
                    en projet structuré
                  </span>

                </h2>

                <div className="mt-7 h-px w-20 bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-transparent" />

                <p className="mt-6 max-w-md text-sm leading-7 text-stone-500">
                  Un accompagnement destiné à faciliter l’installation,
                  l’organisation et le développement des projets dans leur
                  environnement économique et institutionnel.
                </p>

              </div>

            </Reveal>

            <Reveal delay={0.08}>

              <div>

                <p className="text-base leading-8 text-stone-600">
                  Le développement d’un projet minier mobilise des dimensions
                  techniques, administratives, institutionnelles et
                  organisationnelles. Pour un investisseur ou une entreprise,
                  comprendre cet environnement et structurer les premières
                  étapes constitue une part importante du travail préparatoire.
                </p>

                <p className="mt-5 text-base leading-8 text-stone-600">
                  Chez{' '}
                  <strong className="font-semibold text-[#0A0C0B]">
                    Barack Mining Investment
                  </strong>
                  , nous accompagnons les investisseurs, entreprises et
                  porteurs de projets en facilitant certaines démarches,
                  certaines interfaces et certains échanges nécessaires au
                  développement de leurs initiatives.
                </p>

                <div className="relative mt-8 overflow-hidden rounded-[22px] border border-[#C69B52]/18 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:p-6">

                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D7B66C]/70 to-transparent" />

                  <div className="flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A0C0B] text-[#E1C487]">

                      <Handshake
                        size={20}
                        strokeWidth={1.7}
                      />

                    </div>

                    <div>

                      <p className="text-[9px] font-bold uppercase tracking-[0.20em] text-[#9B793E]">
                        Principe BMI
                      </p>

                      <p className="mt-1 text-sm leading-6 text-stone-600">
                        Créer un cadre plus clair pour faciliter
                        l’installation, les échanges et le développement
                        d’un projet.
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
          02 — INVESTISSEURS / PROJETS
      ========================================================= */}

      <section className="relative overflow-hidden border-y border-stone-200/70 bg-white py-20 sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[#D7B66C]/[0.045] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="grid items-center gap-12 lg:grid-cols-[1.06fr_0.94fr] lg:gap-16">

            {/* IMAGE */}

            <Reveal>

              <div className="relative">

                <div className="absolute -inset-4 rounded-[34px] border border-[#C69B52]/12" />

                <div className="absolute -inset-1 rounded-[30px] border border-[#D7B66C]/15" />

                <div className="relative min-h-[420px] overflow-hidden rounded-[28px] bg-[#0A0C0B] shadow-[0_30px_80px_rgba(15,23,42,0.13)] sm:min-h-[510px]">

                  <Image
                    src="/images/support-investors.jpeg"
                    alt="Réunion stratégique autour d'un projet et d'un investissement minier"
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.035]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/90 via-[#080A09]/10 to-transparent" />

                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D7B66C]/65 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#E1C487]/70">
                      Investissement & projets
                    </p>

                    <p className="mt-2 max-w-md text-lg font-semibold tracking-[-0.02em] text-white">
                      Préparer un projet pour son environnement
                    </p>

                    <div className="mt-4 h-px w-16 bg-gradient-to-r from-[#B8873F] to-transparent" />

                  </div>

                </div>

              </div>

            </Reveal>

            {/* TEXTE */}

            <Reveal delay={0.1}>

              <div>

                <SectionLabel>
                  Investisseurs & entreprises
                </SectionLabel>

                <h2 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.05em] sm:text-4xl lg:text-5xl">

                  Un accompagnement

                  <br />

                  <span className="bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] bg-clip-text text-transparent">
                    adapté à chaque projet
                  </span>

                </h2>

                <p className="mt-6 text-base leading-8 text-stone-600">
                  Chaque projet présente un niveau de maturité, des besoins
                  et un environnement différents. L’accompagnement commence
                  donc par la compréhension du contexte et des priorités.
                </p>

                <div className="mt-8 space-y-5">

                  {[
                    {
                      icon: Users,
                      title: 'Comprendre le besoin',
                      text: 'Identifier les objectifs, les priorités et les principales étapes nécessaires au projet.',
                    },
                    {
                      icon: Building2,
                      title: 'Préparer l’installation',
                      text: 'Faciliter la structuration des premiers éléments nécessaires à l’implantation du projet.',
                    },
                    {
                      icon: Route,
                      title: 'Organiser les étapes',
                      text: 'Aider à structurer une feuille de route cohérente pour les différentes phases du développement.',
                    },
                  ].map((item, index) => {

                    const Icon = item.icon

                    return (
                      <div
                        key={item.title}
                        className="group flex items-start gap-4"
                      >

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-[#FBFAF7] text-[#B8873F] transition-all duration-300 group-hover:border-[#D7B66C]/40 group-hover:bg-[#F7F1E4]">

                          <Icon
                            size={18}
                            strokeWidth={1.7}
                          />

                        </div>

                        <div className="flex-1">

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

              </div>

            </Reveal>

          </div>

        </div>
      </section>

      {/* =========================================================
          03 — DOMAINES D'INTERVENTION
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#F5F3EE] py-20 sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#D7B66C]/[0.055] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <Reveal>

            <div className="mx-auto max-w-3xl text-center">

              <SectionLabel>
                Domaines d’intervention
              </SectionLabel>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl lg:text-5xl">

                Structurer les différentes dimensions

                <br />

                <span className="bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] bg-clip-text text-transparent">
                  d’un projet
                </span>

              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-stone-500">
                Une approche globale qui prend en compte les dimensions
                administratives, institutionnelles, organisationnelles et
                stratégiques d’un projet.
              </p>

            </div>

          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {[
              {
                icon: Building2,
                title: 'Installation & structuration',
                description:
                  'Accompagnement des premières étapes d’implantation et de structuration organisationnelle.',
              },
              {
                icon: FileCheck2,
                title: 'Démarches administratives',
                description:
                  'Appui dans l’organisation et le suivi des démarches administratives nécessaires au projet.',
              },
              {
                icon: Landmark,
                title: 'Interface institutionnelle',
                description:
                  'Facilitation des échanges avec les interlocuteurs institutionnels et les autorités compétentes.',
              },
              {
                icon: ClipboardCheck,
                title: 'Développement du projet',
                description:
                  'Organisation des étapes, priorités et actions nécessaires à l’avancement du projet.',
              },
              {
                icon: MapPinned,
                title: 'Actifs & opportunités',
                description:
                  'Accompagnement dans l’identification et l’analyse des opportunités et actifs liés au projet.',
              },
              {
                icon: Globe2,
                title: 'Ouverture internationale',
                description:
                  'Facilitation des échanges avec les investisseurs, entreprises et partenaires internationaux.',
              },
            ].map((item, index) => {

              const Icon = item.icon

              return (
                <Reveal
                  key={item.title}
                  delay={index * 0.06}
                >

                  <div className="group relative h-full overflow-hidden rounded-[24px] border border-stone-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.04)] transition-all duration-500 hover:-translate-y-1 hover:border-[#C69B52]/35 hover:shadow-[0_24px_55px_rgba(184,137,63,0.09)] sm:p-7">

                    <div className="absolute left-7 right-7 top-0 h-px bg-gradient-to-r from-transparent via-[#D7B66C]/0 to-transparent transition-all duration-500 group-hover:via-[#D7B66C]/65" />

                    <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-[#D7B66C]/[0.065] blur-2xl transition-transform duration-700 group-hover:scale-150" />

                    <div className="relative">

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0A0C0B] text-[#E1C487] transition-transform duration-300 group-hover:scale-105">

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
          04 — INSTITUTIONNEL
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#080A09] py-20 text-white sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#B8873F]/[0.08] blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#E1C487]/[0.07] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="grid items-center gap-12 lg:grid-cols-[0.84fr_1.16fr] lg:gap-16">

            {/* TEXTE */}

            <Reveal>

              <div>

                <SectionLabel>
                  Environnement institutionnel
                </SectionLabel>

                <h2 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.05em] sm:text-4xl lg:text-5xl">

                  Faciliter le dialogue

                  <br />

                  <span className="bg-gradient-to-r from-[#F0D79F] via-[#D7B66C] to-[#B8873F] bg-clip-text text-transparent">
                    autour du projet
                  </span>

                </h2>

                <p className="mt-6 max-w-xl text-base leading-8 text-white/55">
                  La réussite d’un projet dépend également de sa capacité à
                  évoluer dans son environnement institutionnel et économique.
                  BMI intervient pour faciliter certaines interfaces et
                  organiser les échanges utiles au projet.
                </p>

                <div className="mt-8 space-y-5">

                  {[
                    {
                      icon: Landmark,
                      title: 'Relations institutionnelles',
                      text: 'Facilitation des interactions avec les interlocuteurs et structures concernés.',
                    },
                    {
                      icon: FileCheck2,
                      title: 'Suivi documentaire',
                      text: 'Organisation des informations et documents nécessaires au suivi des différentes étapes.',
                    },
                    {
                      icon: Users,
                      title: 'Coordination des parties prenantes',
                      text: 'Meilleure circulation des informations entre les acteurs impliqués dans le projet.',
                    },
                    {
                      icon: ShieldCheck,
                      title: 'Cadre structuré',
                      text: 'Une approche visant à rendre les étapes du projet plus lisibles et mieux organisées.',
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

                          <div className="flex items-center gap-3">

                            <p className="text-sm font-semibold text-white/85">
                              {item.title}
                            </p>

                            <span className="text-[8px] font-bold tracking-[0.16em] text-white/15">
                              {String(index + 1).padStart(2, '0')}
                            </span>

                          </div>

                          <p className="mt-1 text-sm leading-6 text-white/40">
                            {item.text}
                          </p>

                        </div>

                      </div>
                    )
                  })}

                </div>

              </div>

            </Reveal>

            {/* IMAGE */}

            <Reveal delay={0.12}>

              <div className="relative">

                <div className="absolute -inset-4 rounded-[34px] border border-[#D7B66C]/10" />

                <div className="absolute -inset-1 rounded-[30px] border border-[#D7B66C]/15" />

                <div className="relative min-h-[430px] overflow-hidden rounded-[28px] border border-white/10 bg-[#111513] shadow-[0_30px_90px_rgba(0,0,0,0.35)] sm:min-h-[520px]">

                  <Image
                    src="/images/support-institutional.jpg"
                    alt="Échange institutionnel autour d'un projet minier"
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.035]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/90 via-[#080A09]/5 to-transparent" />

                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D7B66C]/60 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D7B66C]/20 bg-[#0A0C0B]/75 text-[#E1C487] backdrop-blur-md">

                        <Landmark
                          size={17}
                          strokeWidth={1.7}
                        />

                      </div>

                      <div>

                        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#E1C487]/70">
                          Interface institutionnelle
                        </p>

                        <p className="mt-1 text-sm font-medium text-white/80">
                          Dialogue · Coordination · Suivi
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

      {/* =========================================================
          05 — MÉTHODOLOGIE
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

                  Une approche

                  <br />

                  <span className="bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] bg-clip-text text-transparent">
                    progressive et structurée
                  </span>

                </h2>

                <p className="mt-6 max-w-xl text-base leading-8 text-stone-600">
                  L’accompagnement est organisé autour des priorités réelles
                  du projet afin d’éviter une approche standardisée et de
                  conserver une vision claire des prochaines étapes.
                </p>

                <div className="mt-9 space-y-5">

                  {[
                    'Diagnostic initial et compréhension du projet',
                    'Identification des priorités et des besoins',
                    'Élaboration d’une feuille de route adaptée',
                    'Organisation des démarches et interfaces utiles',
                    'Suivi des étapes et ajustement selon l’évolution du projet',
                  ].map((item, index) => (

                    <div
                      key={item}
                      className="group flex items-start gap-4"
                    >

                      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#C69B52]/25 bg-[#FBFAF7] text-[9px] font-bold text-[#9B793E]">

                        <span className="absolute inset-0 rounded-full border border-[#D7B66C]/0 transition-colors duration-300 group-hover:border-[#D7B66C]/45" />

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

                <div className="relative min-h-[430px] overflow-hidden rounded-[28px] bg-[#0A0C0B] shadow-[0_30px_80px_rgba(15,23,42,0.13)] sm:min-h-[510px]">

                  <Image
                    src="/images/support-method.jpg"
                    alt="Méthodologie d'accompagnement et structuration d'un projet"
                    fill
                    sizes="(max-width: 1024px) 100vw, 52vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.035]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/90 via-transparent to-transparent" />

                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D7B66C]/65 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#E1C487]/65">
                      Accompagnement personnalisé
                    </p>

                    <p className="mt-2 text-base font-semibold tracking-[-0.02em] text-white sm:text-lg">
                      Une feuille de route adaptée au contexte du projet
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
          06 — VALEUR
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#F5F3EE] py-16 sm:py-20">

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <Reveal>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {[
                {
                  icon: Building2,
                  eyebrow: 'Installation',
                  title: 'Cadre préparé',
                  text: 'Structurer les premières étapes nécessaires à l’implantation du projet.',
                },
                {
                  icon: FileCheck2,
                  eyebrow: 'Organisation',
                  title: 'Démarches suivies',
                  text: 'Centraliser les informations utiles aux étapes administratives.',
                },
                {
                  icon: Landmark,
                  eyebrow: 'Institutionnel',
                  title: 'Interfaces facilitées',
                  text: 'Créer une meilleure continuité dans les échanges avec les interlocuteurs concernés.',
                },
                {
                  icon: Route,
                  eyebrow: 'Développement',
                  title: 'Projet structuré',
                  text: 'Conserver une vision plus claire des étapes et priorités du projet.',
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
          07 — CTA
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#080A09] py-20 text-white sm:py-24">

        <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#B8873F]/[0.07] blur-3xl" />

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

            <p className="mt-7 text-[9px] font-bold uppercase tracking-[0.30em] text-[#E1C487]">
              Support aux projets
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-[44px]">
              Vous préparez un projet minier ?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/45">
              Présentez-nous votre projet, vos besoins ou votre contexte
              d’investissement afin d’échanger sur les possibilités
              d’accompagnement et les prochaines étapes.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">

              <Link
                href="/opportunity?profile=company"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#D7B66C]/65 bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] px-7 text-sm font-semibold text-[#15120C] shadow-[0_12px_30px_rgba(184,137,63,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
              >

                Présenter un projet

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

                <ArrowUpRight
                  size={16}
                />

              </Link>

            </div>

            <div className="mt-9 flex items-center justify-center gap-4">

              <span className="h-px w-10 bg-white/10" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/25">
                Installation · Structuration · Institutionnel · Développement
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