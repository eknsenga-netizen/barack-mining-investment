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
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  ShieldAlert,
  Users,
  UserRound,
  X,
  Plus,
  Globe2,
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

type ActiveTab =
  | 'contacts'
  | 'organizations'

/* ============================================================
   CONSTANTS
============================================================ */

const AUTHORIZED_ROLES: Role[] = [
  'super_admin',
  'admin',
  'opportunity_manager',
]

const ITEMS_PER_PAGE = 10

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

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function formatDateTime(
  value: string | null | undefined
) {
  if (!value) return '—'

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function getFullName(
  contact: Contact
) {
  const value = `${contact.first_name ?? ''} ${
    contact.last_name ?? ''
  }`.trim()

  return value || 'Unnamed contact'
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
   FILTER BADGE
============================================================ */

function FilterBadge({
  label,
  onRemove,
}: {
  label: string
  onRemove: () => void
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm">
      {label}

      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
        aria-label={`Remove ${label}`}
      >
        <X size={12} />
      </button>
    </span>
  )
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState({
  tab,
  filtered,
  onClear,
  onCreate,
}: {
  tab: ActiveTab
  filtered: boolean
  onClear: () => void
  onCreate: () => void
}) {
  const isContacts =
    tab === 'contacts'

  return (
    <div className="rounded-[26px] border border-slate-200 bg-white px-6 py-16 text-center shadow-[0_10px_35px_rgba(15,23,42,0.04)]">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        {isContacts ? (
          <UserRound size={23} />
        ) : (
          <Building2 size={23} />
        )}
      </div>

      <h3 className="mt-5 text-base font-semibold text-slate-950">
        {filtered
          ? `No matching ${
              isContacts
                ? 'contacts'
                : 'organizations'
            }`
          : `No ${
              isContacts
                ? 'contacts'
                : 'organizations'
            } yet`}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {filtered
          ? 'Try changing the search criteria to find another relationship.'
          : `There are currently no ${
              isContacts
                ? 'contacts'
                : 'organizations'
            } in the workspace.`}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-2">

        {filtered && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <X size={14} />
            Clear search
          </button>
        )}

        {!filtered && (
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus size={14} />
            Add{' '}
            {isContacts
              ? 'Contact'
              : 'Organization'}
          </button>
        )}

      </div>
    </div>
  )
}

/* ============================================================
   MOBILE CONTACT CARD
============================================================ */

function ContactCard({
  contact,
  onOpen,
}: {
  contact: Contact
  onOpen: () => void
}) {
  const name = getFullName(contact)

  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-[22px] border border-slate-200 bg-white p-5 text-left shadow-[0_8px_28px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-slate-300"
    >
      <div className="flex items-start justify-between gap-4">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
            {getInitials(name)}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">
              {name}
            </p>

            <p className="mt-1 truncate text-[11px] text-slate-400">
              {contact.country ??
                'No country'}
            </p>
          </div>

        </div>

        <ArrowRight
          size={17}
          className="shrink-0 text-slate-300"
        />
      </div>

      <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">

        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Mail
            size={14}
            className="text-slate-400"
          />
          <span className="truncate">
            {contact.email ?? 'No email'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Phone
            size={14}
            className="text-slate-400"
          />
          <span>
            {contact.phone ?? 'No phone'}
          </span>
        </div>

      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
          Added
        </span>

        <span className="text-[11px] font-medium text-slate-600">
          {formatDate(
            contact.created_at
          )}
        </span>
      </div>
    </button>
  )
}

/* ============================================================
   MOBILE ORGANIZATION CARD
============================================================ */

function OrganizationCard({
  organization,
  onOpen,
}: {
  organization: Organization
  onOpen: () => void
}) {
  const name =
    organization.name ||
    'Unnamed organization'

  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-[22px] border border-slate-200 bg-white p-5 text-left shadow-[0_8px_28px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-slate-300"
    >
      <div className="flex items-start justify-between gap-4">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A0C0B] text-[#D0A765]">
            <Building2 size={18} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">
              {name}
            </p>

            <p className="mt-1 truncate text-[11px] text-slate-400">
              {organizationTypeLabel(
                organization.type
              )}
            </p>
          </div>

        </div>

        <ArrowRight
          size={17}
          className="shrink-0 text-slate-300"
        />
      </div>

      <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">

        <div className="flex items-center gap-2 text-xs text-slate-600">
          <MapPin
            size={14}
            className="text-slate-400"
          />
          <span>
            {organization.country ??
              'No country'}
          </span>
        </div>

        <div className="flex min-w-0 items-center gap-2 text-xs text-slate-600">
          <Globe2
            size={14}
            className="shrink-0 text-slate-400"
          />

          {organization.website ? (
            <span className="truncate">
              {organization.website}
            </span>
          ) : (
            <span className="text-slate-400">
              No website
            </span>
          )}
        </div>

      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
          Added
        </span>

        <span className="text-[11px] font-medium text-slate-600">
          {formatDate(
            organization.created_at
          )}
        </span>
      </div>
    </button>
  )
}

/* ============================================================
   PAGE
============================================================ */

export default function RelationshipsPage() {
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
     DATA
  ---------------------------------------------------------- */

  const [contacts, setContacts] =
    useState<Contact[]>([])

  const [organizations, setOrganizations] =
    useState<Organization[]>([])

  const [loading, setLoading] =
    useState(true)

  const [refreshing, setRefreshing] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  /* ----------------------------------------------------------
     UI
  ---------------------------------------------------------- */

  const [activeTab, setActiveTab] =
    useState<ActiveTab>('contacts')

  const [search, setSearch] =
    useState('')

  const [page, setPage] =
    useState(1)

  /* ==========================================================
     ACCESS CONTROL
  ========================================================== */

  const checkAccess = useCallback(
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
            'Relationship access profile error:',
            profileError
          )

          router.replace('/login')
          return
        }

        const allowed =
          AUTHORIZED_ROLES.includes(
            currentProfile.role as Role
          )

        setProfile(
          currentProfile as Profile
        )

        if (!allowed) {
          setAuthorized(false)
          return
        }

        setAuthorized(true)
      } catch (accessError) {
        console.error(
          'Relationship access error:',
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
    checkAccess()
  }, [checkAccess])

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
     LOAD DATA
  ========================================================== */

  const loadData = useCallback(
    async (isRefresh = false) => {
      if (!authorized) return

      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      setError(null)

      try {
        const [
          contactsResponse,
          organizationsResponse,
        ] = await Promise.all([
          supabase
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
            .order(
              'created_at',
              {
                ascending: false,
              }
            ),

          supabase
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
            .order(
              'created_at',
              {
                ascending: false,
              }
            ),
        ])

        if (contactsResponse.error) {
          console.error(
            'Contacts loading error:',
            contactsResponse.error
          )

          throw new Error(
            'Unable to load contacts.'
          )
        }

        if (
          organizationsResponse.error
        ) {
          console.error(
            'Organizations loading error:',
            organizationsResponse.error
          )

          throw new Error(
            'Unable to load organizations.'
          )
        }

        setContacts(
          (contactsResponse.data as Contact[]) ??
            []
        )

        setOrganizations(
          (organizationsResponse.data as Organization[]) ??
            []
        )
      } catch (loadError) {
        console.error(
          'Relationships loading error:',
          loadError
        )

        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load relationships.'
        )
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [authorized, supabase]
  )

  useEffect(() => {
    if (authorized) {
      loadData()
    }
  }, [authorized, loadData])

  /* ==========================================================
     SEARCH
  ========================================================== */

  const filteredContacts =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase()

      if (!term) {
        return contacts
      }

      return contacts.filter(
        (contact) => {
          const fullName =
            getFullName(
              contact
            ).toLowerCase()

          return (
            fullName.includes(
              term
            ) ||
            (
              contact.email ??
              ''
            )
              .toLowerCase()
              .includes(term) ||
            (
              contact.phone ??
              ''
            )
              .toLowerCase()
              .includes(term) ||
            (
              contact.country ??
              ''
            )
              .toLowerCase()
              .includes(term)
          )
        }
      )
    }, [contacts, search])

  const filteredOrganizations =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase()

      if (!term) {
        return organizations
      }

      return organizations.filter(
        (organization) => {
          return (
            (
              organization.name ??
              ''
            )
              .toLowerCase()
              .includes(term) ||
            (
              organization.type ??
              ''
            )
              .toLowerCase()
              .includes(term) ||
            (
              organization.country ??
              ''
            )
              .toLowerCase()
              .includes(term) ||
            (
              organization.website ??
              ''
            )
              .toLowerCase()
              .includes(term)
          )
        }
      )
    }, [organizations, search])

  const currentList =
    activeTab === 'contacts'
      ? filteredContacts
      : filteredOrganizations

  /* ==========================================================
     PAGINATION
  ========================================================== */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        currentList.length /
          ITEMS_PER_PAGE
      )
    )

  const safePage =
    Math.min(
      page,
      totalPages
    )

  const paginatedItems =
    useMemo(() => {
      const start =
        (safePage - 1) *
        ITEMS_PER_PAGE

      return currentList.slice(
        start,
        start + ITEMS_PER_PAGE
      )
    }, [
      currentList,
      safePage,
    ])

  const rangeStart =
    currentList.length ===
    0
      ? 0
      : (safePage - 1) *
          ITEMS_PER_PAGE +
        1

  const rangeEnd =
    Math.min(
      safePage *
        ITEMS_PER_PAGE,
      currentList.length
    )

  useEffect(() => {
    setPage(1)
  }, [
    search,
    activeTab,
  ])

  /* ==========================================================
     COUNTS
  ========================================================== */

  const counts = useMemo(
    () => ({
      contacts:
        contacts.length,

      organizations:
        organizations.length,

      contactsWithEmail:
        contacts.filter(
          (contact) =>
            Boolean(
              contact.email
            )
        ).length,

      organizationsWithWebsite:
        organizations.filter(
          (organization) =>
            Boolean(
              organization.website
            )
        ).length,
    }),
    [
      contacts,
      organizations,
    ]
  )

  const currentCount =
    activeTab === 'contacts'
      ? filteredContacts.length
      : filteredOrganizations.length

  const hasSearch =
    search.trim() !== ''

  const clearSearch = () => {
    setSearch('')
    setPage(1)
  }

  /* ==========================================================
     LOADING
  ========================================================== */

  if (
    checkingAccess ||
    (loading && !contacts.length && !organizations.length)
  ) {
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
            Preparing relationships
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Verifying access and loading your workspace...
          </p>

        </div>
      </div>
    )
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
            Your current role does not have permission to manage
            contacts and organizations.
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
          HEADER
      ======================================================== */}

      <section>

        <div className="flex flex-wrap items-center gap-2">

          <button
            type="button"
            onClick={() =>
              router.push('/admin')
            }
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeft size={14} />
            Dashboard
          </button>

          <span className="text-slate-300">
            /
          </span>

          <span className="text-xs font-semibold text-slate-700">
            Relationships
          </span>

        </div>

        <div className="mt-6 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">

          <div>

            <div className="flex flex-wrap items-center gap-2">

              <span className="inline-flex h-7 items-center rounded-full bg-[#F3EFE7] px-3 text-[9px] font-bold uppercase tracking-[0.22em] text-[#94713F]">
                Relationships
              </span>

              <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Protected workspace
              </span>

            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-slate-950">
              Contacts & Organizations
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage the people and organizations connected to
              Barack Mining Investment opportunities and relationships.
            </p>

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
              onClick={() => {
                if (
                  activeTab ===
                  'contacts'
                ) {
                  router.push(
                    '/admin/relationships/contacts/new'
                  )
                } else {
                  router.push(
                    '/admin/relationships/organizations/new'
                  )
                }
              }}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.15)] transition hover:bg-slate-800"
            >
              <Plus size={14} />
              Add{' '}
              {activeTab ===
              'contacts'
                ? 'Contact'
                : 'Organization'}
            </button>

          </div>

        </div>

      </section>

      {/* ========================================================
          SUMMARY
      ======================================================== */}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

        <button
          type="button"
          onClick={() =>
            setActiveTab('contacts')
          }
          className={`rounded-[20px] border bg-white p-4 text-left shadow-[0_8px_28px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 ${
            activeTab ===
            'contacts'
              ? 'border-slate-900 ring-1 ring-slate-900'
              : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Contacts
            </span>

            <UserRound
              size={16}
              className="text-slate-400"
            />

          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight">
            {counts.contacts}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            People in the relationship database
          </p>

        </button>

        <button
          type="button"
          onClick={() =>
            setActiveTab(
              'organizations'
            )
          }
          className={`rounded-[20px] border bg-white p-4 text-left shadow-[0_8px_28px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 ${
            activeTab ===
            'organizations'
              ? 'border-slate-900 ring-1 ring-slate-900'
              : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Organizations
            </span>

            <Building2
              size={16}
              className="text-slate-400"
            />

          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight">
            {counts.organizations}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Companies and relationship entities
          </p>

        </button>

        <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.03)]">

          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Contact data
            </span>

            <Mail
              size={16}
              className="text-slate-400"
            />

          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight">
            {counts.contactsWithEmail}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Contacts with an email address
          </p>

        </div>

        <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.03)]">

          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Organization data
            </span>

            <Globe2
              size={16}
              className="text-slate-400"
            />

          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight">
            {
              counts.organizationsWithWebsite
            }
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Organizations with a website
          </p>

        </div>

      </section>

      {/* ========================================================
          ERROR
      ======================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4">

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <ShieldAlert size={16} />
          </div>

          <div className="min-w-0 flex-1">

            <p className="text-sm font-semibold text-red-800">
              Unable to load relationships
            </p>

            <p className="mt-1 text-xs leading-5 text-red-700/80">
              {error}
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              loadData(true)
            }
            className="shrink-0 text-xs font-semibold text-red-700 hover:text-red-900"
          >
            Retry
          </button>

        </div>
      )}

      {/* ========================================================
          TABS + SEARCH
      ======================================================== */}

      <section className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

        <div className="border-b border-slate-100 p-3 sm:p-4">

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

            {/* Tabs */}

            <div className="grid grid-cols-2 rounded-xl border border-slate-200 bg-slate-50 p-1 lg:w-auto lg:min-w-[320px]">

              <button
                type="button"
                onClick={() =>
                  setActiveTab('contacts')
                }
                className={`flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-xs font-semibold transition ${
                  activeTab ===
                  'contacts'
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserRound size={15} />
                Contacts
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[9px] ${
                    activeTab ===
                    'contacts'
                      ? 'bg-white/10 text-white'
                      : 'bg-white text-slate-500'
                  }`}
                >
                  {counts.contacts}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    'organizations'
                  )
                }
                className={`flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-xs font-semibold transition ${
                  activeTab ===
                  'organizations'
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Building2 size={15} />
                Organizations
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[9px] ${
                    activeTab ===
                    'organizations'
                      ? 'bg-white/10 text-white'
                      : 'bg-white text-slate-500'
                  }`}
                >
                  {counts.organizations}
                </span>
              </button>

            </div>

            {/* Search */}

            <div className="relative flex-1 lg:max-w-xl">

              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder={
                  activeTab ===
                  'contacts'
                    ? 'Search name, email, phone or country...'
                    : 'Search name, type, country or website...'
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-11 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
              />

              {search && (
                <button
                  type="button"
                  onClick={
                    clearSearch
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-800"
                >
                  <X size={14} />
                </button>
              )}

            </div>

          </div>
        </div>

        {/* Active search */}

        {hasSearch && (
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-3 sm:px-5">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Active filter
            </span>

            <FilterBadge
              label={`Search: "${search.trim()}"`}
              onRemove={
                clearSearch
              }
            />

          </div>
        )}

      </section>

      {/* ========================================================
          RESULT HEADER
      ======================================================== */}

      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">

        <div>

          <p className="text-sm font-semibold text-slate-900">
            {currentCount}{' '}
            {activeTab ===
            'contacts'
              ? currentCount ===
                1
                ? 'contact'
                : 'contacts'
              : currentCount ===
                1
              ? 'organization'
              : 'organizations'}
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            {hasSearch
              ? 'Matching your current search'
              : activeTab ===
                'contacts'
              ? 'Complete contact register'
              : 'Complete organization register'}
          </p>

        </div>

        {currentCount > 0 && (
          <p className="text-xs text-slate-400">
            Showing {rangeStart}–
            {rangeEnd} of{' '}
            {currentCount}
          </p>
        )}

      </div>

      {/* ========================================================
          CONTENT
      ======================================================== */}

      {currentCount ===
      0 ? (
        <EmptyState
          tab={activeTab}
          filtered={hasSearch}
          onClear={
            clearSearch
          }
          onCreate={() => {
            if (
              activeTab ===
              'contacts'
            ) {
              router.push(
                '/admin/relationships/contacts/new'
              )
            } else {
              router.push(
                '/admin/relationships/organizations/new'
              )
            }
          }}
        />
      ) : (
        <>

          {/* ====================================================
              DESKTOP — CONTACTS
          ==================================================== */}

          {activeTab ===
            'contacts' && (
            <>
              <section className="hidden overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.04)] md:block">

                <div className="overflow-x-auto">

                  <table className="min-w-[850px] w-full text-left">

                    <thead className="border-b border-slate-100 bg-slate-50/70">

                      <tr>

                        <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Contact
                        </th>

                        <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Email
                        </th>

                        <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Phone
                        </th>

                        <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Country
                        </th>

                        <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Added
                        </th>

                        <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Action
                        </th>

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-slate-100">

                      {paginatedItems.map(
                        (item) => {
                          const contact =
                            item as Contact

                          const name =
                            getFullName(
                              contact
                            )

                          return (
                            <tr
                              key={
                                contact.id
                              }
                              onClick={() =>
                                router.push(
                                  `/admin/relationships/contacts/${contact.id}`
                                )
                              }
                              className="group cursor-pointer transition hover:bg-slate-50/70"
                            >

                              <td className="px-5 py-4">

                                <div className="flex items-center gap-3">

                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-[10px] font-bold text-white transition group-hover:bg-[#B87333]">
                                    {getInitials(
                                      name
                                    )}
                                  </div>

                                  <div className="min-w-0">

                                    <p className="truncate text-sm font-semibold text-slate-950">
                                      {name}
                                    </p>

                                    <p className="mt-0.5 truncate text-[11px] text-slate-400">
                                      {contact.organization_id
                                        ? 'Linked to organization'
                                        : 'Independent contact'}
                                    </p>

                                  </div>

                                </div>

                              </td>

                              <td className="px-4 py-4">

                                {contact.email ? (
                                  <a
                                    href={`mailto:${contact.email}`}
                                    onClick={(
                                      event
                                    ) =>
                                      event.stopPropagation()
                                    }
                                    className="inline-flex max-w-[220px] items-center gap-2 truncate text-xs font-medium text-slate-700 transition hover:text-[#A96F35] hover:underline"
                                  >
                                    <Mail
                                      size={
                                        13
                                      }
                                      className="shrink-0 text-slate-400"
                                    />

                                    <span className="truncate">
                                      {
                                        contact.email
                                      }
                                    </span>
                                  </a>
                                ) : (
                                  <span className="text-xs text-slate-400">
                                    —
                                  </span>
                                )}

                              </td>

                              <td className="px-4 py-4">

                                {contact.phone ? (
                                  <a
                                    href={`tel:${contact.phone}`}
                                    onClick={(
                                      event
                                    ) =>
                                      event.stopPropagation()
                                    }
                                    className="inline-flex items-center gap-2 text-xs text-slate-600 hover:underline"
                                  >
                                    <Phone
                                      size={
                                        13
                                      }
                                      className="text-slate-400"
                                    />

                                    {
                                      contact.phone
                                    }
                                  </a>
                                ) : (
                                  <span className="text-xs text-slate-400">
                                    —
                                  </span>
                                )}

                              </td>

                              <td className="px-4 py-4">

                                <span className="inline-flex items-center gap-2 text-xs text-slate-600">
                                  <MapPin
                                    size={
                                      13
                                    }
                                    className="text-slate-400"
                                  />
                                  {
                                    contact.country ??
                                    '—'
                                  }
                                </span>

                              </td>

                              <td className="px-4 py-4">

                                <div>
                                  <p className="text-xs font-medium text-slate-700">
                                    {formatDate(
                                      contact.created_at
                                    )}
                                  </p>

                                  <p className="mt-0.5 text-[10px] text-slate-400">
                                    {formatDateTime(
                                      contact.updated_at
                                    )}
                                  </p>
                                </div>

                              </td>

                              <td className="px-5 py-4 text-right">

                                <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-slate-300 transition group-hover:border-slate-200 group-hover:bg-white group-hover:text-slate-700">
                                  <ArrowRight
                                    size={
                                      16
                                    }
                                  />
                                </div>

                              </td>

                            </tr>
                          )
                        }
                      )}

                    </tbody>

                  </table>

                </div>

                {/* Pagination */}

                <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">

                  <p className="text-xs text-slate-400">
                    Showing{' '}
                    <span className="font-semibold text-slate-600">
                      {rangeStart}
                    </span>{' '}
                    to{' '}
                    <span className="font-semibold text-slate-600">
                      {rangeEnd}
                    </span>
                  </p>

                  <Pagination
                    page={
                      safePage
                    }
                    totalPages={
                      totalPages
                    }
                    onPrevious={() =>
                      setPage(
                        (
                          value
                        ) =>
                          Math.max(
                            1,
                            value -
                              1
                          )
                      )
                    }
                    onNext={() =>
                      setPage(
                        (
                          value
                        ) =>
                          Math.min(
                            totalPages,
                            value +
                              1
                          )
                      )
                    }
                  />

                </div>

              </section>

              {/* Mobile */}

              <section className="space-y-3 md:hidden">

                {paginatedItems.map(
                  (item) => {
                    const contact =
                      item as Contact

                    return (
                      <ContactCard
                        key={
                          contact.id
                        }
                        contact={
                          contact
                        }
                        onOpen={() =>
                          router.push(
                            `/admin/relationships/contacts/${contact.id}`
                          )
                        }
                      />
                    )
                  }
                )}

                <MobilePagination
                  page={
                    safePage
                  }
                  totalPages={
                    totalPages
                  }
                  onPrevious={() =>
                    setPage(
                      (
                        value
                      ) =>
                        Math.max(
                          1,
                          value -
                            1
                        )
                    )
                  }
                  onNext={() =>
                    setPage(
                      (
                        value
                      ) =>
                        Math.min(
                          totalPages,
                          value +
                            1
                        )
                    )
                  }
                />

              </section>
            </>
          )}

          {/* ====================================================
              DESKTOP — ORGANIZATIONS
          ==================================================== */}

          {activeTab ===
            'organizations' && (
            <>
              <section className="hidden overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.04)] md:block">

                <div className="overflow-x-auto">

                  <table className="min-w-[850px] w-full text-left">

                    <thead className="border-b border-slate-100 bg-slate-50/70">

                      <tr>

                        <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Organization
                        </th>

                        <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Type
                        </th>

                        <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Country
                        </th>

                        <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Website
                        </th>

                        <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Added
                        </th>

                        <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Action
                        </th>

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-slate-100">

                      {paginatedItems.map(
                        (item) => {
                          const organization =
                            item as Organization

                          return (
                            <tr
                              key={
                                organization.id
                              }
                              onClick={() =>
                                router.push(
                                  `/admin/relationships/organizations/${organization.id}`
                                )
                              }
                              className="group cursor-pointer transition hover:bg-slate-50/70"
                            >

                              <td className="px-5 py-4">

                                <div className="flex items-center gap-3">

                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A0C0B] text-[#D0A765] transition group-hover:bg-[#B87333] group-hover:text-white">
                                    <Building2
                                      size={
                                        17
                                      }
                                    />
                                  </div>

                                  <div className="min-w-0">

                                    <p className="truncate text-sm font-semibold text-slate-950">
                                      {organization.name ||
                                        'Unnamed organization'}
                                    </p>

                                    <p className="mt-0.5 text-[11px] text-slate-400">
                                      Relationship entity
                                    </p>

                                  </div>

                                </div>

                              </td>

                              <td className="px-4 py-4">

                                <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                                  {organizationTypeLabel(
                                    organization.type
                                  )}
                                </span>

                              </td>

                              <td className="px-4 py-4">

                                <span className="inline-flex items-center gap-2 text-xs text-slate-600">
                                  <MapPin
                                    size={
                                      13
                                    }
                                    className="text-slate-400"
                                  />

                                  {
                                    organization.country ??
                                    '—'
                                  }
                                </span>

                              </td>

                              <td className="px-4 py-4">

                                {organization.website ? (
                                  <a
                                    href={
                                      organization.website
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(
                                      event
                                    ) =>
                                      event.stopPropagation()
                                    }
                                    className="inline-flex max-w-[210px] items-center gap-2 text-xs font-medium text-slate-700 hover:text-[#A96F35] hover:underline"
                                  >
                                    <Globe2
                                      size={
                                        13
                                      }
                                      className="shrink-0 text-slate-400"
                                    />

                                    <span className="truncate">
                                      {
                                        organization.website
                                      }
                                    </span>
                                  </a>
                                ) : (
                                  <span className="text-xs text-slate-400">
                                    —
                                  </span>
                                )}

                              </td>

                              <td className="px-4 py-4">

                                <div>
                                  <p className="text-xs font-medium text-slate-700">
                                    {formatDate(
                                      organization.created_at
                                    )}
                                  </p>

                                  <p className="mt-0.5 text-[10px] text-slate-400">
                                    {formatDateTime(
                                      organization.updated_at
                                    )}
                                  </p>
                                </div>

                              </td>

                              <td className="px-5 py-4 text-right">

                                <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-slate-300 transition group-hover:border-slate-200 group-hover:bg-white group-hover:text-slate-700">
                                  <ArrowRight
                                    size={
                                      16
                                    }
                                  />
                                </div>

                              </td>

                            </tr>
                          )
                        }
                      )}

                    </tbody>

                  </table>

                </div>

                <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">

                  <p className="text-xs text-slate-400">
                    Showing{' '}
                    <span className="font-semibold text-slate-600">
                      {rangeStart}
                    </span>{' '}
                    to{' '}
                    <span className="font-semibold text-slate-600">
                      {rangeEnd}
                    </span>
                  </p>

                  <Pagination
                    page={
                      safePage
                    }
                    totalPages={
                      totalPages
                    }
                    onPrevious={() =>
                      setPage(
                        (
                          value
                        ) =>
                          Math.max(
                            1,
                            value -
                              1
                          )
                      )
                    }
                    onNext={() =>
                      setPage(
                        (
                          value
                        ) =>
                          Math.min(
                            totalPages,
                            value +
                              1
                          )
                      )
                    }
                  />

                </div>

              </section>

              {/* Mobile */}

              <section className="space-y-3 md:hidden">

                {paginatedItems.map(
                  (item) => {
                    const organization =
                      item as Organization

                    return (
                      <OrganizationCard
                        key={
                          organization.id
                        }
                        organization={
                          organization
                        }
                        onOpen={() =>
                          router.push(
                            `/admin/relationships/organizations/${organization.id}`
                          )
                        }
                      />
                    )
                  }
                )}

                <MobilePagination
                  page={
                    safePage
                  }
                  totalPages={
                    totalPages
                  }
                  onPrevious={() =>
                    setPage(
                      (
                        value
                      ) =>
                        Math.max(
                          1,
                          value -
                            1
                        )
                    )
                  }
                  onNext={() =>
                    setPage(
                      (
                        value
                      ) =>
                        Math.min(
                          totalPages,
                          value +
                            1
                        )
                    )
                  }
                />

              </section>
            </>
          )}

        </>
      )}

      {/* ========================================================
          SECURITY FOOTER
      ======================================================== */}

      <section className="rounded-[22px] border border-slate-200/80 bg-white px-5 py-4 shadow-[0_8px_28px_rgba(15,23,42,0.03)]">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2
                size={16}
              />
            </div>

            <div>

              <p className="text-xs font-semibold text-slate-800">
                Protected relationship data
              </p>

              <p className="mt-0.5 text-[10px] leading-5 text-slate-400">
                Access is controlled by authentication, role
                permissions and Supabase Row Level Security.
              </p>

            </div>

          </div>

          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {profile?.role?.replace(
              /_/g,
              ' '
            )}
          </span>

        </div>

      </section>

    </div>
  )
}

/* ============================================================
   PAGINATION
============================================================ */

function Pagination({
  page,
  totalPages,
  onPrevious,
  onNext,
}: {
  page: number
  totalPages: number
  onPrevious: () => void
  onNext: () => void
}) {
  return (
    <div className="flex items-center gap-1">

      <button
        type="button"
        disabled={page <= 1}
        onClick={onPrevious}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft
          size={15}
        />
      </button>

      <span className="px-3 text-xs font-semibold text-slate-600">
        {page} / {totalPages}
      </span>

      <button
        type="button"
        disabled={
          page >= totalPages
        }
        onClick={onNext}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight
          size={15}
        />
      </button>

    </div>
  )
}

/* ============================================================
   MOBILE PAGINATION
============================================================ */

function MobilePagination({
  page,
  totalPages,
  onPrevious,
  onNext,
}: {
  page: number
  totalPages: number
  onPrevious: () => void
  onNext: () => void
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3">

      <button
        type="button"
        disabled={page <= 1}
        onClick={onPrevious}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 disabled:opacity-40"
      >
        <ChevronLeft
          size={16}
        />
      </button>

      <span className="text-xs font-semibold text-slate-600">
        Page {page} of{' '}
        {totalPages}
      </span>

      <button
        type="button"
        disabled={
          page >= totalPages
        }
        onClick={onNext}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 disabled:opacity-40"
      >
        <ChevronRight
          size={16}
        />
      </button>

    </div>
  )
}