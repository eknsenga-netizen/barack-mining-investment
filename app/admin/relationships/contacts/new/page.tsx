'use client'

import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldAlert,
  ShieldCheck,
  UserRound,
} from 'lucide-react'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/* ============================================================
   TYPES
============================================================ */

type Role =
  | 'super_admin'
  | 'admin'
  | 'opportunity_manager'
  | 'content_manager'
  | 'operations_manager'
  | 'viewer'

type Profile = {
  id: string
  email: string
  full_name: string | null
  role: Role
}

/* ============================================================
   CONSTANTS
============================================================ */

const AUTHORIZED_ROLES: Role[] = [
  'super_admin',
  'admin',
  'opportunity_manager',
]

/* ============================================================
   FORM FIELD
============================================================ */

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  icon,
  required = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  icon?: React.ReactNode
  required?: boolean
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
        {required && (
          <span className="ml-1 text-[#A96F35]">*</span>
        )}
      </label>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-slate-400">
            {icon}
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          className={[
            'h-11 w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-900 outline-none transition',
            'placeholder:text-slate-300',
            'hover:border-slate-300',
            'focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10',
            icon ? 'pl-10 pr-3' : 'px-3',
          ].join(' ')}
        />
      </div>
    </div>
  )
}

/* ============================================================
   SECTION
============================================================ */

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.04)]">

      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        {eyebrow && (
          <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#A98B4F]">
            {eyebrow}
          </p>
        )}

        <h2 className="mt-1 text-base font-semibold tracking-[-0.02em] text-slate-950">
          {title}
        </h2>

        {description && (
          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
            {description}
          </p>
        )}
      </div>

      <div className="p-5 sm:p-6">
        {children}
      </div>
    </section>
  )
}

/* ============================================================
   LOADING
============================================================ */

function LoadingState() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#0A0C0B] shadow-[0_12px_35px_rgba(10,12,11,0.16)]">
          <img
            src="/images/logo-bmi.png"
            alt="Barack Mining Investment"
            className="max-h-9 max-w-[46px] object-contain brightness-0 invert"
          />
        </div>

        <div className="mx-auto mt-5 h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

        <p className="mt-4 text-sm font-semibold text-slate-900">
          Preparing contact creation
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Verifying access and preparing the relationship workspace...
        </p>
      </div>
    </div>
  )
}

/* ============================================================
   PAGE
============================================================ */

export default function NewContactPage() {
  const router = useRouter()
  const supabase = createClient()

  /* ----------------------------------------------------------
     ACCESS
  ---------------------------------------------------------- */

  const [authorized, setAuthorized] =
    useState(false)

  const [checkingAccess, setCheckingAccess] =
    useState(true)

  const [profile, setProfile] =
    useState<Profile | null>(null)

  /* ----------------------------------------------------------
     FORM
  ---------------------------------------------------------- */

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const [success, setSuccess] =
    useState(false)

  const [firstName, setFirstName] =
    useState('')

  const [lastName, setLastName] =
    useState('')

  const [email, setEmail] =
    useState('')

  const [phone, setPhone] =
    useState('')

  const [country, setCountry] =
    useState('')

  /* ==========================================================
     ACCESS CHECK
  ========================================================== */

  const verifyAccess = useCallback(
    async () => {
      setCheckingAccess(true)

      try {
        const {
          data: {
            user,
          },
        } =
          await supabase.auth.getUser()

        if (!user) {
          router.replace('/login')
          return
        }

        const {
          data: currentProfile,
          error: profileError,
        } =
          await supabase
            .from('profiles')
            .select(
              'id, email, full_name, role'
            )
            .eq('id', user.id)
            .maybeSingle()

        if (
          profileError ||
          !currentProfile
        ) {
          console.error(
            'Profile access error:',
            profileError
          )

          router.replace('/login')
          return
        }

        const typedProfile =
          currentProfile as Profile

        setProfile(typedProfile)

        const allowed =
          AUTHORIZED_ROLES.includes(
            typedProfile.role
          )

        setAuthorized(allowed)
      } catch (accessError) {
        console.error(
          'Access verification error:',
          accessError
        )

        router.replace('/login')
      } finally {
        setCheckingAccess(false)
      }
    },
    [router, supabase]
  )

  useEffect(() => {
    verifyAccess()
  }, [verifyAccess])

  /* ==========================================================
     AUTH STATE
  ========================================================== */

  useEffect(() => {
    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (
          event,
          session
        ) => {
          if (
            event === 'SIGNED_OUT' ||
            !session?.user
          ) {
            router.replace('/login')
          }
        }
      )

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  /* ==========================================================
     SUBMIT
  ========================================================== */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    if (!authorized || loading) {
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const {
        error: insertError,
      } = await supabase
        .from('contacts')
        .insert({
          first_name:
            firstName.trim() || null,
          last_name:
            lastName.trim() || null,
          email:
            email.trim() || null,
          phone:
            phone.trim() || null,
          country:
            country.trim() || null,
        })

      if (insertError) {
        throw insertError
      }

      setSuccess(true)

      setTimeout(() => {
        router.push(
          '/admin/relationships'
        )
      }, 1500)
    } catch (submitError: any) {
      console.error(
        'Contact creation error:',
        submitError
      )

      setError(
        submitError?.message ||
          'Unable to create this contact.'
      )
    } finally {
      setLoading(false)
    }
  }

  /* ==========================================================
     STATES
  ========================================================== */

  if (checkingAccess) {
    return <LoadingState />
  }

  if (!authorized) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">

        <div className="w-full max-w-md rounded-[28px] border border-red-200 bg-white p-8 text-center shadow-[0_20px_70px_rgba(15,23,42,0.08)]">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <ShieldAlert size={23} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-slate-950">
            Access restricted
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your current role does not have permission to create relationship records.
          </p>

          {profile?.email && (
            <p className="mt-3 text-xs text-slate-400">
              Signed in as {profile.email}
            </p>
          )}

          <button
            type="button"
            onClick={() =>
              router.replace('/admin')
            }
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft size={14} />
            Back to dashboard
          </button>
        </div>
      </div>
    )
  }

  /* ==========================================================
     MAIN
  ========================================================== */

  return (
    <div className="space-y-6 pb-10">

      {/* ========================================================
          HEADER / BREADCRUMB
      ======================================================== */}

      <section>

        <div className="flex flex-wrap items-center gap-2">

          <button
            type="button"
            onClick={() =>
              router.push(
                '/admin/relationships'
              )
            }
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeft size={14} />
            Back
          </button>

          <span className="text-slate-300">
            /
          </span>

          <button
            type="button"
            onClick={() =>
              router.push(
                '/admin/relationships'
              )
            }
            className="text-xs font-medium text-slate-400 transition hover:text-slate-700"
          >
            Relationships
          </button>

          <span className="text-slate-300">
            /
          </span>

          <span className="text-xs font-semibold text-slate-700">
            New contact
          </span>

        </div>

        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start">

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-[#0A0C0B] shadow-[0_12px_30px_rgba(10,12,11,0.13)]">
            <img
              src="/images/logo-bmi.png"
              alt="Barack Mining Investment"
              className="max-h-9 max-w-[46px] object-contain brightness-0 invert"
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">

              <span className="inline-flex h-7 items-center rounded-full bg-[#F3EFE7] px-3 text-[9px] font-bold uppercase tracking-[0.22em] text-[#94713F]">
                New record
              </span>

              <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Protected workspace
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-slate-950">
              Create Contact
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Add a new contact to the Barack Mining Investment relationship database.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          CONTENT
      ======================================================== */}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_360px]">

        {/* ======================================================
            FORM
        ====================================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* CONTACT INFORMATION */}

          <Section
            eyebrow="Profile"
            title="Contact information"
            description="Enter the core identity and communication details for this relationship."
          >

            <div className="grid gap-5 sm:grid-cols-2">

              <FormField
                label="First name"
                value={firstName}
                onChange={setFirstName}
                placeholder="e.g. Jean"
                icon={
                  <UserRound size={15} />
                }
              />

              <FormField
                label="Last name"
                value={lastName}
                onChange={setLastName}
                placeholder="e.g. Mwamba"
                icon={
                  <UserRound size={15} />
                }
              />

              <FormField
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="name@company.com"
                icon={
                  <Mail size={15} />
                }
              />

              <FormField
                label="Phone"
                value={phone}
                onChange={setPhone}
                placeholder="+243 ..."
                icon={
                  <Phone size={15} />
                }
              />

              <div className="sm:col-span-2">

                <FormField
                  label="Country"
                  value={country}
                  onChange={setCountry}
                  placeholder="e.g. Democratic Republic of Congo"
                  icon={
                    <MapPin size={15} />
                  }
                />

              </div>

            </div>
          </Section>

          {/* SECURITY */}

          <Section
            eyebrow="Security"
            title="Protected record creation"
            description="This action is performed through the authenticated administration workspace."
          >

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600">
                  <ShieldCheck size={17} />
                </div>

                <div>

                  <p className="text-xs font-semibold text-emerald-800">
                    Authorized workspace
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-emerald-700/70">
                    Your role has permission to create relationship records.
                    Supabase authentication and RLS remain responsible for the
                    underlying data protection.
                  </p>

                </div>
              </div>
            </div>
          </Section>

          {/* FEEDBACK */}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-600">
                  <ShieldAlert size={17} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-red-800">
                    Unable to create contact
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-700/80">
                    {error}
                  </p>
                </div>

              </div>
            </div>
          )}

          {success && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600">
                  <CheckCircle2 size={17} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-emerald-800">
                    Contact created successfully
                  </p>

                  <p className="mt-1 text-xs leading-5 text-emerald-700/80">
                    The relationship record has been created. Returning to relationships...
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* ACTIONS */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() =>
                router.push(
                  '/admin/relationships'
                )
              }
              disabled={loading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft size={14} />
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || success}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-6 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.14)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Save size={14} />
              )}

              {loading
                ? 'Saving...'
                : 'Create Contact'}
            </button>

          </div>
        </form>

        {/* ======================================================
            RIGHT SIDEBAR
        ====================================================== */}

        <aside className="space-y-6">

          {/* PREVIEW */}

          <Section
            eyebrow="Preview"
            title="Contact profile"
          >

            <div className="flex flex-col items-center text-center">

              <div className="flex h-20 w-20 items-center justify-center rounded-[25px] bg-[#0A0C0B] text-xl font-semibold text-white shadow-[0_12px_35px_rgba(10,12,11,0.12)]">
                {(
                  `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`
                    .trim() ||
                  'BM'
                ).toUpperCase()}
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-950">
                {`${firstName} ${lastName}`.trim() ||
                  'New contact'}
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Draft relationship record
              </p>

            </div>

          </Section>

          {/* WHAT WILL BE STORED */}

          <Section
            eyebrow="Record"
            title="Relationship data"
            description="The following information will be stored in the contacts table."
          >

            <div className="space-y-2">

              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-3">
                <UserRound
                  size={14}
                  className="text-slate-400"
                />
                <span className="text-xs font-medium text-slate-600">
                  Identity
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-3">
                <Mail
                  size={14}
                  className="text-slate-400"
                />
                <span className="text-xs font-medium text-slate-600">
                  Email
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-3">
                <Phone
                  size={14}
                  className="text-slate-400"
                />
                <span className="text-xs font-medium text-slate-600">
                  Phone
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-3">
                <MapPin
                  size={14}
                  className="text-slate-400"
                />
                <span className="text-xs font-medium text-slate-600">
                  Country
                </span>
              </div>

            </div>
          </Section>

          {/* SECURITY */}

          <Section
            eyebrow="Security"
            title="Protected workspace"
          >

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600">
                  <ShieldCheck size={17} />
                </div>

                <div>

                  <p className="text-xs font-semibold text-emerald-800">
                    Administration access
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-emerald-700/70">
                    Contact creation is limited to authorized administration roles.
                  </p>

                </div>

              </div>
            </div>
          </Section>

        </aside>
      </div>

      {/* ========================================================
          BOTTOM NAVIGATION
      ======================================================== */}

      <div className="flex flex-col gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">

        <button
          type="button"
          onClick={() =>
            router.back()
          }
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <ArrowLeft size={14} />
          Previous page
        </button>

        <button
          type="button"
          onClick={() =>
            router.push(
              '/admin/relationships'
            )
          }
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <UserRound size={14} />
          All relationships
        </button>

      </div>
    </div>
  )
}