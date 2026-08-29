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
  CircleDot,
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
    <div className="bg-[#F5F3EE] text-[#0A0C0B]">

      {/* =========================================================
          01 — INTRODUCTION / POSITIONNEMENT
      ========================================================= */}

      <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute -right-24 top-8 h-96 w-96 rounded-full bg-[#C69B52]/[0.05] blur-3xl" />

        <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[#E1C487]/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">

            {/* TITRE */}

            <Reveal>

              <div>

                <SectionLabel>
                  Positionnement
                </SectionLabel>

                <h2 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.05em] sm:text-4xl lg:text-5xl">

                  Relier les ressources

                  <br />

                  <span className="bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9B7334] bg-clip-text text-transparent">
                    aux opportunités
                  </span>

                </h2>

                <div className="mt-7 h-px w-20 bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-transparent" />

                <p className="mt-6 max-w-md text-sm leading-7 text-stone-500">
                  Une approche structurée de l’approvisionnement minéral,
                  conçue pour faciliter les échanges entre détenteurs de
                  ressources, fournisseurs et entreprises à la recherche
                  d’opportunités d’approvisionnement.
                </p>

              </div>

            </Reveal>

            {/* TEXTE */}

            <Reveal delay={0.08}>

              <div>

                <p className="text-base leading-8 text-stone-600">
                  L’approvisionnement minéral constitue un maillon important
                  de la chaîne de valeur. Il ne s’agit pas uniquement de
                  proposer une ressource, mais aussi de disposer des
                  informations nécessaires pour comprendre une opportunité,
                  identifier les interlocuteurs pertinents et structurer les
                  échanges.
                </p>

                <p className="mt-5 text-base leading-8 text-stone-600">
                  Chez{' '}
                  <strong className="font-semibold text-[#0A0C0B]">
                    Barack Mining Investment
                  </strong>
                  , nous facilitons la mise en relation et la coordination
                  autour d’opportunités d’approvisionnement, avec une attention
                  particulière portée aux informations disponibles, à la
                  traçabilité et au contexte commercial de chaque opération.
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
                        Faciliter une relation commerciale plus claire entre
                        l’offre disponible et les besoins identifiés.
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
          02 — MISE EN RELATION COMMERCIALE
      ========================================================= */}

      <section className="relative overflow-hidden border-y border-stone-200/70 bg-white py-20 sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[#D7B66C]/[0.045] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">

            {/* IMAGE */}

            <Reveal>

              <div className="relative">

                <div className="absolute -inset-4 rounded-[34px] border border-[#C69B52]/12" />

                <div className="absolute -inset-1 rounded-[30px] border border-[#D7B66C]/15" />

                <div className="relative min-h-[420px] overflow-hidden rounded-[28px] bg-[#0A0C0B] shadow-[0_30px_80px_rgba(15,23,42,0.13)] sm:min-h-[500px]">

                  <Image
                    src="/images/supply-commercial.jpg"
                    alt="Mise en relation commerciale autour d'une opportunité d'approvisionnement minéral"
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.035]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/90 via-[#080A09]/15 to-transparent" />

                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D7B66C]/65 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#E1C487]/70">
                      Mise en relation
                    </p>

                    <p className="mt-2 max-w-md text-lg font-semibold tracking-[-0.02em] text-white">
                      Structurer le dialogue entre fournisseurs et acheteurs
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
                  Mise en relation commerciale
                </SectionLabel>

                <h2 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.05em] sm:text-4xl lg:text-5xl">

                  Une relation

                  <br />

                  <span className="bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] bg-clip-text text-transparent">
                    mieux structurée
                  </span>

                </h2>

                <p className="mt-6 text-base leading-8 text-stone-600">
                  Une opportunité d’approvisionnement repose sur la qualité
                  des informations disponibles, la compréhension des besoins
                  et la capacité à mettre les bons interlocuteurs en relation.
                </p>

                <div className="mt-8 space-y-5">

                  {[
                    {
                      icon: Users,
                      title: 'Identification des interlocuteurs',
                      text: 'Mise en relation entre détenteurs de ressources, fournisseurs et entreprises à la recherche de solutions d’approvisionnement.',
                    },
                    {
                      icon: ClipboardCheck,
                      title: 'Qualification de l’opportunité',
                      text: 'Prise en compte des informations disponibles sur la ressource, le contexte du projet et les besoins exprimés.',
                    },
                    {
                      icon: Scale,
                      title: 'Cadre commercial',
                      text: 'Facilitation des échanges autour des conditions commerciales et des éléments utiles à l’appréciation de l’opportunité.',
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

                Une expertise autour

                <br />

                <span className="bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] bg-clip-text text-transparent">
                  de la chaîne d’approvisionnement
                </span>

              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-stone-500">
                De l’identification d’une opportunité à la coordination des
                flux, notre intervention accompagne les différentes étapes
                nécessaires à la structuration d’un approvisionnement.
              </p>

            </div>

          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {[
              {
                icon: Handshake,
                title: 'Mise en relation',
                description:
                  'Connexion entre fournisseurs, détenteurs de ressources et entreprises recherchant des opportunités d’approvisionnement.',
              },
              {
                icon: ClipboardCheck,
                title: 'Qualification',
                description:
                  'Collecte et structuration des informations disponibles afin de mieux apprécier l’opportunité présentée.',
              },
              {
                icon: Scale,
                title: 'Échanges commerciaux',
                description:
                  'Facilitation des discussions autour des besoins, volumes, conditions et éléments commerciaux disponibles.',
              },
              {
                icon: Truck,
                title: 'Logistique',
                description:
                  'Coordination des informations liées au transport, aux mouvements et à l’organisation des flux.',
              },
              {
                icon: Package,
                title: 'Suivi des ressources',
                description:
                  'Centralisation des informations associées aux ressources, aux chargements et aux étapes de leur acheminement.',
              },
              {
                icon: ShieldCheck,
                title: 'Traçabilité',
                description:
                  'Prise en compte des informations permettant de suivre l’origine et le parcours documenté d’une opportunité.',
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
          04 — RESSOURCES
      ========================================================= */}

      <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="grid items-center gap-12 lg:grid-cols-[0.84fr_1.16fr] lg:gap-16">

            {/* IMAGE */}

            <Reveal>

              <div className="relative">

                <div className="absolute -inset-4 rounded-[34px] border border-[#C69B52]/12" />

                <div className="relative min-h-[420px] overflow-hidden rounded-[28px] bg-[#0A0C0B] shadow-[0_30px_80px_rgba(15,23,42,0.12)] sm:min-h-[500px]">

                  <Image
                    src="/images/supply-resources.jpg"
                    alt="Ressources minérales suivies dans le cadre des opportunités d'approvisionnement"
                    fill
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.035]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/90 via-transparent to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#E1C487]/70">
                      Ressources
                    </p>

                    <p className="mt-2 text-lg font-semibold text-white">
                      Une sélection de ressources au cœur des opportunités
                    </p>

                    <div className="mt-4 h-px w-16 bg-gradient-to-r from-[#B8873F] to-transparent" />

                  </div>

                </div>

              </div>

            </Reveal>

            {/* TEXTE + RESSOURCES */}

            <Reveal delay={0.1}>

              <div>

                <SectionLabel>
                  Ressources minérales
                </SectionLabel>

                <h2 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.05em] sm:text-4xl lg:text-5xl">

                  Des ressources

                  <br />

                  <span className="bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] bg-clip-text text-transparent">
                    au cœur des échanges
                  </span>

                </h2>

                <p className="mt-6 text-base leading-8 text-stone-600">
                  Barack Mining Investment intervient autour d’opportunités
                  portant notamment sur certaines ressources critiques et
                  précieuses, selon les projets, les disponibilités et le
                  contexte commercial.
                </p>

                <div className="mt-9 grid gap-3 sm:grid-cols-2">

                  {[
                    {
                      name: 'Cuivre',
                      category: 'Minerai critique',
                      icon: CircleDot,
                    },
                    {
                      name: 'Cobalt',
                      category: 'Minerai critique',
                      icon: CircleDot,
                    },
                    {
                      name: 'Coltan',
                      category: 'Minerai critique',
                      icon: CircleDot,
                    },
                    {
                      name: 'Cassitérite',
                      category: 'Minerai critique',
                      icon: CircleDot,
                    },
                    {
                      name: 'Or',
                      category: 'Ressource précieuse',
                      icon: Sparkles,
                    },
                    {
                      name: 'Diamant',
                      category: 'Ressource précieuse',
                      icon: Diamond,
                    },
                  ].map((mineral, index) => {

                    const Icon = mineral.icon

                    return (
                      <div
                        key={mineral.name}
                        className="group flex items-center gap-4 rounded-[18px] border border-stone-200 bg-[#FBFAF7] p-4 transition-all duration-300 hover:border-[#D7B66C]/35 hover:bg-white hover:shadow-[0_12px_30px_rgba(15,23,42,0.045)]"
                      >

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C69B52]/15 bg-white text-[#B8873F] transition-colors duration-300 group-hover:border-[#D7B66C]/35 group-hover:bg-[#F7F1E4]">

                          <Icon
                            size={17}
                            strokeWidth={1.7}
                          />

                        </div>

                        <div className="min-w-0">

                          <div className="flex items-center gap-2">

                            <p className="text-sm font-semibold text-[#0A0C0B]">
                              {mineral.name}
                            </p>

                            <span className="text-[8px] font-bold tracking-[0.16em] text-stone-300">
                              {String(index + 1).padStart(2, '0')}
                            </span>

                          </div>

                          <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-stone-400">
                            {mineral.category}
                          </p>

                        </div>

                      </div>
                    )
                  })}

                </div>

                <div className="mt-8 flex items-start gap-3 border-t border-stone-200 pt-6">

                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-[#B8873F]"
                    strokeWidth={1.7}
                  />

                  <p className="text-sm leading-6 text-stone-500">
                    L’intervention de BMI dépend des opportunités présentées,
                    des informations disponibles et du contexte commercial
                    propre à chaque projet.
                  </p>

                </div>

              </div>

            </Reveal>

          </div>

        </div>
      </section>

      {/* =========================================================
          05 — LOGISTIQUE / FLUX
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#080A09] py-20 text-white sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#B8873F]/[0.08] blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#E1C487]/[0.07] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="grid items-center gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">

            {/* TEXTE */}

            <Reveal>

              <div>

                <SectionLabel>
                  Logistique & flux
                </SectionLabel>

                <h2 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.05em] sm:text-4xl lg:text-5xl">

                  Donner une meilleure visibilité

                  <br />

                  <span className="bg-gradient-to-r from-[#F0D79F] via-[#D7B66C] to-[#B8873F] bg-clip-text text-transparent">
                    aux mouvements
                  </span>

                </h2>

                <p className="mt-6 max-w-xl text-base leading-8 text-white/55">
                  Une opportunité d’approvisionnement implique également des
                  informations relatives aux mouvements, au transport et aux
                  différentes étapes du flux. Ces informations peuvent être
                  structurées afin de faciliter le suivi de l’opération.
                </p>

                <div className="mt-8 space-y-5">

                  {[
                    {
                      icon: Truck,
                      title: 'Coordination du transport',
                      text: 'Organisation des informations utiles aux mouvements et à l’acheminement des ressources.',
                    },
                    {
                      icon: MapPinned,
                      title: 'Suivi des étapes',
                      text: 'Visualisation structurée des différentes étapes du parcours lorsque les données sont disponibles.',
                    },
                    {
                      icon: Package,
                      title: 'Informations de chargement',
                      text: 'Association des informations disponibles au chargement et à son évolution dans la chaîne.',
                    },
                    {
                      icon: Route,
                      title: 'Continuité du flux',
                      text: 'Rapprochement des informations utiles afin de mieux comprendre le parcours d’une opportunité.',
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
                    src="/images/supply-logistics.jpg"
                    alt="Transport et logistique liés à l'approvisionnement minéral"
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.035]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/90 via-transparent to-transparent" />

                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D7B66C]/60 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D7B66C]/20 bg-[#0A0C0B]/75 text-[#E1C487] backdrop-blur-md">

                        <Truck
                          size={17}
                          strokeWidth={1.7}
                        />

                      </div>

                      <div>

                        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#E1C487]/70">
                          Flux logistiques
                        </p>

                        <p className="mt-1 text-sm font-medium text-white/80">
                          Transport · Chargement · Suivi
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
          06 — CHAÎNE D'APPROVISIONNEMENT
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#F5F3EE] py-20 sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[#D7B66C]/[0.05] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <Reveal>

            <div className="mx-auto max-w-3xl text-center">

              <SectionLabel>
                Chaîne d’approvisionnement
              </SectionLabel>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl lg:text-5xl">

                De l’opportunité

                <br />

                <span className="bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] bg-clip-text text-transparent">
                  au suivi du flux
                </span>

              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-stone-500">
                Une continuité d’informations destinée à mieux structurer les
                échanges et à suivre les différentes étapes disponibles.
              </p>

            </div>

          </Reveal>

          <Reveal delay={0.08}>

            <div className="relative mt-14">

              <div className="absolute left-[10%] right-[10%] top-9 hidden h-px bg-gradient-to-r from-[#B8873F]/15 via-[#D7B66C]/55 to-[#B8873F]/15 lg:block" />

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

                {[
                  {
                    icon: Package,
                    number: '01',
                    title: 'Ressource',
                    text: 'Identification de la ressource et des informations disponibles.',
                  },
                  {
                    icon: Users,
                    number: '02',
                    title: 'Interlocuteurs',
                    text: 'Mise en relation des parties concernées par l’opportunité.',
                  },
                  {
                    icon: ClipboardCheck,
                    number: '03',
                    title: 'Qualification',
                    text: 'Structuration des données utiles à l’appréciation du projet.',
                  },
                  {
                    icon: Truck,
                    number: '04',
                    title: 'Logistique',
                    text: 'Coordination des informations relatives au transport et aux flux.',
                  },
                  {
                    icon: ShieldCheck,
                    number: '05',
                    title: 'Traçabilité',
                    text: 'Suivi documenté des informations disponibles tout au long du parcours.',
                  },
                ].map((item) => {

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
          07 — TRAÇABILITÉ & MÉTHODOLOGIE
      ========================================================= */}

      <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-[#D7B66C]/[0.05] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">

            {/* TEXTE */}

            <Reveal>

              <div>

                <SectionLabel>
                  Traçabilité & méthodologie
                </SectionLabel>

                <h2 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.05em] sm:text-4xl lg:text-5xl">

                  Une démarche

                  <br />

                  <span className="bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] bg-clip-text text-transparent">
                    structurée et responsable
                  </span>

                </h2>

                <p className="mt-6 max-w-xl text-base leading-8 text-stone-600">
                  Chaque opportunité possède son propre contexte. Notre
                  démarche consiste donc à structurer les informations
                  disponibles, faciliter les échanges et assurer une meilleure
                  continuité dans le suivi.
                </p>

                <div className="mt-9 space-y-5">

                  {[
                    {
                      icon: FileCheck2,
                      title: 'Collecte des informations',
                      text: 'Réunir les éléments disponibles sur la ressource, le besoin ou le projet présenté.',
                    },
                    {
                      icon: ClipboardCheck,
                      title: 'Analyse de l’opportunité',
                      text: 'Examiner les informations disponibles avant d’organiser les échanges pertinents.',
                    },
                    {
                      icon: Handshake,
                      title: 'Mise en relation',
                      text: 'Faciliter les échanges entre les interlocuteurs concernés par l’opportunité.',
                    },
                    {
                      icon: Truck,
                      title: 'Coordination du flux',
                      text: 'Structurer les informations relatives au transport et aux différentes étapes du parcours.',
                    },
                    {
                      icon: ShieldCheck,
                      title: 'Suivi et traçabilité',
                      text: 'Conserver une information exploitable sur les étapes documentées de l’opération.',
                    },
                  ].map((item, index) => {

                    const Icon = item.icon

                    return (
                      <div
                        key={item.title}
                        className="group flex items-start gap-4"
                      >

                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C69B52]/25 bg-[#FBFAF7] text-[#9B793E]">

                          <span className="absolute inset-0 rounded-full border border-[#D7B66C]/0 transition-colors duration-300 group-hover:border-[#D7B66C]/45" />

                          <Icon
                            size={17}
                            strokeWidth={1.7}
                          />

                        </div>

                        <div className="pt-0.5">

                          <div className="flex items-center gap-3">

                            <p className="text-sm font-semibold text-[#0A0C0B]">
                              {item.title}
                            </p>

                            <span className="text-[8px] font-bold tracking-[0.15em] text-stone-300">
                              {String(index + 1).padStart(2, '0')}
                            </span>

                          </div>

                          <p className="mt-1 text-sm leading-6 text-stone-500">
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

            <Reveal delay={0.1}>

              <div className="relative">

                <div className="absolute -inset-4 rounded-[34px] border border-[#C69B52]/12" />

                <div className="absolute -inset-1 rounded-[30px] border border-[#D7B66C]/15" />

                <div className="relative min-h-[420px] overflow-hidden rounded-[28px] bg-[#0A0C0B] shadow-[0_30px_80px_rgba(15,23,42,0.13)] sm:min-h-[500px]">

                  <Image
                    src="/images/supply-method.jpg"
                    alt="Méthodologie et traçabilité de la chaîne d'approvisionnement minéral"
                    fill
                    sizes="(max-width: 1024px) 100vw, 52vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.035]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/90 via-transparent to-transparent" />

                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D7B66C]/65 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#E1C487]/65">
                      Traçabilité
                    </p>

                    <p className="mt-2 text-base font-semibold tracking-[-0.02em] text-white sm:text-lg">
                      Une information structurée à chaque étape documentée
                    </p>

                    <div className="mt-4 flex items-center gap-3">

                      <span className="h-px w-12 bg-gradient-to-r from-[#B8873F] to-transparent" />

                      <span className="text-[8px] uppercase tracking-[0.18em] text-white/35">
                        Information · Contrôle · Suivi
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </Reveal>

          </div>

        </div>
      </section>

      {/* =========================================================
          08 — INDICATEURS DE VALEUR
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#F5F3EE] py-16 sm:py-20">

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <Reveal>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {[
                {
                  icon: Handshake,
                  eyebrow: 'Relation',
                  title: 'Interlocuteurs connectés',
                  text: 'Faciliter les échanges entre les parties concernées.',
                },
                {
                  icon: ClipboardCheck,
                  eyebrow: 'Qualification',
                  title: 'Informations structurées',
                  text: 'Organiser les données utiles à l’appréciation d’une opportunité.',
                },
                {
                  icon: Truck,
                  eyebrow: 'Logistique',
                  title: 'Flux suivis',
                  text: 'Centraliser les informations disponibles sur les mouvements.',
                },
                {
                  icon: ShieldCheck,
                  eyebrow: 'Traçabilité',
                  title: 'Parcours documenté',
                  text: 'Conserver une continuité d’information lorsque les données sont disponibles.',
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

          </Reveal>

        </div>
      </section>

      {/* =========================================================
          09 — CTA FINAL
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
              Opportunité d’approvisionnement
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-[44px]">
              Vous avez une ressource à proposer ?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/45">
              Présentez votre opportunité d’approvisionnement et partagez
              les informations disponibles afin d’ouvrir une discussion
              autour de votre projet.
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

                <ArrowUpRight
                  size={16}
                />

              </Link>

            </div>

            <div className="mt-9 flex items-center justify-center gap-4">

              <span className="h-px w-10 bg-white/10" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/25">
                Ressources · Relation · Logistique · Traçabilité
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