import type { Metadata } from 'next'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowUpRight,
} from 'lucide-react'

import ContactForm from './ContactForm'
import PublicHeader from '../(public)/PublicHeader'

export const metadata: Metadata = {
  title: 'Contact | Barack Mining Investment',
  description:
    'Contactez Barack Mining Investment pour toute question, opportunité ou partenariat.',
}

export default function ContactPage() {
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

        {/* SUBTLE GRID */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">

          <div className="max-w-4xl">

            {/* EYEBROW */}
            <div className="mb-7 flex items-center gap-3">

              <span className="h-px w-10 bg-gradient-to-r from-[#B8873F] to-[#E1C487]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#E1C487]">
                Entrons en contact
              </span>

            </div>

            {/* TITLE */}
            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl lg:text-7xl">

              Contactez-

              <span className="bg-gradient-to-r from-[#F0D79F] via-[#D8B86D] to-[#B78A3C] bg-clip-text text-transparent">
                nous
              </span>

            </h1>

            {/* DESCRIPTION */}
            <p className="mt-7 max-w-2xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
              Une question, une opportunité, un partenariat ? Nous sommes à
              votre écoute.
            </p>

            {/* META */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">

              <div className="flex items-center gap-2">

                <Mail
                  size={15}
                  className="text-[#E1C487]"
                  strokeWidth={1.7}
                />

                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Contact direct
                </span>

              </div>

              <span className="hidden h-3 w-px bg-white/15 sm:block" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
                Barack Mining Investment
              </span>

            </div>

          </div>
        </div>

        {/* GOLD EDGE */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E1C487]/65 to-transparent" />

      </section>

      {/* =========================================================
          CONTACT AREA
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#F5F3EE] py-20 sm:py-24 lg:py-28">

        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-[#C69B52]/[0.05] blur-3xl" />

        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#E1C487]/[0.07] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="grid items-start gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-10">

            {/* =====================================================
                INFORMATIONS
            ===================================================== */}

            <div className="lg:sticky lg:top-28">

              <div className="relative overflow-hidden rounded-[30px] border border-stone-200 bg-[#FBFAF7] p-7 shadow-[0_18px_55px_rgba(15,23,42,0.05)] sm:p-8">

                {/* GOLD TOP LINE */}
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#D7B66C]/55 to-transparent" />

                <div className="flex items-center gap-3">

                  <span className="h-px w-8 bg-gradient-to-r from-[#B8873F] to-[#E1C487]" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9B793E]">
                    Coordonnées
                  </p>

                </div>

                <h2 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl">

                  Restons en

                  <br />

                  <span className="bg-gradient-to-r from-[#B8873F] via-[#D1AB60] to-[#9B7334] bg-clip-text text-transparent">
                    contact.
                  </span>

                </h2>

                <p className="mt-6 max-w-md text-sm leading-7 text-stone-500">
                  N’hésitez pas à nous contacter pour toute question relative
                  à nos activités, opportunités ou partenariats.
                </p>

                {/* CONTACT CARDS */}
                <div className="mt-9 space-y-3">

                  {/* EMAIL */}
                  <a
                    href="mailto:Dg@barackminvest.com"
                    className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-stone-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C69B52]/30 hover:shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
                  >

                    <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#D7B66C]/0 to-transparent transition-all duration-300 group-hover:via-[#D7B66C]/45" />

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A0C0B] text-[#E1C487]">

                      <Mail
                        size={18}
                        strokeWidth={1.7}
                      />

                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-300">
                        Email
                      </p>

                      <p className="mt-1 truncate text-sm font-medium text-[#0A0C0B] transition-colors group-hover:text-[#9B7334]">
                        Dg@barackminvest.com
                      </p>

                    </div>

                    <ArrowUpRight
                      size={15}
                      className="mt-1 shrink-0 text-stone-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#B8873F]"
                    />

                  </a>

                  {/* TELEPHONE */}
                  <a
                    href="tel:+243994748517"
                    className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-stone-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C69B52]/30 hover:shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
                  >

                    <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#D7B66C]/0 to-transparent transition-all duration-300 group-hover:via-[#D7B66C]/45" />

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A0C0B] text-[#E1C487]">

                      <Phone
                        size={18}
                        strokeWidth={1.7}
                      />

                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-300">
                        Téléphone
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#0A0C0B] transition-colors group-hover:text-[#9B7334]">
                        +243 (0) 994 748 517
                      </p>

                    </div>

                    <ArrowUpRight
                      size={15}
                      className="mt-1 shrink-0 text-stone-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#B8873F]"
                    />

                  </a>

                  {/* ADRESSE */}
                  <div className="flex items-start gap-4 rounded-2xl border border-stone-200 bg-white p-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A0C0B] text-[#E1C487]">

                      <MapPin
                        size={18}
                        strokeWidth={1.7}
                      />

                    </div>

                    <div>

                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-300">
                        Adresse
                      </p>

                      <p className="mt-1 text-sm leading-6 text-stone-500">
                        Kolwezi, République Démocratique du Congo
                      </p>

                    </div>

                  </div>

                  {/* HORAIRES */}
                  <div className="flex items-start gap-4 rounded-2xl border border-stone-200 bg-white p-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F2EAD9] text-[#9B793E]">

                      <Clock
                        size={18}
                        strokeWidth={1.7}
                      />

                    </div>

                    <div>

                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-300">
                        Horaires
                      </p>

                      <p className="mt-1 text-sm leading-6 text-stone-500">
                        Lundi – Vendredi : 8h00 – 17h00
                        <br />

                        <span className="text-stone-400">
                          Heure de Kinshasa
                        </span>
                      </p>

                    </div>

                  </div>

                </div>

                {/* BOTTOM NOTE */}
                <div className="mt-7 border-t border-stone-200 pt-6">

                  <div className="flex items-start gap-3">

                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#B8873F] to-[#E1C487]" />

                    <p className="text-xs leading-6 text-stone-400">
                      Nous accordons une attention particulière aux demandes
                      liées aux opportunités, projets et partenariats.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* =====================================================
                FORMULAIRE
            ===================================================== */}

            <div>

              <div className="mb-5">

                <div className="flex items-center gap-3">

                  <span className="h-px w-8 bg-gradient-to-r from-[#B8873F] to-[#E1C487]" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9B793E]">
                    Envoyer un message
                  </span>

                </div>

              </div>

              <div className="relative overflow-hidden rounded-[30px] border border-stone-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.07)]">

                {/* GOLD TOP LINE */}
                <div className="absolute inset-x-10 top-0 z-10 h-px bg-gradient-to-r from-transparent via-[#D7B66C]/65 to-transparent" />

                <div className="border-b border-stone-100 bg-[#FBFAF7] px-7 py-6 sm:px-9">

                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-stone-300">
                    Barack Mining Investment
                  </p>

                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#0A0C0B] sm:text-2xl">
                    Parlons de votre projet
                  </h3>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-stone-500">
                    Présentez-nous votre demande et notre équipe pourra
                    l’examiner.
                  </p>

                </div>

                <div className="px-7 py-8 sm:px-9 sm:py-10">
                  <ContactForm />
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          BOTTOM CTA
      ========================================================= */}

      <section className="bg-[#F5F3EE] pb-20 sm:pb-24">

        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="relative overflow-hidden rounded-[30px] border border-[#C69B52]/15 bg-[#0A0C0B] px-7 py-11 text-white shadow-[0_30px_80px_rgba(10,12,11,0.10)] sm:px-10 sm:py-14 lg:px-14">

            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#D7B66C]/[0.08] blur-3xl" />

            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#B8873F]/[0.06] blur-3xl" />

            <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-[#E1C487]/35 to-transparent" />

            <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">

              <div className="max-w-2xl">

                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#E1C487]">
                  Barack Mining Investment
                </p>

                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                  Une question aujourd’hui peut devenir une opportunité demain.
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/45">
                  Notre équipe reste disponible pour échanger autour de vos
                  projets et de vos besoins.
                </p>

              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#E1C487]/20 bg-white/[0.04]">

                <ArrowUpRight
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