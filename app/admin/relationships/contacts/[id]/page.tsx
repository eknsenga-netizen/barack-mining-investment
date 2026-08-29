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
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  UserRound,
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

type Contact = {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  country: string | null
  organization_id: string | null
  created_at: string
  updated_at: string
}

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

const ORGANIZATION_TYPE_LABELS: Record<
  string,
  string
> = {
  investor: 'Investor',
  mining_company: 'Mining Company',
  supplier: 'Supplier',
  partner: 'Partner',
  other: 'Other',
}

/* ============================================================
   HELPERS
============================================================ */

function formatDate(
  value: string | null | undefined
) {
  if (!value) return '—'

  return new Intl.DateTimeFormat(
    'en-US',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  ).format(new Date(value))
}

function formatDateTime(
  value: string | null | undefined
) {
  if (!value) return '—'

  return new Intl.DateTimeFormat(
    'en-US',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  ).format(new Date(value))
}

function getFullName(
  contact: Contact
) {
  const name = `${contact.first_name ?? ''} ${
    contact.last_name ?? ''
  }`.trim()

  return name || 'Unnamed contact'
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

function organizationTypeLabel(
  type: string | null
) {
  if (!type) return 'Other'

  return (
    ORGANIZATION_TYPE_LABELS[type] ??
    type
  )
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
          Preparing contact
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

export default function ContactDetailPage() {
  const router = useRouter()
  const params = useParams()

  const id = params.id as string

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
     DATA
  ---------------------------------------------------------- */

  const [contact, setContact] =
    useState<Contact | null>(null)

  const [organization, setOrganization] =
    useState<Organization | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [refreshing, setRefreshing] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

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

        setProfile(
          currentProfile as Profile
        )

        const allowed =
          AUTHORIZED_ROLES.includes(
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
     LOAD CONTACT
  ========================================================== */

  const loadData = useCallback(
    async (
      isRefresh = false
    ) => {
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
          data: contactData,
          error: contactError,
        } =
          await supabase
            .from('contacts')
            .select(
              `
                id,
                first_name,
                last_name,
                email,
                phone,
                country,
                organization_id,
                created_at,
                updated_at
              `
            )
            .eq('id', id)
            .maybeSingle()

        if (contactError) {
          console.error(
            'Contact loading error:',
            contactError
          )

          setError(
            'Unable to load this contact.'
          )

          return
        }

        if (!contactData) {
          setError(
            'This contact could not be found.'
          )

          return
        }

        const typedContact =
          contactData as Contact

        setContact(
          typedContact
        )

        /* ------------------------------------------------------
           Related organization
        ------------------------------------------------------ */

        if (
          typedContact.organization_id
        ) {
          const {
            data: organizationData,
            error: organizationError,
          } =
            await supabase
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
              .eq(
                'id',
                typedContact.organization_id
              )
              .maybeSingle()

          if (organizationError) {
            console.error(
              'Organization loading error:',
              organizationError
            )
          }

          setOrganization(
            (organizationData as Organization) ??
              null
          )
        } else {
          setOrganization(null)
        }
      } catch (loadError) {
        console.error(
          'Contact detail loading error:',
          loadError
        )

        setError(
          'An unexpected error occurred while loading this contact.'
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

  const fullName =
    useMemo(
      () =>
        contact
          ? getFullName(contact)
          : 'Contact',
      [contact]
    )

  const initials =
    useMemo(
      () =>
        getInitials(
          fullName
        ),
      [fullName]
    )

  /* ==========================================================
     STATES
  ========================================================== */

  if (
    checkingAccess ||
    loading
  ) {
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

  if (error || !contact) {
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
            <UserRound size={23} />
          </div>

          <h2 className="mt-5 text-base font-semibold text-slate-950">
            Contact unavailable
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {error ??
              'This contact could not be found.'}
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

          <span className="max-w-[220px] truncate text-xs font-semibold text-slate-700">
            {fullName}
          </span>

        </div>

        <div className="mt-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

          <div className="flex items-start gap-4">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-[#0A0C0B] text-lg font-semibold text-white shadow-[0_12px_30px_rgba(10,12,11,0.13)]">
              {initials}
            </div>

            <div>

              <div className="flex flex-wrap items-center gap-2">

                <span className="inline-flex h-7 items-center rounded-full bg-[#F3EFE7] px-3 text-[9px] font-bold uppercase tracking-[0.22em] text-[#94713F]">
                  Contact
                </span>

                <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Protected record
                </span>

              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-slate-950">
                {fullName}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Relationship record · Added{' '}
                {formatDate(
                  contact.created_at
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
                  `/admin/relationships/contacts/${id}/edit`
                )
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.14)] transition hover:bg-slate-800"
            >
              <Edit3 size={14} />
              Edit Contact
            </button>

          </div>

        </div>
      </section>

      {/* ========================================================
          QUICK CONTACT STRIP
      ======================================================== */}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.03)]">

          <div className="flex items-center gap-2 text-slate-400">
            <Mail size={15} />

            <span className="text-[9px] font-semibold uppercase tracking-[0.18em]">
              Email
            </span>
          </div>

          {contact.email ? (
            <a
              href={`mailto:${contact.email}`}
              className="mt-2 block truncate text-xs font-semibold text-slate-800 transition hover:text-[#A96F35] hover:underline"
            >
              {contact.email}
            </a>
          ) : (
            <p className="mt-2 text-xs font-semibold text-slate-400">
              Not provided
            </p>
          )}

        </div>

        <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.03)]">

          <div className="flex items-center gap-2 text-slate-400">
            <Phone size={15} />

            <span className="text-[9px] font-semibold uppercase tracking-[0.18em]">
              Phone
            </span>
          </div>

          {contact.phone ? (
            <a
              href={`tel:${contact.phone}`}
              className="mt-2 block text-xs font-semibold text-slate-800 hover:underline"
            >
              {contact.phone}
            </a>
          ) : (
            <p className="mt-2 text-xs font-semibold text-slate-400">
              Not provided
            </p>
          )}

        </div>

        <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.03)]">

          <div className="flex items-center gap-2 text-slate-400">
            <MapPin size={15} />

            <span className="text-[9px] font-semibold uppercase tracking-[0.18em]">
              Country
            </span>
          </div>

          <p className="mt-2 truncate text-xs font-semibold text-slate-800">
            {contact.country ??
              'Not provided'}
          </p>

        </div>

        <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_8px_28px_rgba(15,23-42,0.03)]">

          <div className="flex items-center gap-2 text-slate-400">
            <CalendarDays size={15} />

            <span className="text-[9px] font-semibold uppercase tracking-[0.18em]">
              Last updated
            </span>
          </div>

          <p className="mt-2 truncate text-xs font-semibold text-slate-800">
            {formatDateTime(
              contact.updated_at
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

          {/* Identity */}
          <Section
            eyebrow="Profile"
            title="Contact information"
            description="Core identity and communication details stored in the relationship database."
          >

            <div className="grid gap-4 sm:grid-cols-2">

              <DetailRow
                label="First name"
                value={
                  contact.first_name ??
                  '—'
                }
                icon={
                  <UserRound size={15} />
                }
              />

              <DetailRow
                label="Last name"
                value={
                  contact.last_name ??
                  '—'
                }
              />

              <DetailRow
                label="Email"
                value={
                  contact.email ? (
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-[#A96F35] hover:underline"
                    >
                      {contact.email}
                    </a>
                  ) : (
                    '—'
                  )
                }
                icon={
                  <Mail size={15} />
                }
              />

              <DetailRow
                label="Phone"
                value={
                  contact.phone ? (
                    <a
                      href={`tel:${contact.phone}`}
                      className="hover:underline"
                    >
                      {contact.phone}
                    </a>
                  ) : (
                    '—'
                  )
                }
                icon={
                  <Phone size={15} />
                }
              />

              <DetailRow
                label="Country"
                value={
                  contact.country ??
                  '—'
                }
                icon={
                  <MapPin size={15} />
                }
              />

              <DetailRow
                label="Created"
                value={formatDateTime(
                  contact.created_at
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
                  contact.updated_at
                )}
                icon={
                  <RefreshCw
                    size={15}
                  />
                }
              />

            </div>

          </Section>

          {/* Organization */}
          <Section
            eyebrow="Relationship"
            title="Associated organization"
            description="Organization currently linked to this contact."
          >

            {organization ? (
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
                        {organization.name ??
                          'Unnamed organization'}
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
                        `/admin/relationships/organizations/${organization.id}`
                      )
                    }
                    className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    View organization
                    <ArrowRight
                      size={13}
                    />
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

                    </a>

                  </div>
                )}

              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-10 text-center">

                <Building2
                  size={23}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm font-semibold text-slate-700">
                  No organization linked
                </p>

                <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
                  This contact is currently not associated
                  with an organization.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/admin/relationships/contacts/${id}/edit`
                    )
                  }
                  className="mt-5 inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Edit3 size={13} />
                  Edit relationship
                </button>

              </div>
            )}

          </Section>

          {/* Record information */}
          <Section
            eyebrow="Record"
            title="Relationship record"
            description="System information associated with this contact."
          >

            <div className="grid gap-4 sm:grid-cols-2">

              <DetailRow
                label="Contact ID"
                value={
                  <span className="break-all font-mono text-[11px] text-slate-600">
                    {contact.id}
                  </span>
                }
                icon={
                  <UserRound
                    size={15}
                  />
                }
              />

              <DetailRow
                label="Organization ID"
                value={
                  contact.organization_id ? (
                    <span className="break-all font-mono text-[11px] text-slate-600">
                      {
                        contact.organization_id
                      }
                    </span>
                  ) : (
                    'Not linked'
                  )
                }
                icon={
                  <Building2
                    size={15}
                  />
                }
              />

            </div>

          </Section>

        </div>

        {/* ======================================================
            RIGHT
        ====================================================== */}

        <aside className="space-y-6">

          {/* Contact summary */}
          <Section
            eyebrow="Summary"
            title="Relationship profile"
          >

            <div className="flex flex-col items-center text-center">

              <div className="flex h-20 w-20 items-center justify-center rounded-[25px] bg-[#0A0C0B] text-xl font-semibold text-white shadow-[0_12px_35px_rgba(10,12,11,0.12)]">
                {initials}
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-950">
                {fullName}
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Contact record
              </p>

              {organization && (
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/admin/relationships/organizations/${organization.id}`
                    )
                  }
                  className="mt-4 inline-flex max-w-full items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-200"
                >
                  <Building2
                    size={12}
                  />
                  <span className="truncate">
                    {organization.name}
                  </span>
                </button>
              )}

            </div>

          </Section>

          {/* Communication */}
          <Section
            eyebrow="Communication"
            title="Contact actions"
          >

            <div className="space-y-2">

              {contact.email ? (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex h-11 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
                    <Mail size={14} />
                  </div>

                  Send email

                  <ArrowRight
                    size={14}
                    className="ml-auto text-slate-300"
                  />
                </a>
              ) : (
                <div className="flex h-11 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 text-xs text-slate-400">
                  <Mail size={14} />
                  No email available
                </div>
              )}

              {contact.phone ? (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex h-11 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
                    <Phone size={14} />
                  </div>

                  Call contact

                  <ArrowRight
                    size={14}
                    className="ml-auto text-slate-300"
                  />
                </a>
              ) : (
                <div className="flex h-11 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 text-xs text-slate-400">
                  <Phone size={14} />
                  No phone available
                </div>
              )}

            </div>

          </Section>

          {/* Security */}
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