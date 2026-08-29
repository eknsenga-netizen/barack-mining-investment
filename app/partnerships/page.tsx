import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import PublicHeader from '../(public)/PublicHeader'

import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Factory,
  Handshake,
  Mountain,
  Pickaxe,
  ShieldCheck,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Partenariats | Barack Mining Investment',
  description:
    'Investisseurs, détenteurs d’actifs miniers, fournisseurs, entreprises minières et partenaires stratégiques : développons ensemble des opportunités structurées.',
}

/* =========================================================
   PROFILS
========================================================= */

const profiles = [
  {
    label: 'Je suis investisseur',
    description:
      'Explorer une opportunité d’investissement structurée et présenter vos objectifs.',
    slug: 'investor',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Je détiens un actif minier',
    description:
      'Présenter un actif, une concession ou une opportunité à étudier.',
    slug: 'concession',
    icon: Mountain,
  },
  {
    label: 'Je propose des minerais',
    description:
      'Présenter une ressource disponible et échanger autour d’une opportunité commerciale.',
    slug: 'supplier',
    icon: Pickaxe,
  },
  {
    label: 'Je représente une entreprise minière',
    description:
      'Échanger autour d’un projet, d’un besoin opérationnel ou d’une collaboration.',
    slug: 'company',
    icon: Factory,
  },
  {
    label: 'Je suis un partenaire stratégique',
    description:
      'Explorer une collaboration institutionnelle, technique ou commerciale.',
    slug: 'partner',
    icon: Handshake,
  },
]

/* =========================================================
   PARTENAIRES / INSTITUTIONS
========================================================= */

const partners = [
  {
    name: 'GÉCAMINES',
    shortName: 'Gécamines',
    logo: '/images/gecamines.png',
  },
  {
    name: 'ELDA',
    shortName: 'ELDA',
    logo: '/images/elda.png',
  },
  {
    name: 'RMC',
    shortName: 'RMC',
    logo: '/images/rmc.png',
  },
  {
    name: 'SAEMAPE',
    shortName: 'SAEMAPE',
    logo: '/images/saemape.png',
  },
  {
    name: 'CAMI',
    shortName: 'CAMI',
    logo: '/images/cami.png',
  },
  {
    name: 'MINISTÈRE DES MINES — RDC',
    shortName: 'Ministère des Mines — RDC',
    logo: '/images/ministere-mines-rdc.png',
  },
  {
    name: 'KCC',
    shortName: 'KCC',
    logo: '/images/kcc.png',
  },
]

export default function PartnershipsPage() {
  return (
    <main className="min-h-screen bg-[#F5F4F0] text-[#0A0C0B]">
      {/* =====================================================
          PUBLIC HEADER
      ===================================================== */}

      <PublicHeader />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative isolate min-h-[680px] overflow-hidden bg-[#080A09] pt-[78px] text-white">
        <Image
          src="/images/partnerships-hero.jpg"
          alt="Partenariat stratégique - Barack Mining Investment"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* IMAGE TREATMENT */}
        <div className="absolute inset-0 bg-[#080A09]/65" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#080A09]/95 via-[#080A09]/70 to-[#080A09]/30" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#080A09] via-[#080A09]/35 to-transparent" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_24%,rgba(208,167,101,0.17),transparent_30%)]" />

        {/* AMBIENT LIGHT */}
        <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[#B87333]/10 blur-3xl" />

        <div className="absolute -bottom-32 -right-24 h-[30rem] w-[30rem] rounded-full bg-[#D0A765]/10 blur-3xl" />

        {/* HERO CONTENT */}
        <div className="relative z-10 mx-auto flex min-h-[602px] w-full max-w-7xl items-center px-6 py-24 sm:px-8 lg:px-10">
          <div className="w-full">
            <div className="max-w-4xl">
              {/* EYEBROW */}
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#D0A765]/20 bg-[#D0A765]/[0.07] px-4 py-2 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D0A765] shadow-[0_0_10px_rgba(208,167,101,0.7)]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D0A765]">
                  Écosystème & collaborations
                </span>
              </div>

              {/* TITLE */}
              <h1 className="max-w-4xl text-4xl font-semibold leading-[1.01] tracking-[-0.055em] sm:text-5xl md:text-6xl lg:text-[72px]">
                Des partenariats
                <span className="text-[#D0A765]"> structurants.</span>
              </h1>

              {/* DESCRIPTION */}
              <p className="mt-7 max-w-2xl text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
                Barack Mining Investment développe des relations avec les
                investisseurs, détenteurs d’actifs, fournisseurs, entreprises,
                institutions et partenaires stratégiques autour d’opportunités
                concrètes.
              </p>

              {/* CTA */}
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/opportunity"
                  className="group inline-flex h-12 items-center justify-center gap-3 rounded-full bg-[#B87333] px-6 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(184,115,51,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#A7662D]"
                >
                  Présenter une opportunité

                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  href="#partenaires"
                  className="inline-flex h-12 items-center justify-center gap-3 rounded-full border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold text-white/80 backdrop-blur-md transition-all duration-300 hover:border-[#D0A765]/45 hover:text-[#D0A765]"
                >
                  Découvrir notre écosystème

                  <ArrowUpRight
                    size={15}
                    className="text-[#D0A765]"
                  />
                </Link>
              </div>

              {/* SIGNATURE */}
              <div className="mt-12 flex items-center gap-5">
                <div className="h-px w-14 bg-white/15" />

                <div className="relative h-10 w-10 shrink-0">
                  <Image
                    src="/images/logo-bmi.png"
                    alt="Barack Mining Investment"
                    fill
                    sizes="40px"
                    className="object-contain"
                  />
                </div>

                <div className="h-px w-14 bg-white/15" />
              </div>

              <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.28em] text-white/30">
                Barack Mining Investment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PARTENAIRES
      ===================================================== */}

      <section
        id="partenaires"
        className="relative overflow-hidden bg-[#D0A765] py-20 sm:py-24 lg:py-28"
      >
        {/* SUBTLE GOLD TEXTURE */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.20),transparent_25%),radial-gradient(circle_at_90%_75%,rgba(10,12,11,0.08),transparent_30%)]" />

        <div className="absolute inset-x-0 top-0 h-px bg-white/50" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-[#8F6E39]/25" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          {/* SECTION HEADING */}
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-[#0A0C0B]/15 bg-white/20 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.3em] text-[#0A0C0B]/70">
              Écosystème de référence
            </span>

            <h2 className="mt-5 text-3xl font-semibold leading-[1.05] tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl lg:text-5xl">
              Partenaires & institutions
              <span className="block text-[#6F542C]">
                de référence
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#0A0C0B]/65 sm:text-base">
              Un écosystème réunissant acteurs miniers, institutions et
              organisations intervenant dans la chaîne de valeur et
              l’environnement du secteur minier en République démocratique du
              Congo.
            </p>
          </div>

          {/* LOGOS */}
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="group relative flex min-h-[160px] flex-col items-center justify-between overflow-hidden rounded-[22px] border border-white/45 bg-[#F9F7F0] px-4 py-5 shadow-[0_15px_40px_rgba(73,51,17,0.10)] transition-all duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_22px_55px_rgba(73,51,17,0.16)]"
              >
                {/* GOLD TOP LINE */}
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#B87333]/55 to-transparent" />

                {/* LOGO AREA */}
                <div className="flex h-[90px] w-full items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={`Logo ${partner.name}`}
                    width={170}
                    height={90}
                    className="max-h-[76px] w-auto max-w-[150px] object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>

                {/* NAME */}
                <div className="mt-4 w-full border-t border-stone-200 pt-3 text-center">
                  <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#0A0C0B]/65">
                    {partner.shortName}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* BOTTOM STATEMENT */}
          <div className="mx-auto mt-12 flex max-w-4xl items-center justify-center gap-4 text-center">
            <span className="hidden h-px flex-1 bg-[#0A0C0B]/15 sm:block" />

            <p className="max-w-xl text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0A0C0B]/45">
              Une approche fondée sur la confiance, la responsabilité et la
              construction de relations durables.
            </p>

            <span className="hidden h-px flex-1 bg-[#0A0C0B]/15 sm:block" />
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#F5F4F0] py-24 sm:py-28 lg:py-32">
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-[#B87333]/5 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#D0A765]/6 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            {/* TEXT */}
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-9 bg-[#B87333]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A98B4F]">
                  Notre approche
                </p>
              </div>

              <h2 className="mt-5 max-w-2xl text-3xl font-semibold leading-[1.08] tracking-[-0.05em] sm:text-4xl lg:text-5xl">
                Les grandes opportunités commencent par les{' '}
                <span className="text-stone-400">
                  bonnes connexions.
                </span>
              </h2>

              <p className="mt-7 max-w-xl text-base leading-8 text-stone-600">
                Nous mettons en relation différents acteurs de l’écosystème
                autour d’opportunités concrètes, avec une approche structurée,
                professionnelle et orientée vers des collaborations durables.
              </p>

              {/* MINI CARDS */}
              <div className="mt-9 grid max-w-xl gap-3 sm:grid-cols-2">
                <div className="group rounded-2xl border border-stone-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D0A765]/45 hover:shadow-[0_16px_40px_rgba(184,115,51,0.07)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0A0C0B] text-[#D0A765]">
                      <Handshake size={17} strokeWidth={1.8} />
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-stone-300">
                        Relation
                      </p>

                      <p className="mt-0.5 text-sm font-semibold text-[#0A0C0B]">
                        Partenariat durable
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group rounded-2xl border border-[#D0A765]/20 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D0A765]/50 hover:shadow-[0_16px_40px_rgba(184,115,51,0.07)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3EFE8] text-[#A98B4F]">
                      <ShieldCheck size={17} strokeWidth={1.8} />
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-stone-300">
                        Approche
                      </p>

                      <p className="mt-0.5 text-sm font-semibold text-[#0A0C0B]">
                        Vision structurée
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* IMAGE */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-[32px] border border-[#D0A765]/20" />

              <div className="absolute -inset-1 rounded-[29px] border border-[#B87333]/10" />

              <div className="relative h-[360px] overflow-hidden rounded-[26px] bg-[#0A0C0B] shadow-[0_30px_80px_rgba(15,23,42,0.13)] sm:h-[450px] lg:h-[500px]">
                <Image
                  src="/images/partnerships-meeting.jpg"
                  alt="Réunion de partenaires de Barack Mining Investment"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/80 via-[#080A09]/15 to-transparent" />

                <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D0A765]/60 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-end justify-between gap-5">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/45">
                        Autour d’une même table
                      </p>

                      <p className="mt-1 text-lg font-medium tracking-[-0.02em] text-white">
                        Des intérêts alignés. Des projets communs.
                      </p>
                    </div>

                    <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D0A765]/25 bg-white/10 backdrop-blur-md sm:flex">
                      <ArrowUpRight
                        size={17}
                        className="text-[#D0A765]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PROFILS
      ===================================================== */}

      <section className="relative overflow-hidden border-y border-stone-200/70 bg-white py-24 sm:py-28 lg:py-32">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#D0A765]/5 blur-3xl" />

        <div className="absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-[#B87333]/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          {/* HEADING */}
          <div className="mb-14 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#B87333]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A98B4F]">
                Votre profil
              </span>
            </div>

            <h2 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl lg:text-5xl">
              Quelle place souhaitez-vous{' '}
              <span className="text-stone-400">
                occuper dans l’écosystème ?
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-stone-500">
              Choisissez le parcours qui correspond à votre activité, votre
              projet ou votre opportunité.
            </p>
          </div>

          {/* PROFILE GRID */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile, index) => {
              const Icon = profile.icon
              const isFeatured = index === 4

              return (
                <Link
                  key={profile.slug}
                  href={`/opportunity?profile=${profile.slug}`}
                  className={`group relative overflow-hidden rounded-[26px] border p-7 transition-all duration-500 sm:p-8 ${
                    isFeatured
                      ? 'border-[#D0A765]/45 bg-[#0A0C0B] text-white shadow-[0_24px_65px_rgba(10,12,11,0.14)] hover:-translate-y-1 hover:border-[#D0A765]/65'
                      : 'border-[#D0A765]/18 bg-[#FBFAF7] hover:-translate-y-1 hover:border-[#D0A765]/50 hover:bg-white hover:shadow-[0_22px_60px_rgba(184,115,51,0.09)]'
                  }`}
                >
                  {/* INNER FRAME */}
                  <div
                    className={`pointer-events-none absolute inset-2 rounded-[21px] border opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${
                      isFeatured
                        ? 'border-[#D0A765]/20'
                        : 'border-[#D0A765]/12'
                    }`}
                  />

                  {/* LIGHT */}
                  <div
                    className={`absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150 ${
                      isFeatured
                        ? 'bg-[#B87333]/15'
                        : 'bg-[#D0A765]/7'
                    }`}
                  />

                  {/* GOLD LINE */}
                  <div
                    className={`absolute left-7 right-7 top-0 h-px transition-opacity duration-500 ${
                      isFeatured
                        ? 'bg-gradient-to-r from-transparent via-[#D0A765]/70 to-transparent opacity-70'
                        : 'bg-gradient-to-r from-transparent via-[#D0A765]/45 to-transparent opacity-0 group-hover:opacity-100'
                    }`}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-105 ${
                          isFeatured
                            ? 'bg-[#B87333] text-white shadow-[0_10px_25px_rgba(184,115,51,0.18)]'
                            : 'bg-[#0A0C0B] text-[#D0A765]'
                        }`}
                      >
                        <Icon size={21} strokeWidth={1.8} />
                      </div>

                      <span
                        className={`text-[9px] font-bold tracking-[0.2em] ${
                          isFeatured
                            ? 'text-[#D0A765]/35'
                            : 'text-stone-300'
                        }`}
                      >
                        0{index + 1}
                      </span>
                    </div>

                    <div className="mt-9">
                      <h3
                        className={`text-xl font-semibold leading-tight tracking-[-0.03em] ${
                          isFeatured
                            ? 'text-white'
                            : 'text-[#0A0C0B]'
                        }`}
                      >
                        {profile.label}
                      </h3>

                      <p
                        className={`mt-4 text-sm leading-7 ${
                          isFeatured
                            ? 'text-white/55'
                            : 'text-stone-500'
                        }`}
                      >
                        {profile.description}
                      </p>

                      <div className="mt-7 flex items-center justify-between gap-4">
                        <span
                          className={`inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3 ${
                            isFeatured
                              ? 'text-[#D0A765]'
                              : 'text-[#A96F35]'
                          }`}
                        >
                          Commencer

                          <ArrowRight
                            size={15}
                            className="transition-transform duration-300 group-hover:translate-x-0.5"
                          />
                        </span>

                        <span
                          className={`h-px flex-1 transition-all duration-500 ${
                            isFeatured
                              ? 'bg-white/10 group-hover:bg-[#D0A765]/30'
                              : 'bg-stone-200 group-hover:bg-[#D0A765]/35'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="bg-[#F5F4F0] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="relative overflow-hidden rounded-[30px] border border-[#D0A765]/10 bg-[#0A0C0B] px-7 py-12 text-white shadow-[0_30px_80px_rgba(10,12,11,0.10)] sm:px-10 sm:py-14 lg:px-14">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#B87333]/10 blur-3xl" />

            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#D0A765]/5 blur-3xl" />

            <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-[#D0A765]/30 to-transparent" />

            <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#D0A765]">
                  Votre prochaine collaboration
                </p>

                <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.04em] sm:text-3xl">
                  Une opportunité, un projet ou un partenariat à construire ?
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/45">
                  Présentez votre besoin, votre projet ou votre opportunité
                  et accédez au parcours adapté à votre profil.
                </p>
              </div>

              <Link
                href="/opportunity"
                className="group inline-flex h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-[#B87333] px-6 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(184,115,51,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#A7662D] hover:shadow-[0_16px_35px_rgba(184,115,51,0.25)]"
              >
                Présenter une opportunité

                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}