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
  Map,
  Mountain,
  Pause,
  Pickaxe,
  Play,
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
   GALERIE — 6 IMAGES INTERNES
========================================================= */

const fieldImages = [
  {
    src: '/images/prospecting-field.png',
    eyebrow: 'Terrain',
    title: 'Reconnaissance du terrain',
    description:
      'Observation des caractéristiques du terrain et identification des zones présentant un intérêt pour la prospection.',
    alt: 'Équipe de prospection sur un terrain minier',
  },
  {
    src: '/images/prospecting-mapping.png',
    eyebrow: 'Cartographie',
    title: 'Lecture et cartographie du terrain',
    description:
      'Utilisation des données de terrain, du positionnement et des outils de cartographie pour structurer les observations.',
    alt: 'Géologue consultant une carte ou une tablette sur le terrain',
  },
  {
    src: '/images/prospecting-sampling.jpeg',
    eyebrow: 'Échantillonnage',
    title: 'Prélèvement des échantillons',
    description:
      'Prélèvement méthodique des matériaux nécessaires à l’étude et à la qualification des zones ciblées.',
    alt: 'Prélèvement de roche pendant une mission de prospection',
  },
  {
    src: '/images/prospecting-geology.png',
    eyebrow: 'Géologie',
    title: 'Observation des formations géologiques',
    description:
      'Analyse visuelle des affleurements, structures et caractéristiques géologiques observées sur le terrain.',
    alt: 'Structure rocheuse observée pendant une prospection géologique',
  },
  {
    src: '/images/prospecting-analysis.png',
    eyebrow: 'Analyse',
    title: 'Analyse des échantillons',
    description:
      'Organisation et observation des échantillons issus des campagnes de terrain avant leur interprétation.',
    alt: 'Échantillons géologiques préparés pour analyse',
  },
  {
    src: '/images/prospecting-team.jpg',
    eyebrow: 'Équipe',
    title: 'Coordination des équipes',
    description:
      'Travail collectif entre géologues et techniciens pour confronter les observations et orienter les prochaines étapes.',
    alt: 'Géologues et techniciens en discussion sur le terrain',
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
     PREVIOUS
  ========================================================= */

  const goPrevious = () => {
    setActiveImage((current) =>
      current === 0
        ? fieldImages.length - 1
        : current - 1
    )
  }

  /* =========================================================
     NEXT
  ========================================================= */

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

            <Reveal>

              <div>

                <SectionLabel>
                  Présentation
                </SectionLabel>

                <h2 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl lg:text-5xl">

                  La première étape

                  <br />

                  <span className="bg-gradient-to-r from-[#B8873F] via-[#D1AB60] to-[#9B7334] bg-clip-text text-transparent">
                    de tout projet minier
                  </span>

                </h2>

                <div className="mt-7 h-px w-20 bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-transparent" />

              </div>

            </Reveal>

            <Reveal delay={0.08}>

              <div>

                <p className="text-base leading-8 text-stone-600">
                  La prospection minière est l’étape fondamentale qui précède
                  toute exploitation. Elle consiste à rechercher, identifier
                  et évaluer les zones présentant un potentiel minéral
                  significatif.
                </p>

                <p className="mt-5 text-base leading-8 text-stone-600">
                  Chez{' '}
                  <strong className="font-semibold text-[#0A0C0B]">
                    Barack Mining Investment
                  </strong>
                  , nous combinons des méthodes traditionnelles et des
                  technologies modernes pour détecter les indices de
                  minéralisation et orienter les efforts d’exploration vers
                  les cibles les plus prometteuses.
                </p>

                <div className="relative mt-8 overflow-hidden rounded-[22px] border border-[#C69B52]/18 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:p-6">

                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D7B66C]/70 to-transparent" />

                  <div className="flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A0C0B] text-[#E1C487]">

                      <Compass
                        size={20}
                        strokeWidth={1.7}
                      />

                    </div>

                    <div>

                      <p className="text-[9px] font-bold uppercase tracking-[0.20em] text-[#9B793E]">
                        Objectif
                      </p>

                      <p className="mt-1 text-sm leading-6 text-stone-600">
                        Réduire les incertitudes et maximiser les chances de
                        découverte.
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
                  prospection
                </span>

              </h2>

              <p className="mt-5 text-base leading-7 text-stone-500">
                Nous intervenons sur l’ensemble du spectre de la prospection,
                de la recherche préliminaire à l’évaluation détaillée des
                cibles.
              </p>

            </div>

          </Reveal>

          {/* CARDS */}

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {[
              {
                icon: Map,
                title: 'Cartographie géologique',
                description:
                  'Analyse des structures géologiques, des formations rocheuses et des indices de surface.',
              },
              {
                icon: Pickaxe,
                title: 'Échantillonnage de terrain',
                description:
                  'Prélèvement et analyse d’échantillons de roches, de sols et de sédiments.',
              },
              {
                icon: Mountain,
                title: 'Interprétation des données',
                description:
                  'Traitement et synthèse des données géologiques, géochimiques et géophysiques.',
              },
              {
                icon: Compass,
                title: 'Ciblage des zones prioritaires',
                description:
                  'Définition des secteurs les plus prometteurs pour l’exploration détaillée.',
              },
              {
                icon: CheckCircle2,
                title: 'Évaluation du potentiel',
                description:
                  'Estimation préliminaire du potentiel minéral et des perspectives de développement.',
              },
              {
                icon: ArrowUpRight,
                title: 'Préparation des missions',
                description:
                  'Planification logistique, coordination des équipes et mise en œuvre des programmes.',
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
          GALERIE TERRAIN — 6 IMAGES QUI DÉFILENT
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#F5F3EE] py-20 sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#C69B52]/[0.05] blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#E1C487]/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          {/* HEADER */}

          <Reveal>

            <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

              <div className="max-w-3xl">

                <SectionLabel>
                  Sur le terrain
                </SectionLabel>

                <h2 className="mt-5 text-3xl font-semibold leading-[1.06] tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl lg:text-5xl">

                  Une expertise

                  <span className="bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] bg-clip-text text-transparent">
                    en mouvement.
                  </span>

                </h2>

              </div>

              <p className="max-w-sm text-sm leading-7 text-stone-500">
                Nos équipes observent, documentent et analysent les réalités
                du terrain pour mieux qualifier les opportunités.
              </p>

            </div>

          </Reveal>

          {/* CAROUSEL */}

          <Reveal delay={0.08}>

            <div
              className="group relative"
              onMouseEnter={() =>
                setIsPaused(true)
              }
              onMouseLeave={() =>
                setIsPaused(false)
              }
            >

              {/* FRAME */}

              <div className="absolute -inset-4 rounded-[34px] border border-[#C69B52]/10" />

              <div className="absolute -inset-1 rounded-[30px] border border-[#D7B66C]/15" />

              {/* MAIN IMAGE */}

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

                  {/* PAUSE BUTTON */}

                  <button
                    type="button"
                    onClick={() =>
                      setIsPaused(
                        (current) => !current
                      )
                    }
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

                  {/* TEXT */}

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

                {fieldImages.map(
                  (image, index) => (

                    <button
                      key={image.src}
                      type="button"
                      onClick={() =>
                        setActiveImage(index)
                      }
                      aria-label={`Afficher ${image.title}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === activeImage
                          ? 'w-10 bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230]'
                          : 'w-1.5 bg-[#C69B52]/25 hover:bg-[#C69B52]/55'
                      }`}
                    />

                  )
                )}

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

                  Une approche{' '}

                  <span className="bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] bg-clip-text text-transparent">
                    rigoureuse
                  </span>

                </h2>

                <p className="mt-6 max-w-xl text-base leading-8 text-stone-600">
                  Notre méthodologie s’appuie sur des standards reconnus et
                  une connaissance approfondie des contextes géologiques
                  locaux.
                </p>

                <div className="mt-9 space-y-5">

                  {[
                    'Analyse documentaire et synthèse des données existantes',
                    'Reconnaissance de terrain et cartographie préliminaire',
                    'Échantillonnage systématique et analyses en laboratoire',
                    'Modélisation et interprétation des résultats',
                    'Hiérarchisation et sélection des cibles prioritaires',
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

            {/* IMAGE METHODOLOGY */}

            <Reveal delay={0.1}>

              <div className="relative">

                <div className="absolute -inset-4 rounded-[34px] border border-[#C69B52]/12" />

                <div className="absolute -inset-1 rounded-[30px] border border-[#D7B66C]/15" />

                <div className="relative min-h-[400px] overflow-hidden rounded-[28px] bg-[#0A0C0B] shadow-[0_30px_80px_rgba(15,23,42,0.13)] sm:min-h-[470px]">

                  <Image
                    src="/images/prospecting-analysis.png"
                    alt="Analyse des échantillons de prospection"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.035]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/90 via-transparent to-transparent" />

                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D7B66C]/65 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#E1C487]/65">
                      Analyse
                    </p>

                    <p className="mt-2 text-base font-semibold tracking-[-0.02em] text-white sm:text-lg">
                      Qualification et interprétation des échantillons
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
          CTA
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#080A09] py-20 text-white sm:py-24">

        <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#B8873F]/[0.07] blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-[#D7B66C]/[0.07] blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 text-center sm:px-8">

          <Reveal>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#D7B66C]/25 bg-[#D7B66C]/[0.06]">

              <Compass
                size={23}
                className="text-[#E1C487]"
                strokeWidth={1.7}
              />

            </div>

            <p className="mt-7 text-[9px] font-bold uppercase tracking-[0.30em] text-[#E1C487]">
              Prospection minière
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Vous avez un projet de prospection ?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/45">
              Discutons de vos besoins et de la manière dont Barack Mining
              Investment peut vous accompagner dans l’identification et la
              qualification des opportunités.
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
                Expertise · Terrain · Résultats
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