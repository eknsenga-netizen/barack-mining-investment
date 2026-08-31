'use client'

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Compass,
  Database,
  FlaskConical,
  Map,
  Microscope,
  Mountain,
  Pause,
  Pickaxe,
  Play,
  ScanSearch,
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
   GALERIE TERRAIN
========================================================= */

const fieldImages = [
  {
    src: '/images/prospecting-field.png',
    eyebrow: 'Terrain',
    title: 'Reconnaissance du terrain',
    description:
      'Observation des caractéristiques du terrain et identification des secteurs présentant des indices susceptibles de révéler un potentiel minéral.',
    alt: 'Équipe de prospection sur un terrain minier',
  },
  {
    src: '/images/prospecting-mapping.png',
    eyebrow: 'Cartographie',
    title: 'Lecture et cartographie',
    description:
      'Organisation des observations géologiques, du positionnement et des données spatiales afin de mieux délimiter les zones d’intérêt.',
    alt: 'Géologue consultant une carte ou une tablette sur le terrain',
  },
  {
    src: '/images/prospecting-sampling.jpeg',
    eyebrow: 'Échantillonnage',
    title: 'Prélèvement des échantillons',
    description:
      'Collecte méthodique des matériaux nécessaires à l’étude et à la caractérisation progressive des zones ciblées.',
    alt: 'Prélèvement de roche pendant une mission de prospection',
  },
  {
    src: '/images/prospecting-geology.png',
    eyebrow: 'Géologie',
    title: 'Observation des formations',
    description:
      'Analyse des affleurements, structures et caractéristiques géologiques visibles afin de compléter la compréhension du terrain.',
    alt: 'Structure rocheuse observée pendant une prospection géologique',
  },
  {
    src: '/images/prospecting-analysis.png',
    eyebrow: 'Analyse',
    title: 'Analyse des échantillons',
    description:
      'Exploitation des résultats analytiques pour compléter les observations de terrain et mieux qualifier les signatures minérales.',
    alt: 'Échantillons géologiques préparés pour analyse',
  },
  {
    src: '/images/prospecting-team.jpg',
    eyebrow: 'Équipe',
    title: 'Coordination des travaux',
    description:
      'Confrontation des observations de terrain, des analyses et des données disponibles afin d’orienter les étapes suivantes.',
    alt: 'Géologues et techniciens en discussion sur le terrain',
  },
]

/* =========================================================
   PROCESSUS GLOBAL
========================================================= */

const processStages = [
  {
    number: '01',
    icon: Compass,
    phase: 'Prospection',
    title: 'Identification',
    text:
      'Repérer les indices, les structures et les zones susceptibles de présenter un potentiel minéral.',
  },
  {
    number: '02',
    icon: Map,
    phase: 'Prospection',
    title: 'Cartographie',
    text:
      'Structurer les observations géologiques et spatiales pour mieux délimiter les secteurs d’intérêt.',
  },
  {
    number: '03',
    icon: Pickaxe,
    phase: 'Prospection',
    title: 'Premiers échantillons',
    text:
      'Collecter les matériaux nécessaires à la vérification et à la qualification initiale des indices.',
  },
  {
    number: '04',
    icon: Microscope,
    phase: 'Exploration',
    title: 'Acquisition approfondie',
    text:
      'Multiplier les observations, les mesures et les données disponibles sur les zones retenues.',
  },
  {
    number: '05',
    icon: FlaskConical,
    phase: 'Exploration',
    title: 'Caractérisation',
    text:
      'Croiser les informations géologiques, géochimiques et techniques pour mieux comprendre la minéralisation.',
  },
  {
    number: '06',
    icon: Database,
    phase: 'Exploration',
    title: 'Quantification progressive',
    text:
      'Consolider les données acquises afin d’apprécier progressivement l’étendue et le potentiel du gisement.',
  },
]

/* =========================================================
   DOMAINES D'INTERVENTION
========================================================= */

const interventionCards = [
  {
    icon: Compass,
    phase: 'Prospection',
    title: 'Identification des cibles',
    description:
      'Recherche et repérage des zones présentant des indices, structures ou caractéristiques susceptibles d’indiquer un potentiel gisement.',
  },
  {
    icon: Map,
    phase: 'Prospection',
    title: 'Cartographie géologique',
    description:
      'Lecture du terrain, observation des formations et organisation des données géologiques et spatiales disponibles.',
  },
  {
    icon: Pickaxe,
    phase: 'Prospection',
    title: 'Échantillonnage initial',
    description:
      'Prélèvement des matériaux nécessaires pour vérifier les indices observés et orienter les investigations.',
  },
  {
    icon: ScanSearch,
    phase: 'Exploration',
    title: 'Acquisition approfondie des données',
    description:
      'Poursuite des travaux sur les zones retenues afin d’obtenir des informations plus précises et plus nombreuses.',
  },
  {
    icon: Microscope,
    phase: 'Exploration',
    title: 'Analyses et caractérisation',
    description:
      'Croisement des observations, analyses géochimiques et autres informations techniques disponibles pour mieux caractériser la minéralisation.',
  },
  {
    icon: Database,
    phase: 'Exploration',
    title: 'Quantification progressive',
    description:
      'Consolidation des données recueillies afin de mieux apprécier l’étendue, la distribution et le potentiel du gisement.',
  },
]

/* =========================================================
   COMPONENT PRINCIPAL
========================================================= */

export default function ActivityDetailClient() {
  const [activeImage, setActiveImage] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  /* =========================================================
     AUTO PLAY
  ========================================================= */

  useEffect(() => {
    if (isPaused) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveImage((current) =>
        current === fieldImages.length - 1
          ? 0
          : current + 1
      )
    }, 4500)

    return () => {
      window.clearInterval(timer)
    }
  }, [isPaused])

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const goPrevious = () => {
    setActiveImage((current) =>
      current === 0
        ? fieldImages.length - 1
        : current - 1
    )
  }

  const goNext = () => {
    setActiveImage((current) =>
      current === fieldImages.length - 1
        ? 0
        : current + 1
    )
  }

  const currentImage = fieldImages[activeImage]

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

                  Identifier un potentiel

                  <br />

                  <span className="bg-gradient-to-r from-[#B8873F] via-[#D1AB60] to-[#9B7334] bg-clip-text text-transparent">
                    puis mieux le quantifier
                  </span>

                </h2>

                <div className="mt-7 h-px w-20 bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-transparent" />

              </div>

            </Reveal>

            {/* TEXTE */}

            <Reveal delay={0.08}>

              <div>

                <p className="text-base leading-8 text-stone-600">
                  La prospection et l’exploration relèvent d’un même cadre
                  d’intervention : celui de la recherche et de la connaissance
                  progressive du potentiel minéral. La prospection constitue
                  la phase d’identification, au cours de laquelle les indices
                  géologiques et les caractéristiques du terrain permettent de
                  repérer une zone susceptible de correspondre à un potentiel
                  gisement.
                </p>

                <p className="mt-5 text-base leading-8 text-stone-600">
                  L’exploration prolonge directement cette démarche. Une fois
                  les zones d’intérêt identifiées, les travaux sont approfondis
                  afin de recueillir davantage de données géologiques,
                  géochimiques et techniques. L’objectif est de mieux
                  caractériser la minéralisation, sa distribution et, à mesure
                  que les données se consolident, d’apprécier progressivement
                  son potentiel quantitatif.
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
                        Principe de progression
                      </p>

                      <p className="mt-1 text-sm leading-6 text-stone-600">
                        Passer d’un indice ou d’une cible identifiée à une
                        connaissance progressivement plus précise du potentiel
                        du gisement.
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
          PROCESSUS CONTINU
      ========================================================= */}

      <section className="relative overflow-hidden border-y border-stone-200/70 bg-white py-20 sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-[#D7B66C]/[0.05] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <Reveal>

            <div className="mx-auto max-w-3xl text-center">

              <SectionLabel>
                Un même processus
              </SectionLabel>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl lg:text-5xl">

                De l’identification

                <span className="bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] bg-clip-text text-transparent">
                  à la quantification
                </span>

              </h2>

              <p className="mt-5 text-base leading-7 text-stone-500">
                Prospection et exploration constituent deux niveaux
                successifs d’un même travail de connaissance du gisement :
                identifier d’abord, approfondir ensuite.
              </p>

            </div>

          </Reveal>

          <Reveal delay={0.08}>

            <div className="relative mt-14">

              {/* CONNECTEUR */}

              <div className="absolute left-[8%] right-[8%] top-9 hidden h-px bg-gradient-to-r from-[#B8873F]/20 via-[#D7B66C]/60 to-[#B8873F]/20 lg:block" />

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">

                {processStages.map((item) => {

                  const Icon = item.icon

                  return (
                    <div
                      key={item.number}
                      className="relative rounded-[22px] border border-stone-200 bg-[#FBFAF7] p-5 shadow-[0_12px_35px_rgba(15,23,42,0.04)]"
                    >

                      <div className="relative z-10 flex h-[68px] w-[68px] items-center justify-center rounded-full border border-[#C69B52]/25 bg-white">

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0A0C0B] text-[#E1C487]">

                          <Icon
                            size={18}
                            strokeWidth={1.8}
                          />

                        </div>

                      </div>

                      <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.20em] text-[#9B793E]">
                        {item.number}
                      </p>

                      <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#B8873F]/70">
                        {item.phase}
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
          DOMAINES D'INTERVENTION
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#F5F3EE] py-20 sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-[#D7B66C]/[0.05] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <Reveal>

            <div className="mx-auto max-w-3xl text-center">

              <SectionLabel>
                Domaines d’intervention
              </SectionLabel>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl">

                Une expertise répartie entre{' '}

                <span className="bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] bg-clip-text text-transparent">
                  prospection & exploration
                </span>

              </h2>

              <p className="mt-5 text-base leading-7 text-stone-500">
                Les interventions évoluent selon le niveau de connaissance
                atteint sur la zone étudiée, depuis l’identification des cibles
                jusqu’à la consolidation des données nécessaires à leur
                caractérisation.
              </p>

            </div>

          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {interventionCards.map((item, index) => {

              const Icon = item.icon

              const isExploration = item.phase === 'Exploration'

              return (
                <Reveal
                  key={item.title}
                  delay={index * 0.06}
                >

                  <div className="group relative h-full overflow-hidden rounded-[24px] border border-stone-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.04)] transition-all duration-500 hover:-translate-y-1 hover:border-[#C69B52]/35 hover:shadow-[0_24px_55px_rgba(184,137,63,0.09)] sm:p-7">

                    <div className="absolute left-7 right-7 top-0 h-px bg-gradient-to-r from-transparent via-[#D7B66C]/0 to-transparent transition-all duration-500 group-hover:via-[#D7B66C]/60" />

                    <div className="absolute -right-14 -top-14 h-32 w-32 rounded-full bg-[#D7B66C]/[0.07] blur-2xl transition-transform duration-700 group-hover:scale-150" />

                    <div className="relative">

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0A0C0B] text-[#E1C487] transition-transform duration-300 group-hover:scale-105">

                          <Icon
                            size={20}
                            strokeWidth={1.8}
                          />

                        </div>

                        <div className="text-right">

                          <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#9B793E]">
                            {item.phase}
                          </p>

                          <span className="mt-1 block text-[9px] font-bold tracking-[0.20em] text-stone-300">
                            {String(index + 1).padStart(2, '0')}
                          </span>

                        </div>

                      </div>

                      <h3 className="mt-6 text-lg font-semibold tracking-[-0.03em] text-[#0A0C0B]">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-stone-500">
                        {item.description}
                      </p>

                      <div className="mt-7 flex items-center gap-3">

                        <span className="h-px flex-1 bg-stone-200 transition-colors duration-300 group-hover:bg-[#D7B66C]/45" />

                        <span
                          className={`h-1.5 w-1.5 rounded-full transition-all duration-300 group-hover:scale-125 ${
                            isExploration
                              ? 'bg-[#B8873F]'
                              : 'bg-[#D7B66C]'
                          }`}
                        />

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
          GALERIE TERRAIN
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#F5F3EE] py-20 sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#C69B52]/[0.05] blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#E1C487]/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <Reveal>

            <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

              <div className="max-w-3xl">

                <SectionLabel>
                  Sur le terrain
                </SectionLabel>

                <h2 className="mt-5 text-3xl font-semibold leading-[1.06] tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl lg:text-5xl">

                  Observer,

                  <br />

                  <span className="bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] bg-clip-text text-transparent">
                    mesurer et comprendre.
                  </span>

                </h2>

              </div>

              <p className="max-w-sm text-sm leading-7 text-stone-500">
                Des travaux de terrain destinés à accumuler progressivement
                les informations nécessaires à la compréhension des zones
                identifiées.
              </p>

            </div>

          </Reveal>

          <Reveal delay={0.08}>

            <div
              className="group relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >

              <div className="absolute -inset-4 rounded-[34px] border border-[#C69B52]/10" />

              <div className="absolute -inset-1 rounded-[30px] border border-[#D7B66C]/15" />

              <div className="relative overflow-hidden rounded-[28px] bg-[#0A0C0B] shadow-[0_30px_85px_rgba(15,23,42,0.14)]">

                <div className="relative min-h-[430px] w-full overflow-hidden sm:min-h-[520px] lg:min-h-[590px]">

                  <motion.div
                    key={currentImage.src}
                    initial={{
                      opacity: 0,
                      scale: 1.025,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.75,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="absolute inset-0"
                  >

                    <Image
                      src={currentImage.src}
                      alt={currentImage.alt}
                      fill
                      priority={activeImage === 0}
                      sizes="(max-width: 1024px) 100vw, 90vw"
                      className="object-cover"
                    />

                  </motion.div>

                  {/* OVERLAYS */}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#050606]/92 via-[#050606]/20 to-transparent" />

                  <div className="absolute inset-0 bg-gradient-to-r from-[#050606]/30 via-transparent to-transparent" />

                  {/* GOLD ACCENT */}

                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D7B66C]/75 to-transparent" />

                  {/* PAUSE */}

                  <button
                    type="button"
                    onClick={() => setIsPaused((current) => !current)}
                    aria-label={
                      isPaused
                        ? 'Reprendre le défilement'
                        : 'Mettre le défilement en pause'
                    }
                    className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white/75 backdrop-blur-md transition-all duration-300 hover:border-[#E1C487]/45 hover:bg-black/35 hover:text-[#E1C487] sm:left-7 sm:top-7"
                  >

                    {isPaused ? (
                      <Play
                        size={14}
                        fill="currentColor"
                      />
                    ) : (
                      <Pause size={14} />
                    )}

                  </button>

                  {/* CONTROLS */}

                  <div className="absolute right-5 top-5 flex items-center gap-2 sm:right-7 sm:top-7">

                    <button
                      type="button"
                      onClick={goPrevious}
                      aria-label="Image précédente"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white/75 backdrop-blur-md transition-all duration-300 hover:border-[#E1C487]/45 hover:bg-black/35 hover:text-[#E1C487]"
                    >

                      <ArrowLeft
                        size={15}
                        strokeWidth={1.7}
                      />

                    </button>

                    <button
                      type="button"
                      onClick={goNext}
                      aria-label="Image suivante"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white/75 backdrop-blur-md transition-all duration-300 hover:border-[#E1C487]/45 hover:bg-black/35 hover:text-[#E1C487]"
                    >

                      <ArrowRight
                        size={15}
                        strokeWidth={1.7}
                      />

                    </button>

                  </div>

                  {/* CONTENT */}

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                      <div className="max-w-2xl">

                        <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#E1C487]/75">
                          {currentImage.eyebrow}
                        </p>

                        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl lg:text-4xl">
                          {currentImage.title}
                        </h3>

                        <p className="mt-3 max-w-xl text-sm leading-7 text-white/55">
                          {currentImage.description}
                        </p>

                      </div>

                      <div className="shrink-0 text-[9px] font-bold uppercase tracking-[0.20em] text-white/40">

                        <span className="text-[#E1C487]">
                          {String(activeImage + 1).padStart(2, '0')}
                        </span>

                        <span className="mx-2 text-white/15">
                          /
                        </span>

                        <span>
                          {String(fieldImages.length).padStart(2, '0')}
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* INDICATORS */}

              <div className="mt-5 flex items-center justify-center gap-2">

                {fieldImages.map((image, index) => (

                  <button
                    key={image.src}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`Afficher ${image.title}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === activeImage
                        ? 'w-10 bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230]'
                        : 'w-1.5 bg-[#C69B52]/25 hover:bg-[#C69B52]/55'
                    }`}
                  />

                ))}

              </div>

              <div className="mt-4 flex items-center justify-center gap-2">

                <span className="h-1.5 w-1.5 rounded-full bg-[#B8873F]" />

                <span className="text-[8px] font-semibold uppercase tracking-[0.24em] text-stone-400">
                  {isPaused
                    ? 'Défilement en pause'
                    : 'Galerie terrain automatique'}
                </span>

              </div>

            </div>

          </Reveal>

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

                  Une progression{' '}

                  <span className="bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] bg-clip-text text-transparent">
                    fondée sur les données
                  </span>

                </h2>

                <p className="mt-6 max-w-xl text-base leading-8 text-stone-600">
                  Le niveau d’investigation évolue avec la quantité et la
                  qualité des informations obtenues. Les données recueillies
                  au cours de la prospection servent ainsi de base aux travaux
                  d’exploration plus approfondis.
                </p>

                <div className="mt-9 space-y-5">

                  {[
                    {
                      phase: '01',
                      title: 'Données existantes',
                      text:
                        'Compilation des informations disponibles sur la zone, son contexte géologique et les indices connus.',
                    },
                    {
                      phase: '02',
                      title: 'Reconnaissance et cartographie',
                      text:
                        'Observation du terrain, cartographie et délimitation progressive des secteurs d’intérêt.',
                    },
                    {
                      phase: '03',
                      title: 'Échantillonnage et analyses',
                      text:
                        'Acquisition d’échantillons et exploitation des résultats analytiques disponibles.',
                    },
                    {
                      phase: '04',
                      title: 'Approfondissement',
                      text:
                        'Poursuite des investigations sur les cibles retenues et enrichissement de la base de données.',
                    },
                    {
                      phase: '05',
                      title: 'Caractérisation et quantification',
                      text:
                        'Croisement des informations acquises pour mieux apprécier les caractéristiques et le potentiel du gisement.',
                    },
                  ].map((item) => (

                    <div
                      key={item.phase}
                      className="group flex items-start gap-4"
                    >

                      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#C69B52]/30 bg-[#FBFAF7] text-[9px] font-bold text-[#9B793E]">

                        <span className="absolute inset-0 rounded-full border border-[#D7B66C]/0 transition-colors duration-300 group-hover:border-[#D7B66C]/40" />

                        {item.phase}

                      </div>

                      <div className="pt-0.5">

                        <p className="text-sm font-semibold text-[#0A0C0B]">
                          {item.title}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-stone-500">
                          {item.text}
                        </p>

                      </div>

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
                    alt="Travaux de prospection et d’exploration minière"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.035]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/90 via-transparent to-transparent" />

                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D7B66C]/65 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#E1C487]/65">
                      Acquisition & interprétation
                    </p>

                    <p className="mt-2 text-base font-semibold tracking-[-0.02em] text-white sm:text-lg">
                      Transformer les observations en données exploitables
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
              Finalité
            </SectionLabel>

            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl lg:text-5xl">

              Des indices initiaux

              <span className="block bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] bg-clip-text text-transparent">
                vers une connaissance plus solide
              </span>

            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-stone-600">
              L’objectif est de réduire progressivement les incertitudes :
              identifier les cibles, acquérir les informations nécessaires,
              approfondir les travaux et consolider les données permettant
              d’apprécier le potentiel du gisement.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">

              <div className="inline-flex items-center gap-3 rounded-full border border-[#C69B52]/20 bg-white px-5 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A0C0B] text-[#E1C487]">

                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.7}
                  />

                </span>

                <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#9B793E]">
                  Identification → caractérisation → quantification
                </span>

              </div>

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
              Prospection & Exploration
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Vous avez une zone ou un projet à étudier ?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/45">
              Échangeons sur les informations disponibles, les travaux déjà
              réalisés et les prochaines étapes possibles pour mieux
              caractériser le potentiel de votre projet.
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
                Terrain · Données · Caractérisation · Potentiel
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