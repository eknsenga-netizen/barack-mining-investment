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
  Building2,
  CalendarDays,
  Edit3,
  Globe2,
  Link2,
  MapPin,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Users,
} from 'lucide-react'

import { useParams, useRouter } from 'next/navigation'
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

type Organization = {
  id: string
  name: string | null
  type: string | null
  country: string | null
  website: string | null
  created_at: string
  updated_at: string
}

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

const ORGANIZATION_TYPE_LABELS: Record<string, string> = {
  investor: 'Investor',
  mining_company: 'Mining Company',
  supplier: 'Supplier',
  partner: 'Partner',
  other: 'Other',
}

/* ============================================================
   HELPERS
============================================================ */

function formatDate(value: string | null | undefined) {
  if (!value) return '—'

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return '—'

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function getInitials(value: string) {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 0) {
    return 'BM'
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

function organizationTypeLabel(type: string | null) {
  if (!type) return 'Other'

  return ORGANIZATION_TYPE_LABELS[type] ?? type
}

/* ============================================================
   DETAIL ROW
============================================================ */

function DetailRow({
  label,
  value,
  icon,
}: {
  label: string
  value: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
      {icon && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
          {icon}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {label}
        </p>

        <div className="mt-1 break-words text-sm font-medium text-slate-800">
          {value || '—'}
        </div>
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
          Preparing organization
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Verifying access and loading relationship data...
        </p>
      </div>
    </div>
  )
}

/* ============================================================
   PAGE
============================================================ */

export default function OrganizationDetailPage() {
  const router = useRouter()
  const params = useParams()

  const id = params.id as string

  const supabase = createClient()

  /* ----------------------------------------------------------
     ACCESS
  ---------------------------------------------------------- */

  const [authorized, setAuthorized] = useState(false)
  const [checkingAccess, setCheckingAccess] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)

  /* ----------------------------------------------------------
     DATA
  ---------------------------------------------------------- */

  const [organization, setOrganization] =
    useState<Organization | null>(null)

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* ==========================================================
     ACCESS CHECK
  ========================================================== */

  const verifyAccess = useCallback(async () => {
    setCheckingAccess(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/login')
        return
      }

      const {
        data: currentProfile,
        error: profileError,
      } = await supabase
        .from('profiles')
        .select('id, email, full_name, role')
        .eq('id', user.id)
        .maybeSingle()

      if (profileError || !currentProfile) {
        console.error(
          'Profile access error:',
          profileError
        )

        router.replace('/login')
        return
      }

      setProfile(currentProfile as Profile)

      const allowed = AUTHORIZED_ROLES.includes(
        currentProfile.role as Role
      )

      if (!allowed) {
        setAuthorized(false)
        return
      }

      setAuthorized(true)
    } catch (accessError) {
      console.error(
        'Access verification error:',
        accessError
      )

      router.replace('/login')
    } finally {
      setCheckingAccess(false)
    }
  }, [router, supabase])

  useEffect(() => {
    verifyAccess()
  }, [verifyAccess])

  /* ==========================================================
     AUTH STATE
  ========================================================== */

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
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
     LOAD ORGANIZATION
  ========================================================== */

  const loadData = useCallback(
    async (isRefresh = false) => {
      if (!authorized) {
        return
      }

      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      setError(null)

      try {
        const {
          data,
          error: organizationError,
        } = await supabase
          .from('organizations')
          .select(
            `
              id,
              name,
              type,
              country,
              website,
              created_at,
              updated_at
            `
          )
          .eq('id', id)
          .maybeSingle()

        if (organizationError) {
          console.error(
            'Organization loading error:',
            organizationError
          )

          setError(
            'Unable to load this organization.'
          )

          return
        }

        if (!data) {
          setError(
            'This organization could not be found.'
          )

          return
        }

        setOrganization(data as Organization)
      } catch (loadError) {
        console.error(
          'Organization detail loading error:',
          loadError
        )

        setError(
          'An unexpected error occurred while loading this organization.'
        )
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [authorized, id, supabase]
  )

  useEffect(() => {
    if (authorized) {
      loadData()
    }
  }, [authorized, loadData])

  /* ==========================================================
     DERIVED DATA
  ========================================================== */

  const organizationName = useMemo(
    () =>
      organization?.name?.trim() ||
      'Unnamed organization',
    [organization]
  )

  const initials = useMemo(
    () => getInitials(organizationName),
    [organizationName]
  )

  /* ==========================================================
     STATES
  ========================================================== */

  if (checkingAccess || loading) {
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
            Your current role does not have permission to view
            relationship data.
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

  if (error || !organization) {
    return (
      <div className="space-y-5">
        <button
          type="button"
          onClick={() =>
            router.push(
              '/admin/relationships'
            )
          }
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <ArrowLeft size={14} />
          Back to Relationships
        </button>

        <div className="rounded-[26px] border border-red-200 bg-white px-6 py-14 text-center shadow-[0_15px_50px_rgba(15,23,42,0.05)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <Building2 size={23} />
          </div>

          <h2 className="mt-5 text-base font-semibold text-slate-950">
            Organization unavailable
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {error ??
              'This organization could not be found.'}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                '/admin/relationships'
              )
            }
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft size={14} />
            Return to relationships
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

          <span className="max-w-[240px] truncate text-xs font-semibold text-slate-700">
            {organizationName}
          </span>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

          <div className="flex items-start gap-4">

            {/* LOGO / ORGANIZATION MARK */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-[#0A0C0B] shadow-[0_12px_30px_rgba(10,12,11,0.13)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5">
                <Building2
                  size={24}
                  strokeWidth={1.8}
                  className="text-[#D0A765]"
                />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">

                <span className="inline-flex h-7 items-center rounded-full bg-[#F3EFE7] px-3 text-[9px] font-bold uppercase tracking-[0.22em] text-[#94713F]">
                  Organization
                </span>

                <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Protected record
                </span>

                {organization.type && (
                  <span className="inline-flex h-7 items-center rounded-full bg-slate-100 px-3 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    {organizationTypeLabel(
                      organization.type
                    )}
                  </span>
                )}
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-slate-950">
                {organizationName}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Organization record · Added{' '}
                {formatDate(
                  organization.created_at
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() =>
                loadData(true)
              }
              disabled={refreshing}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={
                  refreshing
                    ? 'animate-spin'
                    : ''
                }
              />

              Refresh
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/admin/relationships/organizations/${id}/edit`
                )
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.14)] transition hover:bg-slate-800"
            >
              <Edit3 size={14} />
              Edit Organization
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          QUICK ORGANIZATION STRIP
      ======================================================== */}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.03)]">
          <div className="flex items-center gap-2 text-slate-400">
            <Building2 size={15} />

            <span className="text-[9px] font-semibold uppercase tracking-[0.18em]">
              Type
            </span>
          </div>

          <p className="mt-2 truncate text-xs font-semibold text-slate-800">
            {organizationTypeLabel(
              organization.type
            )}
          </p>
        </div>

        <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.03)]">
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin size={15} />

            <span className="text-[9px] font-semibold uppercase tracking-[0.18em]">
              Country
            </span>
          </div>

          <p className="mt-2 truncate text-xs font-semibold text-slate-800">
            {organization.country ??
              'Not provided'}
          </p>
        </div>

        <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.03)]">
          <div className="flex items-center gap-2 text-slate-400">
            <Globe2 size={15} />

            <span className="text-[9px] font-semibold uppercase tracking-[0.18em]">
              Website
            </span>
          </div>

          {organization.website ? (
            <a
              href={organization.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block truncate text-xs font-semibold text-[#A96F35] hover:underline"
            >
              {organization.website}
            </a>
          ) : (
            <p className="mt-2 text-xs font-semibold text-slate-400">
              Not provided
            </p>
          )}
        </div>

        <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.03)]">
          <div className="flex items-center gap-2 text-slate-400">
            <CalendarDays size={15} />

            <span className="text-[9px] font-semibold uppercase tracking-[0.18em]">
              Last updated
            </span>
          </div>

          <p className="mt-2 truncate text-xs font-semibold text-slate-800">
            {formatDateTime(
              organization.updated_at
            )}
          </p>
        </div>
      </section>

      {/* ========================================================
          MAIN CONTENT
      ======================================================== */}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_380px]">

        {/* ======================================================
            LEFT
        ====================================================== */}

        <div className="space-y-6">

          {/* ORGANIZATION INFORMATION */}

          <Section
            eyebrow="Organization"
            title="Organization information"
            description="Core identity and business information stored in the relationship database."
          >
            <div className="grid gap-4 sm:grid-cols-2">

              <DetailRow
                label="Name"
                value={
                  organization.name ??
                  '—'
                }
                icon={
                  <Building2 size={15} />
                }
              />

              <DetailRow
                label="Type"
                value={organizationTypeLabel(
                  organization.type
                )}
                icon={
                  <Users size={15} />
                }
              />

              <DetailRow
                label="Country"
                value={
                  organization.country ??
                  '—'
                }
                icon={
                  <MapPin size={15} />
                }
              />

              <DetailRow
                label="Website"
                value={
                  organization.website ? (
                    <a
                      href={
                        organization.website
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#A96F35] hover:underline"
                    >
                      {organization.website}
                    </a>
                  ) : (
                    '—'
                  )
                }
                icon={
                  <Globe2 size={15} />
                }
              />

              <DetailRow
                label="Created"
                value={formatDateTime(
                  organization.created_at
                )}
                icon={
                  <CalendarDays
                    size={15}
                  />
                }
              />

              <DetailRow
                label="Last updated"
                value={formatDateTime(
                  organization.updated_at
                )}
                icon={
                  <RefreshCw
                    size={15}
                  />
                }
              />
            </div>
          </Section>

          {/* BUSINESS PROFILE */}

          <Section
            eyebrow="Relationship"
            title="Organization profile"
            description="Business classification and relationship context associated with this organization."
          >
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">

              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0A0C0B] text-[#D0A765]">
                    <Building2
                      size={19}
                    />
                  </div>

                  <div className="min-w-0">

                    <p className="text-base font-semibold text-slate-950">
                      {organizationName}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">

                      <span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                        {organizationTypeLabel(
                          organization.type
                        )}
                      </span>

                      {organization.country && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[9px] font-semibold text-slate-500">
                          <MapPin size={11} />

                          {
                            organization.country
                          }
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/admin/relationships/organizations/${id}/edit`
                    )
                  }
                  className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <Edit3 size={13} />
                  Edit organization
                </button>
              </div>

              {organization.website && (
                <div className="mt-5 border-t border-slate-200 pt-4">

                  <a
                    href={
                      organization.website
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex max-w-full items-center gap-2 text-xs font-medium text-[#A96F35] hover:underline"
                  >
                    <Globe2
                      size={14}
                    />

                    <span className="truncate">
                      {
                        organization.website
                      }
                    </span>

                    <ArrowRight
                      size={13}
                      className="shrink-0"
                    />
                  </a>
                </div>
              )}
            </div>
          </Section>

          {/* RECORD */}

          <Section
            eyebrow="Record"
            title="Organization record"
            description="System information associated with this organization."
          >
            <div className="grid gap-4 sm:grid-cols-2">

              <DetailRow
                label="Organization ID"
                value={
                  <span className="break-all font-mono text-[11px] text-slate-600">
                    {organization.id}
                  </span>
                }
                icon={
                  <Building2 size={15} />
                }
              />

              <DetailRow
                label="Created at"
                value={formatDateTime(
                  organization.created_at
                )}
                icon={
                  <CalendarDays
                    size={15}
                  />
                }
              />

              <DetailRow
                label="Updated at"
                value={formatDateTime(
                  organization.updated_at
                )}
                icon={
                  <RefreshCw size={15} />
                }
              />

              <DetailRow
                label="Relationship type"
                value={organizationTypeLabel(
                  organization.type
                )}
                icon={
                  <Link2 size={15} />
                }
              />
            </div>
          </Section>
        </div>

        {/* ======================================================
            RIGHT
        ====================================================== */}

        <aside className="space-y-6">

          {/* SUMMARY */}

          <Section
            eyebrow="Summary"
            title="Organization profile"
          >
            <div className="flex flex-col items-center text-center">

              <div className="flex h-20 w-20 items-center justify-center rounded-[25px] bg-[#0A0C0B] shadow-[0_12px_35px_rgba(10,12,11,0.12)]">
                <Building2
                  size={30}
                  strokeWidth={1.6}
                  className="text-[#D0A765]"
                />
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-950">
                {organizationName}
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Organization record
              </p>

              <span className="mt-4 inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-semibold text-slate-600">
                {organizationTypeLabel(
                  organization.type
                )}
              </span>
            </div>
          </Section>

          {/* QUICK ACTIONS */}

          <Section
            eyebrow="Actions"
            title="Organization actions"
          >
            <div className="space-y-2">

              {organization.website ? (
                <a
                  href={
                    organization.website
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
                    <Globe2 size={14} />
                  </div>

                  Open website

                  <ArrowRight
                    size={14}
                    className="ml-auto text-slate-300"
                  />
                </a>
              ) : (
                <div className="flex h-11 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 text-xs text-slate-400">
                  <Globe2 size={14} />
                  No website available
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/admin/relationships/organizations/${id}/edit`
                  )
                }
                className="flex h-11 w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 text-left text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
                  <Edit3 size={14} />
                </div>

                Edit organization

                <ArrowRight
                  size={14}
                  className="ml-auto text-slate-300"
                />
              </button>
            </div>
          </Section>

          {/* SECURITY */}

          <Section
            eyebrow="Security"
            title="Protected record"
            description="Relationship data is subject to the role and RLS policies configured in Supabase."
          >
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600">
                  <ShieldCheck
                    size={17}
                  />
                </div>

                <div>

                  <p className="text-xs font-semibold text-emerald-800">
                    Authorized workspace
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-emerald-700/70">
                    Your account is accessing this record through
                    the authenticated administration workspace.
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
          <Users size={14} />
          All relationships
        </button>
      </div>
    </div>
  )
}