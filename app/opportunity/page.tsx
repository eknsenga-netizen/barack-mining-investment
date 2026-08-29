import type { Metadata } from 'next'
import OpportunityForm from './OpportunityForm'
export const dynamic = 'force-dynamic'

import PublicHeader from '../(public)/PublicHeader'

import {
  ArrowDown,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Opportunity Center | Barack Mining Investment',
  description:
    'Présentez votre opportunité : investissement, concession, minerais, projet minier ou partenariat stratégique.',
}

export default function OpportunityPage() {
  return (
    <main className="min-h-screen bg-[#F5F3EE] text-[#0A0C0B]">

      {/* =========================================================
          HEADER
      ========================================================= */}

      <PublicHeader />

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative isolate overflow-hidden bg-[#080A09] pt-[78px] text-white">

        {/* GOLD ATMOSPHERE */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(225,196,135,0.14),transparent_29%)]" />

        <div className="absolute -left-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-[#C69B52]/[0.07] blur-3xl" />

        <div className="absolute -bottom-40 -right-24 h-[32rem] w-[32rem] rounded-full bg-[#E1C487]/[0.07] blur-3xl" />

        {/* SUBTLE GRID / LIGHT */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">

          <div className="mx-auto max-w-4xl text-center">

            {/* EYEBROW */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#E1C487]/25 bg-[#E1C487]/[0.07] px-4 py-2 backdrop-blur-md">

              <span className="h-1.5 w-1.5 rounded-full bg-[#E1C487] shadow-[0_0_12px_rgba(225,196,135,0.70)]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#E1C487]">
                Opportunity Center
              </span>

            </div>

            {/* TITLE */}
            <h1 className="text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl md:text-6xl lg:text-7xl">

              Présentez votre{' '}

              <span className="bg-gradient-to-r from-[#F0D79F] via-[#D8B86D] to-[#B78A3C] bg-clip-text text-transparent">
                opportunité
              </span>

            </h1>

            {/* DESCRIPTION */}
            <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
              Parcours structuré pour présenter votre opportunité avec les
              informations essentielles à son analyse.
            </p>

            {/* META PILLS */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">

              {/* PROJET */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 backdrop-blur-md transition-colors duration-300 hover:border-[#E1C487]/25">

                <Target
                  size={14}
                  className="text-[#E1C487]"
                  strokeWidth={1.7}
                />

                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Projet
                </span>

              </div>

              {/* OPPORTUNITÉ */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 backdrop-blur-md transition-colors duration-300 hover:border-[#E1C487]/25">

                <Sparkles
                  size={14}
                  className="text-[#E1C487]"
                  strokeWidth={1.7}
                />

                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Opportunité
                </span>

              </div>

              {/* PARTENARIAT */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 backdrop-blur-md transition-colors duration-300 hover:border-[#E1C487]/25">

                <ShieldCheck
                  size={14}
                  className="text-[#E1C487]"
                  strokeWidth={1.7}
                />

                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Partenariat
                </span>

              </div>

            </div>

            {/* BRAND SIGNATURE */}
            <div className="mx-auto mt-10 flex items-center justify-center gap-5">

              <div className="h-px w-14 bg-white/15" />

              <div className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/25">
                Barack Mining Investment
              </div>

              <div className="h-px w-14 bg-white/15" />

            </div>

          </div>
        </div>

        {/* GOLD EDGE */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E1C487]/65 to-transparent" />

      </section>

      {/* =========================================================
          FORM SECTION
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#F5F3EE] py-16 sm:py-20 lg:py-24">

        {/* AMBIENT BACKGROUND */}
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-[#C69B52]/[0.05] blur-3xl" />

        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#E1C487]/[0.07] blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">

          <div className="grid items-start gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-10">

            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <aside className="lg:sticky lg:top-28">

              <div className="rounded-[30px] border border-stone-200 bg-[#FBFAF7] p-7 shadow-[0_18px_55px_rgba(15,23,42,0.05)] sm:p-8">

                {/* HEADING */}
                <div className="flex items-center gap-3">

                  <span className="h-px w-8 bg-gradient-to-r from-[#B8873F] to-[#E1C487]" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9B793E]">
                    Votre démarche
                  </p>

                </div>

                <h2 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl">

                  Une opportunité

                  <br />

                  <span className="bg-gradient-to-r from-[#B8873F] via-[#D1AB60] to-[#9B7334] bg-clip-text text-transparent">
                    mérite un cadre clair.
                  </span>

                </h2>

                <p className="mt-6 text-sm leading-7 text-stone-500">
                  Présentez les informations essentielles de votre opportunité
                  afin de permettre une première compréhension de votre projet.
                </p>

                {/* PROCESS */}
                <div className="mt-9 space-y-5">

                  {/* STEP 01 */}
                  <div className="flex gap-4">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0A0C0B] text-[10px] font-bold text-[#E1C487]">
                      01
                    </div>

                    <div>

                      <p className="text-sm font-semibold text-[#0A0C0B]">
                        Présentez votre profil
                      </p>

                      <p className="mt-1 text-xs leading-5 text-stone-400">
                        Identifiez la nature de votre opportunité.
                      </p>

                    </div>
                  </div>

                  <div className="ml-4 h-5 w-px bg-stone-200" />

                  {/* STEP 02 */}
                  <div className="flex gap-4">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F2EAD9] text-[10px] font-bold text-[#9B793E]">
                      02
                    </div>

                    <div>

                      <p className="text-sm font-semibold text-[#0A0C0B]">
                        Décrivez votre opportunité
                      </p>

                      <p className="mt-1 text-xs leading-5 text-stone-400">
                        Partagez les éléments utiles à son évaluation.
                      </p>

                    </div>
                  </div>

                  <div className="ml-4 h-5 w-px bg-stone-200" />

                  {/* STEP 03 */}
                  <div className="flex gap-4">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#B8873F] via-[#D7B66C] to-[#9D7230] text-[10px] font-bold text-[#14110B] shadow-[0_7px_18px_rgba(184,137,63,0.18)]">
                      03
                    </div>

                    <div>

                      <p className="text-sm font-semibold text-[#0A0C0B]">
                        Échangeons
                      </p>

                      <p className="mt-1 text-xs leading-5 text-stone-400">
                        Votre demande pourra être examinée dans son contexte.
                      </p>

                    </div>
                  </div>

                </div>

                {/* TRUST */}
                <div className="mt-9 rounded-2xl border border-stone-200 bg-white p-4">

                  <div className="flex items-start gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F2EAD9] text-[#9B793E]">

                      <ShieldCheck
                        size={17}
                        strokeWidth={1.7}
                      />

                    </div>

                    <div>

                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-stone-300">
                        Information
                      </p>

                      <p className="mt-1 text-xs leading-5 text-stone-500">
                        Présentez uniquement les informations pertinentes à
                        votre démarche.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </aside>

            {/* =====================================================
                FORMULAIRE
            ===================================================== */}

            <div>

              <div className="mb-5 flex items-center justify-between gap-5">

                <div>

                  <div className="flex items-center gap-3">

                    <span className="h-px w-8 bg-gradient-to-r from-[#B8873F] to-[#E1C487]" />

                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9B793E]">
                      Formulaire
                    </span>

                  </div>

                  <p className="mt-4 text-sm leading-6 text-stone-500">
                    Complétez les informations ci-dessous.
                  </p>

                </div>

                <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#D7B66C]/20 bg-white text-[#9B793E] sm:flex">

                  <ArrowDown
                    size={16}
                    strokeWidth={1.6}
                  />

                </div>

              </div>

              <div className="relative overflow-hidden rounded-[30px] border border-stone-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.07)]">

                {/* GOLD TOP LINE */}
                <div className="absolute inset-x-10 top-0 z-10 h-px bg-gradient-to-r from-transparent via-[#D7B66C]/70 to-transparent" />

                <div className="border-b border-stone-100 bg-[#FBFAF7] px-7 py-6 sm:px-9">

                  <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-stone-300">
                    Barack Mining Investment
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#0A0C0B]">
                    Présenter une opportunité
                  </h2>

                </div>

                <div className="px-7 py-8 sm:px-9 sm:py-10">

                  <OpportunityForm />

                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}

      <section className="bg-[#F5F3EE] pb-20 sm:pb-24">

        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">

          <div className="relative overflow-hidden rounded-[30px] border border-[#C69B52]/15 bg-[#0A0C0B] px-7 py-11 text-white sm:px-10 sm:py-14 lg:px-14">

            {/* GOLD ATMOSPHERE */}
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#D7B66C]/[0.08] blur-3xl" />

            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#B8873F]/[0.06] blur-3xl" />

            <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-[#E1C487]/35 to-transparent" />

            <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">

              <div className="max-w-2xl">

                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#E1C487]">
                  Barack Mining Investment
                </p>

                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                  Chaque opportunité commence par une conversation.
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/45">
                  Présentez votre projet avec les informations dont vous
                  disposez.
                </p>

              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#E1C487]/20 bg-white/[0.04]">

                <Target
                  size={18}
                  className="text-[#E1C487]"
                  strokeWidth={1.6}
                />

              </div>

            </div>

          </div>

        </div>
      </section>

    </main>
  )
}
