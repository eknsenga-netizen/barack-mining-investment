'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  useForm,
  type FieldError,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import PublicHeader from '../(public)/PublicHeader'

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleCheck,
  FileText,
  Globe2,
  Handshake,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
} from 'lucide-react'

// ============================================================
// SCHÉMAS DE VALIDATION
// ============================================================

const baseSchema = z.object({
  profile: z.enum([
    'investor',
    'concession',
    'supplier',
    'company',
    'partner',
    'other',
  ]),
  firstName: z.string().min(1, 'Prénom requis'),
  lastName: z.string().min(1, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  country: z.string().min(1, 'Pays requis'),
  description: z.string().min(
    20,
    'Décrivez votre opportunité (minimum 20 caractères)'
  ),
  consent: z.boolean().refine(
    (value) => value === true,
    'Vous devez accepter'
  ),
})

const investorSchema = baseSchema.extend({
  investmentType: z.string().min(
    1,
    'Type d’investissement requis'
  ),
  budgetRange: z.string().optional(),
})

const concessionSchema = baseSchema.extend({
  mineralType: z.string().min(
    1,
    'Type de minerai requis'
  ),
  projectStatus: z.string().min(
    1,
    'Statut du projet requis'
  ),
})

const supplierSchema = baseSchema.extend({
  mineralType: z.string().min(
    1,
    'Type de minerai requis'
  ),
  quantity: z.string().optional(),
})

const companySchema = baseSchema.extend({
  companyName: z.string().min(
    1,
    'Nom de l’entreprise requis'
  ),
  supportType: z.string().min(
    1,
    'Type d’accompagnement requis'
  ),
})

const partnerSchema = baseSchema.extend({
  partnershipType: z.string().min(
    1,
    'Type de partenariat requis'
  ),
})

const otherSchema = baseSchema

// ============================================================
// TYPE GLOBAL DU FORMULAIRE
// ============================================================

type FormData = {
  profile:
    | 'investor'
    | 'concession'
    | 'supplier'
    | 'company'
    | 'partner'
    | 'other'

  firstName: string
  lastName: string
  email: string
  phone?: string
  country: string
  description: string
  consent: boolean

  investmentType?: string
  budgetRange?: string

  mineralType?: string
  projectStatus?: string
  quantity?: string

  companyName?: string
  supportType?: string

  partnershipType?: string
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

export default function OpportunityForm() {
  const searchParams = useSearchParams()

  const initialProfile = normalizeProfile(
    searchParams.get('profile')
  )

  const [step, setStep] = useState(1)

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const [isSuccess, setIsSuccess] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const [profile, setProfile] =
    useState<FormData['profile']>(initialProfile)

  // ==========================================================
  // SCHÉMA DYNAMIQUE
  // ==========================================================

  const getSchema = () => {
    switch (profile) {
      case 'investor':
        return investorSchema

      case 'concession':
        return concessionSchema

      case 'supplier':
        return supplierSchema

      case 'company':
        return companySchema

      case 'partner':
        return partnerSchema

      default:
        return otherSchema
    }
  }

  // ==========================================================
  // REACT HOOK FORM
  // ==========================================================

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(getSchema()) as any,

    defaultValues: {
      profile: initialProfile,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      description: '',
      consent: false,

      investmentType: '',
      budgetRange: '',

      mineralType: '',
      projectStatus: '',
      quantity: '',

      companyName: '',
      supportType: '',

      partnershipType: '',
    },
  })

  const watchedProfile = watch('profile')

  useEffect(() => {
    setProfile(
      watchedProfile || initialProfile
    )
  }, [watchedProfile, initialProfile])

  // ==========================================================
  // ÉTAPES
  // ==========================================================

  const steps = [
    {
      id: 1,
      label: 'Profil',
      description: 'Votre situation',
    },
    {
      id: 2,
      label: 'Besoin',
      description: 'Votre opportunité',
    },
    {
      id: 3,
      label: 'Description',
      description: 'Votre projet',
    },
    {
      id: 4,
      label: 'Coordonnées',
      description: 'Vos informations',
    },
    {
      id: 5,
      label: 'Confirmation',
      description: 'Validation',
    },
  ]

  const getProfileFields =
    (): Array<keyof FormData> => {
      switch (profile) {
        case 'investor':
          return [
            'investmentType',
            'budgetRange',
          ]

        case 'concession':
          return [
            'mineralType',
            'projectStatus',
          ]

        case 'supplier':
          return [
            'mineralType',
            'quantity',
          ]

        case 'company':
          return [
            'companyName',
            'supportType',
          ]

        case 'partner':
          return [
            'partnershipType',
          ]

        default:
          return []
      }
    }

  const getStepFields =
    (
      currentStep: number
    ): Array<keyof FormData> => {
      switch (currentStep) {
        case 1:
          return ['profile']

        case 2:
          return getProfileFields()

        case 3:
          return ['description']

        case 4:
          return [
            'firstName',
            'lastName',
            'email',
            'phone',
            'country',
          ]

        case 5:
          return ['consent']

        default:
          return []
      }
    }

  const goToNext = async () => {
    const fields = getStepFields(step)

    const isValid = await trigger(fields)

    if (!isValid) {
      return
    }

    setStep(
      Math.min(step + 1, 5)
    )

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const goToPrev = () => {
    setStep(
      Math.max(step - 1, 1)
    )

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // ==========================================================
  // PROFILS
  // ==========================================================

  const profileOptions = [
    {
      value: 'investor' as const,
      label: 'Investisseur',
      description:
        'Je recherche une opportunité d’investissement.',
      icon: '💰',
    },
    {
      value: 'concession' as const,
      label: 'Détenteur de concession',
      description:
        'Je possède un actif ou une opportunité minière.',
      icon: '⛏️',
    },
    {
      value: 'supplier' as const,
      label: 'Fournisseur de minerais',
      description:
        'Je propose une ressource ou un volume.',
      icon: '📦',
    },
    {
      value: 'company' as const,
      label: 'Entreprise minière',
      description:
        'Je représente une entreprise ou un projet.',
      icon: '🏭',
    },
    {
      value: 'partner' as const,
      label: 'Partenaire stratégique',
      description:
        'Je souhaite explorer une collaboration.',
      icon: '🤝',
    },
    {
      value: 'other' as const,
      label: 'Autre',
      description:
        'Ma demande ne correspond pas aux profils proposés.',
      icon: '✦',
    },
  ]

  // ==========================================================
  // SOUMISSION
  // ==========================================================

  const onSubmit = async (
    data: FormData
  ) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch(
        '/api/opportunities',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      )

      if (!res.ok) {
        const err = await safeJson(res)

        throw new Error(
          err?.message ||
            'Erreur lors de l’envoi'
        )
      }

      setIsSuccess(true)
      reset()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // ==========================================================
  // SUCCÈS
  // ==========================================================

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-[#F5F3EE] text-[#0A0C0B]">
        <PublicHeader />

        <div className="mx-auto max-w-5xl px-6 pb-16 pt-[120px] sm:px-8 lg:px-10">
          <div className="overflow-hidden rounded-[30px] border border-stone-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.08)]">

            <div className="relative overflow-hidden bg-[#0A0C0B] px-7 py-14 text-center text-white sm:px-10 sm:py-16">

              <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[#C69B52]/[0.08] blur-3xl" />

              <div className="absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-[#E1C487]/[0.07] blur-3xl" />

              <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-[#E1C487]/45 to-transparent" />

              <div className="relative">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#E1C487]/20 bg-[#E1C487]/[0.08] text-[#E1C487]">
                  <CheckCircle2
                    size={38}
                    strokeWidth={1.6}
                  />
                </div>

                <p className="mt-7 text-[9px] font-bold uppercase tracking-[0.28em] text-[#E1C487]">
                  Demande reçue
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                  Opportunité envoyée
                  <br />
                  avec succès
                </h2>

                <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/55">
                  Votre demande a bien été reçue.
                  Notre équipe l’examinera et vous
                  recontactera dans les plus brefs délais.
                </p>

                <div className="mx-auto mt-8 max-w-md rounded-2xl border border-[#E1C487]/10 bg-white/[0.04] px-5 py-4">

                  <p className="text-xs leading-6 text-white/45">
                    Un numéro de référence vous sera
                    communiqué par email.
                  </p>

                </div>

              </div>
            </div>

            <div className="flex items-center justify-center gap-3 bg-[#FBFAF7] px-7 py-5">

              <ShieldCheck
                size={15}
                className="text-[#9B793E]"
              />

              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-400">
                Barack Mining Investment
              </span>

            </div>

          </div>
        </div>
      </main>
    )
  }

  // ==========================================================
  // VARIABLES UI
  // ==========================================================

  const progress =
    ((step - 1) /
      (steps.length - 1)) *
    100

  // ==========================================================
  // RENDU
  // ==========================================================

  return (
    <main className="min-h-screen bg-[#F5F3EE] text-[#0A0C0B]">

      {/* ======================================================
          HEADER GLOBAL
      ====================================================== */}

      <PublicHeader />

      {/* ======================================================
          FORMULAIRE
      ====================================================== */}

      <div className="mx-auto max-w-5xl px-5 pb-16 pt-[108px] sm:px-8 sm:pt-[118px] lg:px-10">

        <div className="overflow-hidden rounded-[30px] border border-stone-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.07)]">

          {/* ====================================================
              HEADER DU FORMULAIRE
          ==================================================== */}

          <div className="border-b border-stone-100 bg-[#FBFAF7] px-6 py-6 sm:px-9">

            <div className="flex items-start justify-between gap-5">

              <div>

                <div className="flex items-center gap-3">

                  <span className="h-px w-7 bg-gradient-to-r from-[#B8873F] to-[#E1C487]" />

                  <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#9B793E]">
                    Parcours d’opportunité
                  </span>

                </div>

                <h2 className="mt-3 text-xl font-semibold tracking-[-0.035em] text-[#0A0C0B] sm:text-2xl">
                  {steps[step - 1].label}
                </h2>

                <p className="mt-1 text-xs text-stone-400">
                  {steps[step - 1].description}
                </p>

              </div>

              <div className="hidden h-11 w-11 items-center justify-center rounded-xl border border-[#D7B66C]/20 bg-white text-[#9B793E] sm:flex">

                {step === 1 && (
                  <UserRound size={18} />
                )}

                {step === 2 && (
                  <Target size={18} />
                )}

                {step === 3 && (
                  <FileText size={18} />
                )}

                {step === 4 && (
                  <Mail size={18} />
                )}

                {step === 5 && (
                  <CircleCheck size={18} />
                )}

              </div>

            </div>

            {/* PROGRESSION */}
            <div className="mt-7">

              <div className="flex items-center">

                {steps.map(
                  (currentStep, index) => (
                    <div
                      key={currentStep.id}
                      className="flex min-w-0 flex-1 items-center"
                    >

                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300 ${
                          currentStep.id < step
                            ? 'bg-[#0A0C0B] text-[#E1C487]'
                            : currentStep.id === step
                              ? 'bg-gradient-to-br from-[#B8873F] via-[#D7B66C] to-[#9D7230] text-[#15120C] shadow-[0_6px_16px_rgba(184,137,63,0.22)]'
                              : 'bg-stone-200 text-stone-400'
                        }`}
                      >

                        {currentStep.id < step ? (
                          <Check size={14} />
                        ) : (
                          currentStep.id
                        )}

                      </div>

                      {index <
                        steps.length - 1 && (
                        <div
                          className={`mx-1.5 h-px flex-1 transition-colors duration-300 ${
                            currentStep.id < step
                              ? 'bg-gradient-to-r from-[#B8873F] to-[#D7B66C]'
                              : 'bg-stone-200'
                          }`}
                        />
                      )}

                    </div>
                  )
                )}

              </div>

              <div className="mt-3 h-1 overflow-hidden rounded-full bg-stone-200">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

              <div className="mt-2 flex justify-between">

                <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-stone-300">
                  Étape {step} sur 5
                </span>

                <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9B793E]">
                  {Math.round(progress)}%
                </span>

              </div>

            </div>

          </div>

          {/* ======================================================
              FORMULAIRE
          ====================================================== */}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-6 py-8 sm:px-9 sm:py-10"
          >

            {/* ==================================================
                ÉTAPE 1
            ================================================== */}

            {step === 1 && (
              <div className="space-y-8">

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#9B793E]">
                    Étape 01
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#0A0C0B]">
                    Qui êtes-vous ?
                  </h3>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-stone-500">
                    Sélectionnez le profil qui correspond
                    le mieux à votre situation.
                  </p>

                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                  {profileOptions.map(
                    (option) => {
                      const active =
                        watchedProfile ===
                        option.value

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setValue(
                              'profile',
                              option.value,
                              {
                                shouldValidate: true,
                              }
                            )

                            setProfile(
                              option.value
                            )
                          }}
                          className={`group relative overflow-hidden rounded-[20px] border p-5 text-left transition-all duration-300 ${
                            active
                              ? 'border-[#C69B52] bg-[#FBF7F1] shadow-[0_12px_30px_rgba(184,115,51,0.08)]'
                              : 'border-stone-200 bg-white hover:-translate-y-0.5 hover:border-[#D7B66C]/35 hover:shadow-[0_12px_25px_rgba(15,23,42,0.05)]'
                          }`}
                        >

                          {active && (
                            <>
                              <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#D7B66C] to-transparent" />

                              <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#B8873F] to-[#9D7230] text-[#11100B]">
                                <Check size={13} />
                              </div>
                            </>
                          )}

                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl transition-transform duration-300 group-hover:scale-105 ${
                              active
                                ? 'bg-[#0A0C0B]'
                                : 'bg-[#F5F4F0]'
                            }`}
                          >
                            <span>
                              {option.icon}
                            </span>
                          </div>

                          <p className="mt-5 pr-5 text-sm font-semibold text-[#0A0C0B]">
                            {option.label}
                          </p>

                          <p className="mt-2 text-xs leading-5 text-stone-400">
                            {option.description}
                          </p>

                        </button>
                      )
                    }
                  )}

                </div>

                <FieldError
                  error={errors.profile}
                />

                <div className="flex justify-end border-t border-stone-100 pt-6">

                  <button
                    type="button"
                    onClick={goToNext}
                    className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#D7B66C]/40 bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] px-6 text-sm font-semibold text-[#15120C] shadow-[0_10px_25px_rgba(184,137,63,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
                  >
                    Continuer

                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />

                  </button>

                </div>

              </div>
            )}

            {/* ==================================================
                ÉTAPE 2
            ================================================== */}

            {step === 2 && (
              <div className="space-y-8">

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#9B793E]">
                    Étape 02
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#0A0C0B]">
                    Votre besoin
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-stone-500">
                    Répondez aux questions adaptées à votre profil.
                  </p>

                </div>

                <div className="space-y-5">

                  {profile === 'investor' && (
                    <>
                      <Field
                        label="Type d’investissement"
                        required
                      >
                        <select
                          {...register(
                            'investmentType'
                          )}
                          className="form-input"
                        >
                          <option value="">
                            Sélectionnez...
                          </option>
                          <option value="direct">
                            Investissement direct
                          </option>
                          <option value="partnership">
                            Partenariat financier
                          </option>
                          <option value="joint_venture">
                            Joint-venture
                          </option>
                          <option value="other">
                            Autre
                          </option>
                        </select>

                        <FieldError
                          error={
                            errors.investmentType
                          }
                        />
                      </Field>

                      <Field label="Budget indicatif">
                        <input
                          {...register(
                            'budgetRange'
                          )}
                          placeholder="ex : 500 000 USD - 2 M USD"
                          className="form-input"
                        />
                      </Field>
                    </>
                  )}

                  {profile === 'concession' && (
                    <>
                      <Field
                        label="Type de minerai"
                        required
                      >
                        <input
                          {...register(
                            'mineralType'
                          )}
                          placeholder="ex : Cuivre, Cobalt, Or..."
                          className="form-input"
                        />

                        <FieldError
                          error={
                            errors.mineralType
                          }
                        />
                      </Field>

                      <Field
                        label="Statut du projet"
                        required
                      >
                        <select
                          {...register(
                            'projectStatus'
                          )}
                          className="form-input"
                        >
                          <option value="">
                            Sélectionnez...
                          </option>
                          <option value="exploration">
                            Exploration
                          </option>
                          <option value="development">
                            Développement
                          </option>
                          <option value="production">
                            Production
                          </option>
                          <option value="closed">
                            Fermé
                          </option>
                        </select>

                        <FieldError
                          error={
                            errors.projectStatus
                          }
                        />
                      </Field>
                    </>
                  )}

                  {profile === 'supplier' && (
                    <>
                      <Field
                        label="Type de minerai"
                        required
                      >
                        <input
                          {...register(
                            'mineralType'
                          )}
                          placeholder="ex : Cuivre, Lithium, Cobalt..."
                          className="form-input"
                        />

                        <FieldError
                          error={
                            errors.mineralType
                          }
                        />
                      </Field>

                      <Field
                        label="Quantité / volume (indicatif)"
                      >
                        <input
                          {...register(
                            'quantity'
                          )}
                          placeholder="ex : 50 tonnes / mois"
                          className="form-input"
                        />
                      </Field>
                    </>
                  )}

                  {profile === 'company' && (
                    <>
                      <Field
                        label="Nom de l’entreprise"
                        required
                      >
                        <input
                          {...register(
                            'companyName'
                          )}
                          placeholder="ex : Mining Corp SARL"
                          className="form-input"
                        />

                        <FieldError
                          error={
                            errors.companyName
                          }
                        />
                      </Field>

                      <Field
                        label="Type d’accompagnement"
                        required
                      >
                        <select
                          {...register(
                            'supportType'
                          )}
                          className="form-input"
                        >
                          <option value="">
                            Sélectionnez...
                          </option>
                          <option value="operational">
                            Opérationnel
                          </option>
                          <option value="administrative">
                            Administratif
                          </option>
                          <option value="institutional">
                            Institutionnel
                          </option>
                          <option value="strategic">
                            Stratégique
                          </option>
                        </select>

                        <FieldError
                          error={
                            errors.supportType
                          }
                        />
                      </Field>
                    </>
                  )}

                  {profile === 'partner' && (
                    <Field
                      label="Type de partenariat"
                      required
                    >
                      <select
                        {...register(
                          'partnershipType'
                        )}
                        className="form-input"
                      >
                        <option value="">
                          Sélectionnez...
                        </option>
                        <option value="technical">
                          Technique
                        </option>
                        <option value="commercial">
                          Commercial
                        </option>
                        <option value="financial">
                          Financier
                        </option>
                        <option value="strategic">
                          Stratégique
                        </option>
                      </select>

                      <FieldError
                        error={
                          errors.partnershipType
                        }
                      />
                    </Field>
                  )}

                  {profile === 'other' && (
                    <div className="rounded-[22px] border border-stone-200 bg-[#FBFAF7] p-6">

                      <div className="flex items-start gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A0C0B] text-[#E1C487]">
                          <Sparkles size={18} />
                        </div>

                        <div>

                          <p className="text-sm font-semibold text-[#0A0C0B]">
                            Une demande particulière ?
                          </p>

                          <p className="mt-2 text-sm leading-6 text-stone-500">
                            Vous pourrez détailler votre besoin
                            à l’étape suivante.
                          </p>

                        </div>

                      </div>

                    </div>
                  )}

                </div>

                <NavigationButtons
                  onPrev={goToPrev}
                  onNext={goToNext}
                />

              </div>
            )}

            {/* ==================================================
                ÉTAPE 3
            ================================================== */}

            {step === 3 && (
              <div className="space-y-8">

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#9B793E]">
                    Étape 03
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#0A0C0B]">
                    Décrivez votre opportunité
                  </h3>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-stone-500">
                    Plus vous serez précis, plus nous pourrons
                    comprendre efficacement votre démarche.
                  </p>

                </div>

                <Field
                  label="Description"
                  required
                >
                  <textarea
                    {...register(
                      'description'
                    )}
                    rows={8}
                    placeholder="Décrivez votre projet, votre besoin, votre proposition..."
                    className="form-input min-h-[200px] resize-y py-4"
                  />

                  <div className="mt-2 flex items-center justify-between gap-4">

                    <FieldError
                      error={
                        errors.description
                      }
                    />

                    <span className="ml-auto text-[9px] font-semibold uppercase tracking-[0.15em] text-stone-300">
                      Minimum 20 caractères
                    </span>

                  </div>
                </Field>

                <div className="grid gap-3 sm:grid-cols-3">

                  <InfoMini
                    icon={
                      <FileText size={16} />
                    }
                    label="Clarté"
                    text="Présentez les éléments essentiels."
                  />

                  <InfoMini
                    icon={
                      <Globe2 size={16} />
                    }
                    label="Contexte"
                    text="Précisez le pays ou la zone concernée."
                  />

                  <InfoMini
                    icon={
                      <Target size={16} />
                    }
                    label="Objectif"
                    text="Expliquez ce que vous recherchez."
                  />

                </div>

                <NavigationButtons
                  onPrev={goToPrev}
                  onNext={goToNext}
                />

              </div>
            )}

            {/* ==================================================
                ÉTAPE 4
            ================================================== */}

            {step === 4 && (
              <div className="space-y-8">

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#9B793E]">
                    Étape 04
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#0A0C0B]">
                    Vos coordonnées
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-stone-500">
                    Nous pourrons ainsi vous recontacter au sujet de votre demande.
                  </p>

                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <Field
                    label="Prénom"
                    required
                  >
                    <div className="relative">

                      <UserRound
                        size={16}
                        className="field-icon"
                      />

                      <input
                        {...register(
                          'firstName'
                        )}
                        className="form-input pl-11"
                      />

                    </div>

                    <FieldError
                      error={
                        errors.firstName
                      }
                    />
                  </Field>

                  <Field
                    label="Nom"
                    required
                  >
                    <input
                      {...register(
                        'lastName'
                      )}
                      className="form-input"
                    />

                    <FieldError
                      error={
                        errors.lastName
                      }
                    />
                  </Field>

                  <Field
                    label="Email"
                    required
                  >
                    <div className="relative">

                      <Mail
                        size={16}
                        className="field-icon"
                      />

                      <input
                        {...register(
                          'email'
                        )}
                        type="email"
                        className="form-input pl-11"
                      />

                    </div>

                    <FieldError
                      error={
                        errors.email
                      }
                    />
                  </Field>

                  <Field label="Téléphone">
                    <div className="relative">

                      <Phone
                        size={16}
                        className="field-icon"
                      />

                      <input
                        {...register(
                          'phone'
                        )}
                        placeholder="+243 123 456 789"
                        className="form-input pl-11"
                      />

                    </div>
                  </Field>

                </div>

                <Field
                  label="Pays"
                  required
                >
                  <div className="relative">

                    <MapPin
                      size={16}
                      className="field-icon"
                    />

                    <input
                      {...register(
                        'country'
                      )}
                      placeholder="ex : République Démocratique du Congo"
                      className="form-input pl-11"
                    />

                  </div>

                  <FieldError
                    error={
                      errors.country
                    }
                  />
                </Field>

                <NavigationButtons
                  onPrev={goToPrev}
                  onNext={goToNext}
                />

              </div>
            )}

            {/* ==================================================
                ÉTAPE 5
            ================================================== */}

            {step === 5 && (
              <div className="space-y-8">

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#9B793E]">
                    Étape 05
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#0A0C0B]">
                    Confirmation
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-stone-500">
                    Vérifiez les informations essentielles avant
                    de soumettre votre demande.
                  </p>

                </div>

                {/* RÉSUMÉ */}
                <div className="overflow-hidden rounded-[22px] border border-stone-200">

                  <div className="border-b border-stone-100 bg-[#FBFAF7] px-5 py-4">

                    <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-stone-400">
                      Résumé de votre demande
                    </p>

                  </div>

                  <div className="grid gap-px bg-stone-100 sm:grid-cols-3">

                    <Summary
                      label="Profil"
                      value={
                        profileOptions.find(
                          (item) =>
                            item.value ===
                            profile
                        )?.label || '—'
                      }
                    />

                    <Summary
                      label="Email"
                      value={
                        watch('email') || '—'
                      }
                    />

                    <Summary
                      label="Pays"
                      value={
                        watch('country') ||
                        '—'
                      }
                    />

                  </div>

                </div>

                {/* CONSENTEMENT */}
                <label
                  className={`group flex cursor-pointer items-start gap-4 rounded-[22px] border p-5 transition-all duration-300 ${
                    errors.consent
                      ? 'border-red-200 bg-red-50'
                      : 'border-stone-200 bg-[#FBFAF7] hover:border-[#C69B52]/30'
                  }`}
                >

                  <div className="relative mt-0.5 shrink-0">

                    <input
                      type="checkbox"
                      {...register('consent')}
                      className="peer sr-only"
                    />

                    <div className="flex h-5 w-5 items-center justify-center rounded-md border border-stone-300 bg-white transition-all peer-checked:border-[#B8873F] peer-checked:bg-gradient-to-br peer-checked:from-[#B8873F] peer-checked:to-[#9D7230]">

                      <Check
                        size={13}
                        className="text-white opacity-0 transition-opacity peer-checked:opacity-100"
                      />

                    </div>

                  </div>

                  <div>

                    <p className="text-sm font-medium leading-6 text-stone-700">
                      Je confirme que les informations fournies sont exactes et
                      j’autorise Barack Mining Investment à les utiliser pour
                      traiter ma demande.
                    </p>

                    <div className="mt-3 flex items-center gap-2">

                      <LockKeyhole
                        size={13}
                        className="text-[#9B793E]"
                      />

                      <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-stone-400">
                        Traitement de votre demande
                      </span>

                    </div>

                  </div>

                </label>

                <FieldError
                  error={errors.consent}
                />

                {/* ERREUR */}
                {error && (
                  <div className="flex items-start gap-3 rounded-[20px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">

                    <AlertCircle
                      size={18}
                      className="mt-0.5 shrink-0"
                    />

                    <div>

                      <p className="font-semibold">
                        Impossible d’envoyer votre demande
                      </p>

                      <p className="mt-1 text-red-600/80">
                        {error}
                      </p>

                    </div>

                  </div>
                )}

                {/* ACTIONS */}
                <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-6 sm:flex-row sm:items-center sm:justify-between">

                  <button
                    type="button"
                    onClick={goToPrev}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-stone-200 px-6 text-sm font-semibold text-stone-600 transition-all duration-300 hover:border-[#C69B52]/35 hover:bg-[#FBFAF7]"
                  >
                    <ArrowLeft size={16} />
                    Retour
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group inline-flex h-12 items-center justify-center gap-3 rounded-full border border-[#D7B66C]/55 bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] px-7 text-sm font-semibold text-[#11100B] shadow-[0_10px_28px_rgba(184,137,63,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#15120C]/25 border-t-[#15120C]" />

                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        Soumettre l’opportunité

                        <ArrowRight
                          size={16}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </>
                    )}

                  </button>

                </div>

              </div>
            )}

          </form>

          {/* ======================================================
              FOOTER
          ====================================================== */}

          <div className="border-t border-stone-100 bg-[#FBFAF7] px-6 py-5 sm:px-9">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-2">

                <ShieldCheck
                  size={14}
                  className="text-[#9B793E]"
                />

                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                  Barack Mining Investment
                </span>

              </div>

              <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-stone-300">
                Formulaire d’opportunité
              </span>

            </div>

          </div>

        </div>
      </div>

      {/* ======================================================
          STYLES
      ====================================================== */}

      <style jsx>{`
        .form-input {
          width: 100%;
          min-height: 48px;
          border-radius: 14px;
          border: 1px solid rgb(231 229 228);
          background: rgb(250 250 248);
          padding: 0 16px;
          font-size: 14px;
          line-height: 1.5;
          color: rgb(28 25 23);
          outline: none;
          transition:
            border-color 200ms ease,
            box-shadow 200ms ease,
            background 200ms ease;
        }

        .form-input::placeholder {
          color: rgb(168 162 158);
        }

        .form-input:hover {
          border-color: rgb(211 190 149);
        }

        .form-input:focus {
          border-color: rgb(184 137 63);
          background: white;
          box-shadow:
            0 0 0 3px rgb(199 156 77 / 10%);
        }

        .field-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgb(168 162 158);
          pointer-events: none;
        }

        textarea.form-input {
          min-height: 200px;
        }
      `}</style>

    </main>
  )
}

// ============================================================
// SOUS-COMPOSANTS
// ============================================================

function Field({
  label,
  required = false,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-stone-400">
        {label}

        {required && (
          <span className="ml-1 text-[#B8873F]">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  )
}

function FieldError({
  error,
}: {
  error:
    | FieldError
    | undefined
    | {
        message?: string
      }
}) {
  if (!error) {
    return null
  }

  return (
    <p className="mt-2 text-xs font-medium text-red-600">
      {String(
        error.message ||
          'Champ invalide'
      )}
    </p>
  )
}

function NavigationButtons({
  onPrev,
  onNext,
}: {
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-6 sm:flex-row sm:items-center sm:justify-between">

      <button
        type="button"
        onClick={onPrev}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-stone-200 px-6 text-sm font-semibold text-stone-600 transition-all duration-300 hover:border-[#C69B52]/35 hover:bg-[#FBFAF7]"
      >
        <ArrowLeft size={16} />
        Retour
      </button>

      <button
        type="button"
        onClick={onNext}
        className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#D7B66C]/55 bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] px-6 text-sm font-semibold text-[#15120C] shadow-[0_10px_25px_rgba(184,137,63,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
      >
        Continuer

        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </button>

    </div>
  )
}

function InfoMini({
  icon,
  label,
  text,
}: {
  icon: React.ReactNode
  label: string
  text: string
}) {
  return (
    <div className="rounded-[18px] border border-stone-200 bg-[#FBFAF7] p-4 transition-all duration-300 hover:border-[#C69B52]/30">

      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0A0C0B] text-[#E1C487]">
        {icon}
      </div>

      <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-[#0A0C0B]">
        {label}
      </p>

      <p className="mt-1 text-xs leading-5 text-stone-400">
        {text}
      </p>

    </div>
  )
}

function Summary({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="bg-white p-5">

      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-stone-300">
        {label}
      </p>

      <p className="mt-2 truncate text-sm font-semibold text-[#0A0C0B]">
        {value}
      </p>

    </div>
  )
}

// ============================================================
// UTILITAIRES
// ============================================================

function normalizeProfile(
  value: string | null
): FormData['profile'] {
  switch (value) {
    case 'investor':
    case 'concession':
    case 'supplier':
    case 'company':
    case 'partner':
    case 'other':
      return value

    default:
      return 'investor'
  }
}

async function safeJson(
  response: Response
): Promise<{
  message?: string
} | null> {
  try {
    return await response.json()
  } catch {
    return null
  }
}
