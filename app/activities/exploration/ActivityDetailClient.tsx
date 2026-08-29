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
  CheckCircle2,
  Compass,
  Map,
  Microscope,
  Mountain,
  Pickaxe,
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

                  De la prospection

                  <br />

                  <span className="bg-gradient-to-r from-[#B8873F] via-[#D1AB60] to-[#9B7334] bg-clip-text text-transparent">
                    à la compréhension approfondie
                  </span>

                </h2>

                <div className="mt-7 h-px w-20 bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-transparent" />

              </div>

            </Reveal>

            {/* TEXTE */}

            <Reveal delay={0.08}>

              <div>

                <p className="text-base leading-8 text-stone-600">
                  L’exploration minière est une phase cruciale qui consiste à
                  approfondir les connaissances acquises lors de la prospection.
                  Elle permet de mieux caractériser les zones identifiées,
                  d’étudier les minéralisations et d’évaluer progressivement
                  leur potentiel.
                </p>

                <p className="mt-5 text-base leading-8 text-stone-600">
                  Chez{' '}
                  <strong className="font-semibold text-[#0A0C0B]">
                    Barack Mining Investment
                  </strong>
                  , nous structurons les travaux d’exploration autour
                  d’études géologiques, de campagnes de terrain,
                  d’échantillonnages ciblés et d’analyses techniques afin
                  d’améliorer la compréhension des ressources potentielles.
                </p>

                <div className="relative mt-8 overflow-hidden rounded-[22px] border border-[#C69B52]/18 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:p-6">

                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D7B66C]/70 to-transparent" />

                  <div className="flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A0C0B] text-[#E1C487]">

                      <Microscope
                        size={20}
                        strokeWidth={1.7}
                      />

                    </div>

                    <div>

                      <p className="text-[9px] font-bold uppercase tracking-[0.20em] text-[#9B793E]">
                        Objectif
                      </p>

                      <p className="mt-1 text-sm leading-6 text-stone-600">
                        Réduire progressivement les incertitudes techniques
                        et mieux qualifier le potentiel des zones étudiées.
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
                  exploration
                </span>

              </h2>

              <p className="mt-5 text-base leading-7 text-stone-500">
                Une approche progressive combinant travaux géologiques,
                observations de terrain, analyses et interprétation des
                données disponibles.
              </p>

            </div>

          </Reveal>

          {/* CARDS */}

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {[
              {
                icon: Map,
                title: 'Études géologiques avancées',
                description:
                  'Cartographie détaillée, lecture des structures et caractérisation des formations géologiques observées.',
              },
              {
                icon: Pickaxe,
                title: 'Échantillonnage approfondi',
                description:
                  'Prélèvement méthodique des matériaux nécessaires à la caractérisation et à l’analyse des zones étudiées.',
              },
              {
                icon: Microscope,
                title: 'Analyses géochimiques',
                description:
                  'Organisation et interprétation des analyses permettant de mieux identifier les signatures minérales.',
              },
              {
                icon: Mountain,
                title: 'Géophysique et télédétection',
                description:
                  'Mobilisation d’outils techniques pour compléter l’observation du terrain et améliorer la compréhension du sous-sol.',
              },
              {
                icon: CheckCircle2,
                title: 'Évaluation du potentiel',
                description:
                  'Qualification progressive des résultats et appréciation du potentiel des zones faisant l’objet des travaux.',
              },
              {
                icon: Compass,
                title: 'Développement progressif',
                description:
                  'Organisation des étapes suivantes en fonction des résultats obtenus et des priorités définies.',
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
          MÉTHODOLOGIE
      ========================================================= */}

      <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-[#D7B66C]/[0.05] blur-3xl" />

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
                    technique et structurée
                  </span>

                </h2>

                <p className="mt-6 max-w-xl text-base leading-8 text-stone-600">
                  Nos travaux d’exploration sont organisés de manière
                  progressive afin de transformer les informations de
                  terrain et les résultats analytiques en une compréhension
                  plus précise des zones étudiées.
                </p>

                <div className="mt-9 space-y-5">

                  {[
                    'Synthèse des données existantes et définition du programme',
                    'Reconnaissance détaillée du terrain et cartographie',
                    'Campagnes d’échantillonnage et analyses techniques',
                    'Interprétation croisée des résultats et des observations',
                    'Hiérarchisation des zones et définition des prochaines étapes',
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
                    src="/images/exploration-method.png"
                    alt="Travaux et méthodologie d'exploration minière"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.035]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/90 via-transparent to-transparent" />

                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D7B66C]/65 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#E1C487]/65">
                      Travaux d’exploration
                    </p>

                    <p className="mt-2 text-base font-semibold tracking-[-0.02em] text-white sm:text-lg">
                      Analyse, interprétation et qualification progressive
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
          PERSPECTIVE
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#F5F3EE] py-20 sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#C69B52]/[0.05] blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#E1C487]/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 text-center sm:px-8">

          <Reveal>

            <SectionLabel>
              Perspective
            </SectionLabel>

            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl">

              Construire une compréhension

              <span className="block bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] bg-clip-text text-transparent">
                plus solide du potentiel
              </span>

            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-stone-600">
              L’exploration permet de consolider progressivement les
              connaissances acquises sur une zone et d’orienter les décisions
              vers les étapes les plus pertinentes du développement du projet.
            </p>

            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#C69B52]/20 bg-white px-5 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">

              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A0C0B] text-[#E1C487]">

                <ArrowUpRight
                  size={15}
                  strokeWidth={1.7}
                />

              </span>

              <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#9B793E]">
                Des données vers une décision mieux éclairée
              </span>

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

              <Microscope
                size={23}
                className="text-[#E1C487]"
                strokeWidth={1.7}
              />

            </div>

            <p className="mt-7 text-[9px] font-bold uppercase tracking-[0.30em] text-[#E1C487]">
              Exploration minière
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Vous avez un projet d’exploration ?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/45">
              Échangeons sur votre projet, vos besoins et les informations
              disponibles afin d’envisager les prochaines étapes de manière
              structurée.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">

              <Link
                href="/opportunity?profile=concession"
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
                Exploration · Analyse · Progression
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
