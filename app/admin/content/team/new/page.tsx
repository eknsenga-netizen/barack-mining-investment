'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ImageIcon,
  Plus,
  Save,
  ShieldAlert,
  ShieldCheck,
  User,
  Users,
  X,
} from 'lucide-react'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/* ============================================================
   TYPES
============================================================ */

type Status =
  | 'active'
  | 'inactive'

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

const STATUS_OPTIONS: {
  value: Status
  label: string
  description: string
}[] = [
  {
    value: 'active',
    label: 'Active',
    description:
      'Visible on the public team section.',
  },
  {
    value: 'inactive',
    label: 'Inactive',
    description:
      'Retained internally and not currently displayed.',
  },
]

const AUTHORIZED_ROLES: Role[] = [
  'super_admin',
  'admin',
  'content_manager',
]

/* ============================================================
   HELPERS
============================================================ */

function getStatusClass(
  status: Status
) {
  return status === 'active'
    ? 'bg-emerald-50 text-emerald-700'
    : 'bg-slate-100 text-slate-500'
}

function getInitials(
  value: string
) {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 0) {
    return 'BM'
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase()
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

/* ============================================================
   FIELD
============================================================ */

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-400">
          {label}

          {required && (
            <span className="ml-1 text-[#A96F35]">
              *
            </span>
          )}
        </label>

        {hint && (
          <span className="text-[10px] text-slate-400">
            {hint}
          </span>
        )}
      </div>

      {children}
    </div>
  )
}

/* ============================================================
   SECTION
============================================================ */

function FormSection({
  number,
  eyebrow,
  title,
  description,
  children,
}: {
  number?: string
  eyebrow: string
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.04)]">

      <div className="border-b border-slate-100 px-5 py-5 sm:px-7 sm:py-6">

        <div className="flex items-start gap-4">

          {number && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0A0C0B] text-[10px] font-bold tracking-[0.12em] text-white">
              {number}
            </div>
          )}

          <div className="min-w-0">

            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#A98B4F]">
              {eyebrow}
            </p>

            <h2 className="mt-1 text-base font-semibold tracking-[-0.02em] text-slate-950">
              {title}
            </h2>

            {description && (
              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                {description}
              </p>
            )}

          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7">
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
    <div className="flex min-h-[70vh] items-center justify-center px-4">

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
          Preparing secure team workspace
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Verifying access and preparing the member editor...
        </p>

      </div>
    </div>
  )
}

/* ============================================================
   PAGE
============================================================ */

export default function NewTeamMemberPage() {
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

  const [fullName, setFullName] =
    useState('')

  const [position, setPosition] =
    useState('')

  const [bio, setBio] =
    useState('')

  const [photoUrl, setPhotoUrl] =
    useState('')

  const [displayOrder, setDisplayOrder] =
    useState(0)

  const [status, setStatus] =
    useState<Status>('active')

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

        setProfile(
          typedProfile
        )

        setAuthorized(
          AUTHORIZED_ROLES.includes(
            typedProfile.role
          )
        )
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
     VALIDATION
  ========================================================== */

  const validateForm = () => {
    const cleanFullName =
      fullName.trim()

    const cleanPosition =
      position.trim()

    const cleanBio =
      bio.trim()

    const cleanPhotoUrl =
      photoUrl.trim()

    if (!cleanFullName) {
      return 'The full name is required.'
    }

    if (!cleanPosition) {
      return 'The position is required.'
    }

    if (cleanFullName.length > 200) {
      return 'The full name is too long.'
    }

    if (cleanPosition.length > 200) {
      return 'The position is too long.'
    }

    if (cleanBio.length > 5000) {
      return 'The biography is too long.'
    }

    if (
      cleanPhotoUrl
    ) {
      try {
        new URL(
          cleanPhotoUrl
        )
      } catch {
        return 'The photo URL is not valid.'
      }
    }

    if (
      !Number.isInteger(
        displayOrder
      ) ||
      displayOrder < 0
    ) {
      return 'Display order must be a positive whole number or zero.'
    }

    return null
  }

  /* ==========================================================
     SUBMIT
  ========================================================== */

  const handleSubmit =
    async (
      event: React.FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault()

      if (
        loading ||
        success ||
        !authorized
      ) {
        return
      }

      setError(null)

      const validationError =
        validateForm()

      if (validationError) {
        setError(
          validationError
        )
        return
      }

      setLoading(true)

      try {
        /* ----------------------------------------------------
           Re-check authentication
        ---------------------------------------------------- */

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

        /* ----------------------------------------------------
           Re-check authorization immediately before mutation
        ---------------------------------------------------- */

        const {
          data: currentProfile,
          error: profileError,
        } =
          await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle()

        if (
          profileError ||
          !currentProfile ||
          !AUTHORIZED_ROLES.includes(
            currentProfile.role as Role
          )
        ) {
          throw new Error(
            'Your current account is not authorized to create team members.'
          )
        }

        /* ----------------------------------------------------
           Create team member
        ---------------------------------------------------- */

        const {
          error: insertError,
        } =
          await supabase
            .from('team_members')
            .insert({
              full_name:
                fullName.trim(),
              position:
                position.trim(),
              bio:
                bio.trim() ||
                null,
              photo_url:
                photoUrl.trim() ||
                null,
              display_order:
                displayOrder,
              status,
            })

        if (insertError) {
          console.error(
            'Team member creation error:',
            insertError
          )

          throw new Error(
            insertError.message ||
              'Unable to create this team member.'
          )
        }

        setSuccess(true)

        window.setTimeout(() => {
          router.push(
            '/admin/content/team'
          )
        }, 1500)
      } catch (submitError) {
        console.error(
          'Team member creation failed:',
          submitError
        )

        setError(
          submitError instanceof Error
            ? submitError.message
            : 'Unable to create this team member.'
        )
      } finally {
        setLoading(false)
      }
    }

  /* ==========================================================
     PREVIEW
  ========================================================== */

  const previewName =
    useMemo(
      () =>
        fullName.trim() ||
        'New team member',
      [fullName]
    )

  const previewPosition =
    useMemo(
      () =>
        position.trim() ||
        'Position',
      [position]
    )

  const previewInitials =
    useMemo(
      () =>
        getInitials(
          previewName
        ),
      [previewName]
    )

  /* ==========================================================
     LOADING
  ========================================================== */

  if (checkingAccess) {
    return <LoadingState />
  }

  /* ==========================================================
     ACCESS DENIED
  ========================================================== */

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
            Your current role does not have permission to create team members.
          </p>

          {profile?.email && (
            <p className="mt-3 text-xs text-slate-400">
              Signed in as {profile.email}
            </p>
          )}

          <button
            type="button"
            onClick={() =>
              router.replace(
                '/admin'
              )
            }
            className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft size={14} />
            Back to dashboard
          </button>

        </div>
      </div>
    )
  }

  /* ==========================================================
     SUCCESS
  ========================================================== */

  if (success) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">

        <div className="w-full rounded-[30px] border border-emerald-200 bg-white p-8 text-center shadow-[0_25px_80px_rgba(15,23,42,0.08)] sm:p-10">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={29} />
          </div>

          <p className="mt-6 text-[9px] font-semibold uppercase tracking-[0.3em] text-emerald-600">
            Team record created
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-3xl">
            Team member added
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            The team member has been successfully added to the Barack Mining Investment content workspace.
          </p>

          <div className="mx-auto mt-7 max-w-sm rounded-2xl border border-slate-100 bg-slate-50 p-4">

            <div className="flex items-center justify-center gap-3">

              {photoUrl.trim() ? (
                <img
                  src={photoUrl.trim()}
                  alt={previewName}
                  className="h-12 w-12 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0A0C0B] text-xs font-semibold text-[#D0A765]">
                  {previewInitials}
                </div>
              )}

              <div className="min-w-0 text-left">

                <p className="truncate text-sm font-semibold text-slate-950">
                  {previewName}
                </p>

                <p className="mt-0.5 truncate text-xs text-slate-400">
                  {previewPosition}
                </p>

              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">

              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide ${getStatusClass(
                  status
                )}`}
              >
                {
                  status ===
                  'active'
                    ? 'Active'
                    : 'Inactive'
                }
              </span>

              <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-semibold text-slate-600">
                Order {displayOrder}
              </span>

            </div>
          </div>

          <div className="mt-7 grid gap-2 sm:grid-cols-2">

            <button
              type="button"
              onClick={() =>
                router.push(
                  '/admin/content/team'
                )
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              All team members
              <ArrowRight size={14} />
            </button>

            <button
              type="button"
              onClick={() => {
                setSuccess(false)
                setFullName('')
                setPosition('')
                setBio('')
                setPhotoUrl('')
                setDisplayOrder(0)
                setStatus('active')
                setError(null)
              }}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Add another
            </button>

          </div>

        </div>
      </div>
    )
  }

  /* ==========================================================
     MAIN
  ========================================================== */

  return (
    <div className="mx-auto max-w-[1180px] space-y-6 pb-10">

      {/* ======================================================
          HEADER / BREADCRUMB
      ====================================================== */}

      <section>

        <div className="flex flex-wrap items-center gap-2">

          <button
            type="button"
            onClick={() =>
              router.push(
                '/admin/content/team'
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

          <span className="text-xs font-medium text-slate-400">
            Content
          </span>

          <span className="text-slate-300">
            /
          </span>

          <button
            type="button"
            onClick={() =>
              router.push(
                '/admin/content/team'
              )
            }
            className="text-xs font-medium text-slate-400 transition hover:text-slate-700"
          >
            Team
          </button>

          <span className="text-slate-300">
            /
          </span>

          <span className="text-xs font-semibold text-slate-700">
            New
          </span>

        </div>

        <div className="mt-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

          <div className="flex items-start gap-4">

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
                  Content
                </span>

                <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Protected workspace
                </span>

              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-slate-950">
                Add Team Member
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Add a new member to the team displayed on the Barack Mining Investment public website.
              </p>

            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Current status
            </p>

            <div className="mt-2 flex items-center gap-2">

              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide ${getStatusClass(
                  status
                )}`}
              >
                {
                  status ===
                  'active'
                    ? 'Active'
                    : 'Inactive'
                }
              </span>

              <span className="text-[10px] text-slate-400">
                Display order {displayOrder}
              </span>

            </div>
          </div>

        </div>
      </section>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-600">
            <ShieldAlert size={17} />
          </div>

          <div className="min-w-0 flex-1">

            <p className="text-sm font-semibold text-red-800">
              We could not complete the request
            </p>

            <p className="mt-1 text-xs leading-5 text-red-700/80">
              {error}
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setError(null)
            }
            className="rounded-lg p-1 text-red-400 transition hover:bg-red-100 hover:text-red-700"
            aria-label="Dismiss error"
          >
            <X size={15} />
          </button>

        </div>
      )}

      {/* ======================================================
          FORM + PREVIEW
      ====================================================== */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_360px]">

          {/* ==================================================
              LEFT
          ================================================== */}

          <div className="space-y-6">

            {/* MEMBER INFORMATION */}

            <FormSection
              number="01"
              eyebrow="Profile"
              title="Member information"
              description="Enter the identity and professional information that will appear in the team section."
            >

              <div className="grid gap-5 sm:grid-cols-2">

                <Field
                  label="Full name"
                  required
                >
                  <div className="relative">

                    <User
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={fullName}
                      onChange={(event) =>
                        setFullName(
                          event.target.value
                        )
                      }
                      maxLength={200}
                      autoComplete="name"
                      placeholder="e.g. Jean Dupont"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                      required
                    />

                  </div>
                </Field>

                <Field
                  label="Position"
                  required
                >
                  <input
                    type="text"
                    value={position}
                    onChange={(event) =>
                      setPosition(
                        event.target.value
                      )
                    }
                    maxLength={200}
                    placeholder="e.g. Operations Director"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                    required
                  />
                </Field>

              </div>

              <div className="mt-5">

                <Field
                  label="Biography"
                  hint={`${bio.length}/5000`}
                >

                  <textarea
                    value={bio}
                    onChange={(event) =>
                      setBio(
                        event.target.value
                      )
                    }
                    maxLength={5000}
                    rows={6}
                    placeholder="Short professional biography..."
                    className="w-full resize-y rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                  />

                </Field>

              </div>

            </FormSection>

            {/* PHOTO / ORDER */}

            <FormSection
              number="02"
              eyebrow="Presentation"
              title="Photo and display order"
              description="Control the member's image reference and position in the public team listing."
            >

              <div className="grid gap-5 sm:grid-cols-[1fr_220px]">

                <Field
                  label="Photo URL"
                  hint="Optional"
                >

                  <div className="relative">

                    <ImageIcon
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="url"
                      value={photoUrl}
                      onChange={(event) =>
                        setPhotoUrl(
                          event.target.value
                        )
                      }
                      placeholder="https://example.com/photo.jpg"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                    />

                  </div>

                  <p className="mt-2 text-[10px] leading-5 text-slate-400">
                    The image itself remains externally referenced by the photo URL.
                  </p>

                </Field>

                <Field
                  label="Display order"
                  hint="0+"
                >

                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(event) => {
                      const nextValue =
                        Number(
                          event.target.value
                        )

                      setDisplayOrder(
                        Number.isFinite(
                          nextValue
                        )
                          ? Math.max(
                              0,
                              Math.trunc(
                                nextValue
                              )
                            )
                          : 0
                      )
                    }}
                    min={0}
                    step={1}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                  />

                  <p className="mt-2 text-[10px] leading-5 text-slate-400">
                    Lower numbers appear first.
                  </p>

                </Field>

              </div>

            </FormSection>

            {/* STATUS */}

            <FormSection
              number="03"
              eyebrow="Visibility"
              title="Publication status"
              description="Choose whether this member is currently active in the public team section."
            >

              <div className="grid gap-3 sm:grid-cols-2">

                {STATUS_OPTIONS.map(
                  (option) => {
                    const selected =
                      status ===
                      option.value

                    return (
                      <button
                        key={
                          option.value
                        }
                        type="button"
                        onClick={() =>
                          setStatus(
                            option.value
                          )
                        }
                        className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                          selected
                            ? 'border-slate-950 bg-slate-950 text-white shadow-[0_10px_30px_rgba(10,12,11,0.10)]'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >

                        <div>

                          <p className="text-xs font-semibold">
                            {
                              option.label
                            }
                          </p>

                          <p
                            className={`mt-1 text-[10px] leading-5 ${
                              selected
                                ? 'text-white/50'
                                : 'text-slate-400'
                            }`}
                          >
                            {
                              option.description
                            }
                          </p>

                        </div>

                        {selected && (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D0A765] text-[#0A0C0B]">
                            <Check
                              size={13}
                              strokeWidth={
                                3
                              }
                            />
                          </div>
                        )}

                      </button>
                    )
                  }
                )}

              </div>

            </FormSection>

          </div>

          {/* ==================================================
              RIGHT
          ================================================== */}

          <aside className="space-y-6">

            {/* LIVE PREVIEW */}

            <FormSection
              eyebrow="Preview"
              title="Team member profile"
              description="Live representation of the member profile."
            >

              <div className="flex flex-col items-center text-center">

                {photoUrl.trim() ? (
                  <img
                    src={
                      photoUrl.trim()
                    }
                    alt={previewName}
                    className="h-24 w-24 rounded-[28px] object-cover shadow-[0_12px_35px_rgba(15,23,42,0.10)]"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#0A0C0B] text-xl font-semibold text-[#D0A765] shadow-[0_12px_35px_rgba(10,12,11,0.12)]">
                    {previewInitials}
                  </div>
                )}

                <h3 className="mt-5 max-w-full truncate text-base font-semibold text-slate-950">
                  {previewName}
                </h3>

                <p className="mt-1 max-w-full truncate text-xs text-slate-400">
                  {previewPosition}
                </p>

                <span
                  className={`mt-4 inline-flex rounded-full px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wide ${getStatusClass(
                    status
                  )}`}
                >
                  {
                    status ===
                    'active'
                      ? 'Active'
                      : 'Inactive'
                  }
                </span>

                {bio.trim() && (
                  <p className="mt-5 line-clamp-4 text-xs leading-5 text-slate-500">
                    {bio.trim()}
                  </p>
                )}

              </div>

            </FormSection>

            {/* RECORD SUMMARY */}

            <FormSection
              eyebrow="Record"
              title="Team record"
            >

              <div className="space-y-2">

                <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50/70 px-3 py-3">

                  <div className="flex items-center gap-2">

                    <User
                      size={14}
                      className="text-slate-400"
                    />

                    <span className="text-xs text-slate-500">
                      Name
                    </span>

                  </div>

                  <span className="max-w-[160px] truncate text-xs font-semibold text-slate-700">
                    {previewName}
                  </span>

                </div>

                <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50/70 px-3 py-3">

                  <div className="flex items-center gap-2">

                    <Users
                      size={14}
                      className="text-slate-400"
                    />

                    <span className="text-xs text-slate-500">
                      Position
                    </span>

                  </div>

                  <span className="max-w-[160px] truncate text-xs font-semibold text-slate-700">
                    {previewPosition}
                  </span>

                </div>

                <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50/70 px-3 py-3">

                  <span className="text-xs text-slate-500">
                    Display order
                  </span>

                  <span className="text-xs font-semibold text-slate-700">
                    {displayOrder}
                  </span>

                </div>

                <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50/70 px-3 py-3">

                  <span className="text-xs text-slate-500">
                    Status
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase ${getStatusClass(
                      status
                    )}`}
                  >
                    {
                      status ===
                      'active'
                        ? 'Active'
                        : 'Inactive'
                    }
                  </span>

                </div>

              </div>

            </FormSection>

            {/* SECURITY */}

            <FormSection
              eyebrow="Security"
              title="Protected workspace"
              description="Team management is restricted to authorized content roles."
            >

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">

                <div className="flex items-start gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600">
                    <ShieldCheck size={17} />
                  </div>

                  <div>

                    <p className="text-xs font-semibold text-emerald-800">
                      Authorized content workspace
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-emerald-700/70">
                      Your authenticated session and role are verified before the record is created.
                    </p>

                  </div>

                </div>
              </div>

            </FormSection>

          </aside>
        </div>

        {/* ====================================================
            ACTION BAR
        ==================================================== */}

        <div className="sticky bottom-4 z-20">

          <div className="flex flex-col justify-between gap-3 rounded-[22px] border border-slate-200 bg-white/95 p-3 shadow-[0_18px_60px_rgba(15,23,42,0.13)] backdrop-blur-xl sm:flex-row sm:items-center">

            <div className="flex items-center gap-3 px-2">

              <div className="hidden h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 sm:flex">
                <Users size={15} />
              </div>

              <div>

                <p className="text-xs font-semibold text-slate-800">
                  {loading
                    ? 'Creating team member...'
                    : 'Ready to submit'}
                </p>

                <p className="text-[10px] text-slate-400">
                  Required information is validated before creation.
                </p>

              </div>

            </div>

            <div className="flex gap-2">

              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  router.back()
                }
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                <ArrowLeft size={14} />
                Previous
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-5 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.15)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    Add Team Member
                  </>
                )}
              </button>

            </div>
          </div>
        </div>

      </form>

    </div>
  )
}